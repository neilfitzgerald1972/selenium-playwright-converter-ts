/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';
import {
  ConversionRule,
  ConversionResult,
  ConversionStatistics,
  DirectoryConversionResult,
} from './types';
import { conversions } from './conversions';

export class SeleniumToPlaywrightConverter {
  private conversionRules: ConversionRule[] = [];

  constructor() {
    // Use the sorted conversions from the conversions module
    this.conversionRules = [...conversions];
  }

  // Validation function
  private validateSeleniumCode(code: string): string[] {
    const issues: string[] = [];

    const hasSeleniumImports = /import.*selenium-webdriver/.test(code);
    const hasSeleniumUsage = this.conversionRules.some((rule: ConversionRule) =>
      new RegExp(rule.pattern.source).test(code)
    );

    if (!hasSeleniumImports && !hasSeleniumUsage) {
      issues.push('No Selenium imports or usage detected');
    }

    // Check for common issues
    if (code.includes('driver.') && !code.includes('WebDriver')) {
      issues.push('Driver usage found but no WebDriver import detected');
    }

    return issues;
  }

  // Calculate conversion statistics
  private calculateStats(originalCode: string, convertedCode: string): ConversionStatistics {
    const seleniumPatternsFound = this.conversionRules.reduce(
      (count: number, rule: ConversionRule) => {
        const regex = new RegExp(rule.pattern.source, 'g');
        const matches = originalCode.match(regex);
        return count + (matches ? matches.length : 0);
      },
      0
    );

    const playwrightPatternsFound = (convertedCode.match(/page\.|browser\.|context\./g) || [])
      .length;
    const originalLineCount = originalCode.split('\n').length;
    const convertedLineCount = convertedCode.split('\n').length;

    // Count rules applied by category
    const categories: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    this.conversionRules.forEach(rule => {
      if (rule.category) {
        categories[rule.category] = (categories[rule.category] || 0) + 1;
        byCategory[rule.category] = (byCategory[rule.category] || 0) + 1;
      }
    });

    // Calculate complexity score
    let complexityScore = seleniumPatternsFound;
    if (originalCode.includes('Actions') || originalCode.includes('Select')) complexityScore += 5;
    if (originalCode.includes('switchTo')) complexityScore += 3;
    if (originalCode.includes('executeScript')) complexityScore += 4;

    // Determine estimated effort
    const estimatedEffort = complexityScore > 25 ? 'high' : complexityScore > 10 ? 'medium' : 'low';

    return {
      seleniumPatternsFound,
      playwrightPatternsFound,
      estimatedEffort,
      complexityScore,
      originalLineCount,
      convertedLineCount,
      categories,
      manualReviewNeeded: this.conversionRules.some(rule => rule.requiresManualReview),
      timestamp: new Date().toISOString(),
      rulesApplied: this.conversionRules.length,
      totalConversions: seleniumPatternsFound,
      byCategory,
    };
  }

  /**
   * Converts Selenium code to Playwright code.
   * @param seleniumCode Selenium code to convert.
   * @returns Conversion result.
   */
  public convert(seleniumCode: string): ConversionResult {
    const validationIssues = this.validateSeleniumCode(seleniumCode);
    const warnings: string[] = [];

    if (validationIssues.length > 0) {
      warnings.push(...validationIssues.map(issue => `Validation: ${issue}`));
    }

    let convertedCode = seleniumCode;
    const appliedRules: string[] = [];
    let requiresManualReview = false;

    // Sort rules by priority (higher priority first)
    const sortedRules = [...this.conversionRules].sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    );

    // Apply all conversion rules
    for (const rule of sortedRules) {
      const beforeConversion = convertedCode;

      try {
        // Debug logging for dialog handling rules
        if (rule.category === 'dialog-handling') {
          console.log(`\n=== APPLYING RULE: ${rule.description} ===`);
          console.log('Pattern:', rule.pattern);
          console.log('Input code matches pattern?', rule.pattern.test(convertedCode));
          console.log('Input code:', JSON.stringify(convertedCode));
        }

        if (typeof rule.replacement === 'string') {
          convertedCode = convertedCode.replace(rule.pattern, rule.replacement);
        } else {
          convertedCode = convertedCode.replace(rule.pattern, rule.replacement);
        }

        if (beforeConversion !== convertedCode) {
          appliedRules.push(rule.description);

          if (rule.category === 'dialog-handling') {
            console.log('RULE APPLIED SUCCESSFULLY');
            console.log('Converted code:', JSON.stringify(convertedCode));
          }

          // Mark for manual review if TODO is added
          if (rule.replacement.toString().includes('TODO')) {
            requiresManualReview = true;
          }
        } else if (rule.category === 'dialog-handling') {
          console.log('RULE DID NOT MATCH');
        }
      } catch (error) {
        warnings.push(`Failed to apply rule: ${rule.description} - ${error}`);
      }
    }

