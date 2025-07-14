#!/usr/bin/env node
/* eslint-disable no-console */

import { Command } from 'commander';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as path from 'path';
import { SeleniumToPlaywrightConverter } from './converter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom error types
class ConversionError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ConversionError';
  }
}

class FileNotFoundError extends ConversionError {
  constructor(path: string) {
    super(`File or directory does not exist: ${path}`, 'FILE_NOT_FOUND');
  }
}

class InvalidInputError extends ConversionError {
  constructor(message: string) {
    super(message, 'INVALID_INPUT');
  }
}

// Conversion options interface
interface ConversionOptions {
  readonly verbose?: boolean;
  readonly dryRun?: boolean;
  readonly pattern?: string;
}

// Read package.json for version
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

// Input validation functions
function validateInput(input: string, shouldBeDirectory?: boolean): void {
  if (!existsSync(input)) {
    throw new FileNotFoundError(input);
  }

  const stats = statSync(input);
  if (shouldBeDirectory && !stats.isDirectory()) {
    throw new InvalidInputError(`Expected directory, got file: ${input}`);
  }

  if (shouldBeDirectory === false && stats.isDirectory()) {
    throw new InvalidInputError(`Expected file, got directory: ${input}`);
  }

  // Validate file extension for files
  if (!shouldBeDirectory && stats.isFile() && !input.match(/\.(ts|js)$/)) {
    console.warn(chalk.yellow(`⚠️  Warning: File doesn't have .ts or .js extension: ${input}`));
  }
}

// Common conversion logic
async function performConversion(
  input: string,
  output: string | undefined,
  options: ConversionOptions & { isDirectory?: boolean }
): Promise<void> {
  const { verbose = false, dryRun = false, isDirectory = false } = options;

  const spinner = ora('Processing...').start();
  const converter = new SeleniumToPlaywrightConverter();

  try {
    // Validate input
    validateInput(input, isDirectory);

    if (isDirectory) {
      await handleDirectoryConversion(input, output, { verbose, dryRun }, converter, spinner);
    } else {
      await handleFileConversion(input, output, { verbose, dryRun }, converter, spinner);
    }
  } catch (error) {
    await handleConversionError(error, spinner);
  }
}

// File conversion handler
async function handleFileConversion(
  input: string,
  output: string | undefined,
  options: { verbose: boolean; dryRun: boolean },
  converter: SeleniumToPlaywrightConverter,
  spinner: Ora
): Promise<void> {
  if (options.dryRun) {
    spinner.text = 'Analyzing conversion (dry run)...';
    const inputCode = readFileSync(input, 'utf-8');
    const result = converter.convert(inputCode);
    spinner.succeed('Dry run completed');

    console.log(chalk.blue('\n📋 Conversion Preview:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(result.convertedCode);
    console.log(chalk.gray('─'.repeat(50)));

    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'));
      result.warnings.forEach(warning => console.log(chalk.yellow(`  - ${warning}`)));
    }

    return;
  }

  spinner.text = 'Converting Selenium test to Playwright...';
  const result = converter.convertFile(input, output);

  const outputFile = output || input.replace(/\.ts$/, '.playwright.ts');
  spinner.succeed('✅ Converted successfully!');

  console.log(chalk.green(`\n📄 Input:  ${input}`));
  console.log(chalk.green(`📄 Output: ${outputFile}`));

  if (result.warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  Warnings:'));
    result.warnings.forEach(warning => console.log(chalk.yellow(`  - ${warning}`)));
  }

  if (options.verbose) {
    console.log(chalk.blue('\n📊 Conversion Statistics:'));
    console.log(`  - Applied rules: ${result.appliedRules.length}`);
    console.log(`  - Manual review required: ${result.requiresManualReview ? 'Yes' : 'No'}`);

    console.log(chalk.blue('\n💡 Next steps:'));
    console.log('  1. Review TODO comments in the converted file');
    console.log('  2. Set up Playwright test configuration');
    console.log('  3. Run: npx playwright test');
  }
}

// Directory conversion handler
async function handleDirectoryConversion(
  inputDir: string,
  outputDir: string | undefined,
  options: { verbose: boolean; dryRun: boolean },
  converter: SeleniumToPlaywrightConverter,
  spinner: Ora
): Promise<void> {
  if (options.dryRun) {
    spinner.text = 'Analyzing directory (dry run)...';

    const files = readdirSync(inputDir);
    const tsFiles = files.filter((file: string) => file.endsWith('.ts') || file.endsWith('.js'));

    spinner.succeed('Dry run completed');
    console.log(chalk.blue(`\n📋 Would convert ${tsFiles.length} files:`));
    tsFiles.forEach((file: string) => {
      console.log(chalk.gray(`  - ${file} → ${file.replace(/\.(ts|js)$/, '.playwright.ts')}`));
    });
    console.log(
      chalk.blue(
        `\n📁 Output directory: ${outputDir || path.join(inputDir, 'playwright-converted')}`
      )
    );
    return;
  }

  spinner.text = 'Converting directory of Selenium tests...';
  const result = converter.convertDirectory(inputDir, outputDir);

  spinner.succeed('✅ Directory conversion completed!');

  const outDir = outputDir || path.join(inputDir, 'playwright-converted');
  console.log(chalk.green(`\n📁 Input:  ${inputDir}`));
  console.log(chalk.green(`📁 Output: ${outDir}`));

  if (options.verbose) {
    console.log(chalk.blue('\n📊 Conversion Statistics:'));
    console.log(`  - Converted files: ${result.processedFiles}`);
    console.log(`  - Total rules applied: ${result.totalRulesApplied}`);
    console.log(`  - Files requiring review: ${result.filesRequiringReview}`);

    console.log(chalk.blue('\n💡 Next steps:'));
    console.log('  1. Review TODO comments in all converted files');
    console.log('  2. Set up Playwright test configuration');
    console.log('  3. Update import paths if needed');
    console.log('  4. Run: npx playwright test');
  }
}

// Error handler
async function handleConversionError(error: unknown, spinner: Ora): Promise<never> {
  spinner.fail('Conversion failed');

  if (error instanceof ConversionError) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    if (error.code === 'FILE_NOT_FOUND') {
      console.error(chalk.gray('   Hint: Check the file path and ensure it exists'));
    }
  } else {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`❌ Unexpected error: ${errorMessage}`));
  }

  // Small delay to ensure error message is written before exit
  await new Promise(resolve => setTimeout(resolve, 10));
  process.exit(1);
}

