import { ConversionRule } from '../types';

export const pageStateConversions: ConversionRule[] = [
  // Convert document.readyState checks to Playwright's waitForFunction
  {
    description: 'Convert document.readyState checks with single quotes',
    priority: 10, // High priority as it's a specific pattern
    pattern:
      /await\s+driver\.executeScript\(\s*["']return\s+document\.readyState\s*===\s*['"]([a-z]+)['"]\s*[^)]*\)/g,
    replacement: (match: string, readyState: string): string => {
      return `await page.waitForFunction(() => document.readyState === '${readyState}')`;
    },
  },
  // Convert document.readyState checks with double quotes
  {
    description: 'Convert document.readyState checks with double quotes',
    priority: 10, // High priority as it's a specific pattern
    pattern:
      /await\s+driver\.executeScript\(\s*["']return\s+document\.readyState\s*===\s*["]([a-z]+)["]\s*[^)]*\)/g,
    replacement: (match: string, readyState: string): string => {
      return `await page.waitForFunction(() => document.readyState === '${readyState}')`;
    },
  },
  // Convert driver.get() to page.goto() with waitUntil: 'load'
  {
    description: 'Convert driver.get() to page.goto() with waitUntil: load',
    priority: 5, // Medium priority as it's a common navigation pattern
    pattern: /await\s+driver\.get\(([^)]+)\)/g,
    replacement: (match: string, url: string): string => {
      return `await page.goto(${url}, { waitUntil: 'load' })`;
    },
  },
  // Convert driver.navigate().to() to page.goto() with waitUntil: 'load'
  {
    description: 'Convert driver.navigate().to() to page.goto() with waitUntil: load',
    priority: 5, // Medium priority as it's a common navigation pattern
    pattern: /await\s+driver\.navigate\(\)\.to\(([^)]+)\)/g,
    replacement: (match: string, url: string): string => {
      return `await page.goto(${url}, { waitUntil: 'load' })`;
    },
  },
];