    // Add standard imports if any rules were applied
    if (appliedRules.length > 0) {
      const additionalImports = [
        "import { test, expect } from '@playwright/test';",
        '',
        "// Note: You'll need to set up browser context and page in your test:",
        "// test('example test', async ({ page }) => {",
        '//   // Your converted code here',
        '// });',
        '',
      ];
      convertedCode = [...additionalImports, convertedCode].join('\n');
    }

    const conversionStats = this.calculateStats(seleniumCode, convertedCode);

    return {
      convertedCode,
      appliedRules,
      warnings,
      requiresManualReview,
      conversionStats,
    };
  }

  /**
   * Converts a file from Selenium to Playwright.
   * @param inputPath Path to the input file.
   * @param outputPath Path to the output file.
   * @returns Conversion result.
   */
  public convertFile(inputPath: string, outputPath?: string): ConversionResult {
    try {
      if (!fs.existsSync(inputPath)) {
        throw new Error(`Input file does not exist: ${inputPath}`);
      }

      const stats = fs.statSync(inputPath);
      if (!stats.isFile()) {
        throw new Error(`Expected file, got directory: ${inputPath}`);
      }

      const seleniumCode = fs.readFileSync(inputPath, 'utf-8');
      const result = this.convert(seleniumCode);

      const output = outputPath || inputPath.replace(/\.(ts|js)$/, '.playwright.ts');

      // Ensure output directory exists
      const outputDir = path.dirname(output);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(output, result.convertedCode);

      return result;
    } catch (error) {
      throw new Error(
        `Failed to convert file ${inputPath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Converts a directory from Selenium to Playwright.
   * @param dirPath Path to the directory.
   * @returns Directory conversion result.
   */
  public convertDirectory(dirPath: string, outputDir?: string): DirectoryConversionResult {
    const files: string[] = [];
    let totalRulesApplied = 0;
    let filesRequiringReview = 0;
    const allWarnings: string[] = [];

    // Initialize stats with default values
    const stats: ConversionStatistics = {
      seleniumPatternsFound: 0,
      playwrightPatternsFound: 0,
      estimatedEffort: 'low',
      complexityScore: 0,
      originalLineCount: 0,
      convertedLineCount: 0,
      categories: {},
      byCategory: {},
      manualReviewNeeded: false,
      timestamp: new Date().toISOString(),
      rulesApplied: 0,
      totalConversions: 0,
    };

    const processFile = (filePath: string): void => {
      try {
        const outputPath = outputDir
          ? path.join(outputDir, path.basename(filePath).replace(/\.(ts|js)$/, '.playwright.ts'))
          : filePath.replace(/\.(ts|js)$/, '.playwright.ts');

        const result = this.convertFile(filePath, outputPath);
        files.push(filePath);

        // Update stats
        stats.seleniumPatternsFound += result.conversionStats.seleniumPatternsFound || 0;
        stats.playwrightPatternsFound += (
          result.convertedCode.match(/page\.|browser\.|context\./g) || []
        ).length;
        stats.originalLineCount += result.conversionStats.originalLineCount || 0;
        stats.convertedLineCount += result.conversionStats.convertedLineCount || 0;
        stats.manualReviewNeeded ||= result.requiresManualReview;
        stats.rulesApplied += result.appliedRules.length;
        stats.totalConversions += result.conversionStats.totalConversions || 0;

        // Update complexity score and effort
        const fileComplexity = result.conversionStats.complexityScore || 0;
        stats.complexityScore = Math.max(stats.complexityScore, fileComplexity);

        // Update categories
        Object.entries(result.conversionStats.categories || {}).forEach(([category, count]) => {
          stats.categories[category] = (stats.categories[category] || 0) + (count as number);
        });

        // Update byCategory
        Object.entries(result.conversionStats.byCategory || {}).forEach(([category, count]) => {
          stats.byCategory[category] = (stats.byCategory[category] || 0) + (count as number);
        });

        totalRulesApplied += result.appliedRules.length;
        if (result.requiresManualReview) filesRequiringReview++;
        allWarnings.push(...result.warnings);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const warning = `Error processing file ${filePath}: ${errorMessage}`;
        console.error(warning);
        allWarnings.push(warning);
      }
    };

    const processDirectory = (currentPath: string): void => {
      if (!fs.existsSync(currentPath)) {
        throw new Error(`Directory does not exist: ${currentPath}`);
      }

      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          // Create corresponding output directory if it doesn't exist
          if (outputDir) {
            const relativePath = path.relative(dirPath, fullPath);
            const targetDir = path.join(outputDir, relativePath);
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
          }
          processDirectory(fullPath);
        } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.js'))) {
          processFile(fullPath);
        }
      }
    };

    // Ensure output directory exists if specified
    if (outputDir && !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    processDirectory(dirPath);

    // Update estimated effort based on final complexity score
    stats.estimatedEffort =
      stats.complexityScore > 25 ? 'high' : stats.complexityScore > 10 ? 'medium' : 'low';
    stats.timestamp = new Date().toISOString();

    return {
      files,
      stats,
      processedFiles: files.length,
      totalRulesApplied,
      filesRequiringReview,
      warnings: allWarnings,
    };
  }
}