// Configure program
program
  .name('sel2pw')
  .description('Convert Selenium WebDriver TypeScript tests to Playwright')
  .version(packageJson.version);

// File conversion command
program
  .command('file')
  .description('Convert a single Selenium test file to Playwright')
  .argument('<input>', 'Input Selenium TypeScript file')
  .argument('[output]', 'Output file path (optional)')
  .option('-v, --verbose', 'Show detailed conversion information')
  .option('--dry-run', 'Show what would be converted without writing files')
  .action(async (input: string, output: string | undefined, options: ConversionOptions) => {
    await performConversion(input, output, { ...options, isDirectory: false });
  });

// Directory conversion command
program
  .command('dir')
  .description('Convert all Selenium test files in a directory to Playwright')
  .argument('<input-dir>', 'Input directory containing Selenium tests')
  .argument('[output-dir]', 'Output directory for converted tests (optional)')
  .option('-v, --verbose', 'Show detailed conversion information')
  .option('--dry-run', 'Show what would be converted without writing files')
  .option('-p, --pattern <pattern>', 'File pattern to match (default: "*.ts")', '*.ts')
  .action(async (inputDir: string, outputDir: string | undefined, options: ConversionOptions) => {
    await performConversion(inputDir, outputDir, { ...options, isDirectory: true });
  });

// Quick conversion command (default behavior)
program
  .argument('[input]', 'Input file or directory')
  .argument('[output]', 'Output file or directory (optional)')
  .option('-d, --dir', 'Treat input as directory')
  .option('-v, --verbose', 'Show detailed conversion information')
  .option('--dry-run', 'Show what would be converted without writing files')
  .action(
    async (
      input: string | undefined,
      output: string | undefined,
      options: ConversionOptions & { dir?: boolean }
    ) => {
      if (!input) {
        program.help();
        return;
      }

      try {
        // Auto-detect if input is a directory
        const isDirectory = options.dir || (existsSync(input) && statSync(input).isDirectory());
        await performConversion(input, output, { ...options, isDirectory });
      } catch (error) {
        await handleConversionError(error, ora('Processing...'));
      }
    }
  );

// Examples and help
program.on('--help', () => {
  console.log(chalk.blue('\n📚 Examples:'));
  console.log('  $ sel2pw login-test.ts                    # Convert single file');
  console.log('  $ sel2pw login-test.ts login-pw.ts        # Convert with custom output');
  console.log('  $ sel2pw ./tests ./playwright-tests      # Convert directory');
  console.log('  $ sel2pw file login-test.ts --verbose     # Verbose single file');
  console.log('  $ sel2pw dir ./tests --dry-run           # Preview directory conversion');
  console.log('');
  console.log(
    chalk.yellow('💡 Pro tip: Review TODO comments in converted files for manual adjustments!')
  );
});

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`❌ Invalid command: ${program.args.join(' ')}`));
  console.error('See --help for a list of available commands.');
  process.exit(1);
});

// Show help when no arguments provided
if (process.argv.length === 2) {
  program.help();
}

program.parse();
