import { ConversionRule } from '../types';

export const waitConversions: ConversionRule[] = [
  // Handle Selenium 4 Duration-based waits
  {
    pattern: /(\w+)\.wait\(([^,]+),\s*Duration\.ofSeconds\((\d+)\)\)/g,
    replacement: (match: string, driver: string, condition: string, seconds: string): string => {
      if (condition.includes('until.elementLocated')) {
        const locatorMatch = /until\.elementLocated\(([^)]+)\)/.exec(condition);
        if (locatorMatch) {
          return `page.waitForSelector('${locatorMatch[1]}', { timeout: ${seconds} * 1000 })`;
        }
      } else if (condition.includes('until.elementIsVisible')) {
        const elementMatch = /until\.elementIsVisible\(([^)]+)\)/.exec(condition);
        if (elementMatch) {
          return `${elementMatch[1]}.waitFor({ state: 'visible', timeout: ${seconds} * 1000 })`;
        }
      } else if (condition.includes('until.elementIsClickable')) {
        const elementMatch = /until\.elementIsClickable\(([^)]+)\)/.exec(condition);
        if (elementMatch) {
          return `${elementMatch[1]}.waitFor({ state: 'visible', timeout: ${seconds} * 1000 })`;
        }
      }
      return `// TODO: Manual conversion needed for Duration-based wait: ${match}`;
    },
    description: 'Convert Selenium 4 Duration-based waits to Playwright',
    priority: 1,
    category: 'wait',
  },

  // Handle WebDriverWait with Duration
  {
    pattern: /new WebDriverWait\(([^,]+),\s*Duration\.ofSeconds\((\d+)\)\)\.until\(([^)]+)\)/g,
    replacement: (match: string, driver: string, seconds: string, condition: string): string => {
      if (condition.includes('until.elementLocated')) {
        const locatorMatch = /until\.elementLocated\(([^)]+)\)/.exec(condition);
        if (locatorMatch) {
          return `page.waitForSelector('${locatorMatch[1]}', { timeout: ${seconds} * 1000 })`;
        }
      } else if (condition.includes('until.elementIsVisible')) {
        const elementMatch = /until\.elementIsVisible\(([^)]+)\)/.exec(condition);
        if (elementMatch) {
          return `${elementMatch[1]}.waitFor({ state: 'visible', timeout: ${seconds} * 1000 })`;
        }
      } else if (condition.includes('until.elementIsClickable')) {
        const elementMatch = /until\.elementIsClickable\(([^)]+)\)/.exec(condition);
        if (elementMatch) {
          return `${elementMatch[1]}.waitFor({ state: 'visible', timeout: ${seconds} * 1000 })`;
        }
      }
      return `// TODO: Manual conversion needed for WebDriverWait with Duration: ${match}`;
    },
    description: 'Convert WebDriverWait with Duration to Playwright',
    priority: 1,
    category: 'wait',
  },

  // Handle explicit waits with WebDriverWait (legacy)
  {
    pattern: /new WebDriverWait\(([^,]+),\s*(\d+)\)\.until\(([^)]+)\)/g,
    replacement: (match: string, driver: string, timeout: string, condition: string): string => {
      // Handle common conditions
      if (condition.includes('elementToBeClickable')) {
        const elementMatch = /elementToBeClickable\(([^)]+)\)/.exec(condition);
        if (elementMatch) {
          return `${elementMatch[1]}.click({ timeout: ${timeout} * 1000 })`;
        }
      } else if (condition.includes('visibilityOfElementLocated')) {
        const locatorMatch = /visibilityOfElementLocated\(([^)]+)\)/.exec(condition);
        if (locatorMatch) {
          return `${locatorMatch[1]}.waitFor({ state: 'visible', timeout: ${timeout} * 1000 })`;
        }
      } else if (condition.includes('presenceOfElementLocated')) {
        const locatorMatch = /presenceOfElementLocated\(([^)]+)\)/.exec(condition);
        if (locatorMatch) {
          return `${locatorMatch[1]}.waitFor({ state: 'attached', timeout: ${timeout} * 1000 })`;
        }
      } else if (condition.includes('titleContains')) {
        const titleMatch = /titleContains\(['"]([^'"]+)['"]\)/.exec(condition);
        if (titleMatch) {
          return `${driver}.waitForFunction(\`document.title.includes('${titleMatch[1]}')\`, { timeout: ${timeout} * 1000 })`;
        }
      }

      // Fallback to generic wait
      return `${condition}.catch(() => ${driver}.waitForTimeout(${timeout} * 1000).then(() => ${condition}))`;
    },
    description: 'Convert WebDriverWait to Playwright wait',
    priority: 3,
    category: 'wait',
  },

  // Handle implicit waits (not recommended in Playwright)
  {
    pattern: /(\w+)\.manage\(\)\.setTimeout\(\{\s*implicit\s*:\s*(\d+)\s*\}\)/g,
    replacement:
      "// Implicit waits are not recommended in Playwright\n// Consider using explicit waits or Playwright's auto-waiting\n// Original: $1.manage().setTimeout({ implicit: $2 })",
    description: 'Convert implicit wait to comment',
    priority: 2,
    category: 'wait',
  },

  // Handle pageLoadTimeout
  {
    pattern: /(\w+)\.manage\(\)\.setTimeouts\(\{\s*pageLoad\s*:\s*(\d+)\s*\}\)/g,
    replacement: '// Set page load timeout\n$1.setDefaultTimeout($2 * 1000)',
    description: 'Convert pageLoadTimeout to setDefaultTimeout',
    priority: 2,
    category: 'wait',
  },

  // Handle scriptTimeout
  {
    pattern: /(\w+)\.manage\(\)\.setTimeouts\(\{\s*script\s*:\s*(\d+)\s*\}\)/g,
    replacement: '// Set script timeout\n$1.setDefaultTimeout($2 * 1000)',
    description: 'Convert scriptTimeout to setDefaultTimeout',
    priority: 2,
    category: 'wait',
  },
];
