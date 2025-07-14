import { ConversionRule } from '../types';

export const screenshotConversions: ConversionRule[] = [
  // Handle takeScreenshot()
  {
    pattern: /(\w+)\.takeScreenshot\(\s*\)/g,
    replacement: 'await page.screenshot()',
    description: 'Convert takeScreenshot() to page.screenshot()',
    priority: 2,
    category: 'screenshot',
  },

  // Convert takeScreenshot with filename
  {
    pattern: /(\w+)\.takeScreenshot\((['"])([^'"]+)\2\)/g,
    replacement: 'await page.screenshot({ path: "$3" })',
    description: 'Convert takeScreenshot(filename) to page.screenshot({ path: filename })',
    priority: 2,
    category: 'screenshot',
  },

  // Alternative pattern for takeScreenshot with filename (handles different quote styles)
  {
    pattern: /(\w+)\.takeScreenshot\(([^)]+)\)/g,
    replacement: (match, driver, filename) => `await page.screenshot({ path: ${filename.trim()} })`,
    description: 'Convert takeScreenshot with filename (alternative pattern)',
    priority: 3, // Higher priority to catch any remaining cases
    category: 'screenshot',
  },

  // Handle getTitle()
  {
    pattern: /(\w+)\.getTitle\(\s*\)/g,
    replacement: 'await page.title()',
    description: 'Convert getTitle() to page.title()',
    priority: 2,
    category: 'page-info',
  },

  // Handle getCurrentUrl()
  {
    pattern: /(\w+)\.getCurrentUrl\(\s*\)/g,
    replacement: 'page.url()',
    description: 'Convert getCurrentUrl() to page.url()',
    priority: 2,
    category: 'page-info',
  },

  // Handle getPageSource()
  {
    pattern: /(\w+)\.getPageSource\(\s*\)/g,
    replacement: 'await page.content()',
    description: 'Convert getPageSource() to page.content()',
    priority: 2,
    category: 'page-info',
  },
];
