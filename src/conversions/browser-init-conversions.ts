import { ConversionRule } from '../types';

export const browserInitConversions: ConversionRule[] = [
  // Chrome browser initialization with options
  {
    pattern:
      /const (\w+) = await new Builder\(\)\s*\.forBrowser\(['"]chrome['"]\)\s*\.setChromeOptions\([^)]+\)\s*\.build\(\)/g,
    replacement:
      'const browser = await chromium.launch();\n' +
      'const context = await browser.newContext();\n' +
      'const $1 = await context.newPage()',
    description: 'Convert Chrome WebDriver with options to Playwright',
    priority: 1,
    category: 'browser-init',
  },
  // Chrome browser initialization - simple
  {
    pattern: /const (\w+) = (?:await )?new Builder\(\)\.forBrowser\(['"]chrome['"]\)\.build\(\)/g,
    replacement:
      'const browser = await chromium.launch();\n' +
      'const context = await browser.newContext();\n' +
      'const $1 = await context.newPage()',
    description: 'Convert Chrome WebDriver initialization to Playwright',
    priority: 2,
    category: 'browser-init',
  },

  // Firefox browser initialization with options
  {
    pattern:
      /const (\w+) = await new Builder\(\)\s*\.forBrowser\(['"]firefox['"]\)\s*\.setFirefoxOptions\([^)]+\)\s*\.build\(\)/g,
    replacement:
      'const browser = await firefox.launch();\n' +
      'const context = await browser.newContext();\n' +
      'const $1 = await context.newPage()',
    description: 'Convert Firefox WebDriver with options to Playwright',
    priority: 1,
    category: 'browser-init',
  },
  // Firefox browser initialization - simple
  {
    pattern: /const (\w+) = (?:await )?new Builder\(\)\.forBrowser\(['"]firefox['"]\)\.build\(\)/g,
    replacement:
      'const browser = await firefox.launch();\n' +
      'const context = await browser.newContext();\n' +
      'const $1 = await context.newPage()',
    description: 'Convert Firefox WebDriver initialization to Playwright',
    priority: 2,
    category: 'browser-init',
  },

  // Safari browser initialization
  {
    pattern: /const (\w+) = (?:await )?new Builder\(\)\.forBrowser\(['"]safari['"]\)\.build\(\)/g,
    replacement:
      'const browser = await webkit.launch();\n' +
      'const context = await browser.newContext();\n' +
      'const $1 = await context.newPage()',
    description: 'Convert Safari WebDriver initialization to Playwright',
    priority: 2,
    category: 'browser-init',
  },

  // Browser quit
  {
    pattern: /(\w+)\.quit\(\)/g,
    replacement: 'await browser.close()',
    description: 'Convert WebDriver quit to Playwright close',
    priority: 1,
    category: 'browser-init',
  },

  // Add Playwright imports
  {
    pattern: /^(?!.*import.*playwright).*$/m,
    replacement: (match: string): string => {
      // Only add imports if they don't already exist
      if (
        !match.includes("import { chromium, firefox, webkit } from 'playwright'") &&
        !match.includes('import { chromium, firefox, webkit } from "playwright"')
      ) {
        return "import { chromium, firefox, webkit } from 'playwright';\n\n" + match;
      }
      return match;
    },
    description: 'Add Playwright imports if not present',
    priority: 1000, // Highest priority to run first
    category: 'imports',
  },
  // Handle WebDriver imports - remove or comment
  {
    pattern: /import\s*\{[^}]*Builder[^}]*\}\s*from\s*['"]selenium-webdriver['"];?/g,
    replacement: '// TODO: Remove Selenium WebDriver imports after conversion',
    description: 'Mark Selenium WebDriver imports for removal',
    priority: 100,
    category: 'imports',
  },
];
