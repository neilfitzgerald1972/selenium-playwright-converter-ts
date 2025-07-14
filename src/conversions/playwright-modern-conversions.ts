import { ConversionRule } from '../types';

export const playwrightModernConversions: ConversionRule[] = [
  // Clock API - Time manipulation patterns
  {
    pattern: /(\w+)\.manage\(\)\.timeouts\(\)\.setScriptTimeout\(([^)]+)\)/g,
    replacement: (match: string, driver: string, timeout: string): string => {
      return (
        `// TODO: Consider using Playwright's Clock API for time-based testing\n` +
        `// await page.clock.install({ time: new Date() });\n` +
        `// await page.clock.fastForward(${timeout});\n` +
        `// Original timeout: ${match}`
      );
    },
    description: 'Suggest Clock API for time-based testing',
    priority: 1,
    category: 'playwright-modern',
  },

  // Enhanced cookie operations with partitionKey - TEMPORARILY DISABLED
  // TODO: Fix rule interference with basic cookie conversion
  // {
  //   pattern: /await (\w+)\.context\(\)\.addCookies\(\[([^\]]+)\]\);?(?!\s*\/\/.*partitionKey)/g,
  //   replacement: (match: string, driver: string, cookies: string): string => {
  //     // Skip if already has partitionKey
  //     if (cookies.includes('partitionKey')) {
  //       return match;
  //     }
  //     // Skip if this looks like output from basic cookie conversion (contains nested braces)
  //     if (cookies.includes('{ {') || (cookies.includes('{') && cookies.split('{').length > 2)) {
  //       return match;
  //     }
  //     return (
  //       `// Enhanced cookie support in Playwright 2024+\n` +
  //       `await ${driver}.context().addCookies([\n` +
  //       `  { ${cookies}, partitionKey: 'https://example.com' } // Add partitionKey for enhanced privacy\n` +
  //       `])`
  //     );
  //   },
  //   description: 'Add partitionKey support for enhanced cookie privacy',
  //   priority: 0, // Lower priority to run after basic conversions
  //   category: 'playwright-modern',
  // },

  // Directory upload support
  {
    pattern: /(\w+)\.setInputFiles\(([^,]+),\s*([^)]+)\)/g,
    replacement: (match: string, element: string, selector: string, files: string): string => {
      return (
        `// Enhanced file upload in Playwright 2024+ supports directories\n` +
        `// For directory uploads, use webkitdirectory input:\n` +
        `await ${element}.setInputFiles([\n` +
        `  { name: 'folder/file1.txt', mimeType: 'text/plain', buffer: Buffer.from('content1') },\n` +
        `  { name: 'folder/file2.txt', mimeType: 'text/plain', buffer: Buffer.from('content2') }\n` +
        `]); // or use ${files} for regular files`
      );
    },
    description: 'Add directory upload support for modern file handling',
    priority: 1,
    category: 'playwright-modern',
  },

  // Aria snapshot testing
  {
    pattern: /(\w+)\.getAttribute\(['"]aria-[^'"]+['"]\)/g,
    replacement: (match: string, element: string): string => {
      // Skip if element name is 'el' (likely inside evaluate function)
      if (element === 'el') {
        return match;
      }
      return (
        `// Consider using Playwright's aria snapshot testing (2024+)\n` +
        `// const snapshot = await ${element}.ariaSnapshot({ ref: true });\n` +
        `// expect(snapshot).toMatchSnapshot('aria-structure.txt');\n` +
        `${match}`
      );
    },
    description: 'Suggest aria snapshot testing for accessibility',
    priority: 1,
    category: 'playwright-modern',
  },

  // Enhanced locator methods
  {
    pattern: /(\w+)\.locator\(([^)]+)\)\.getAttribute\(['"]class['"]\)/g,
    replacement: (match: string, page: string, selector: string): string => {
      return (
        `// Enhanced class checking in Playwright 2024+\n` +
        `// Use toContainClass for better class assertions:\n` +
        `// await expect(${page}.locator(${selector})).toContainClass('expected-class');\n` +
        `${match}`
      );
    },
    description: 'Suggest enhanced class checking methods',
    priority: 1,
    category: 'playwright-modern',
  },

  // API testing integration
  {
    pattern: /(?:await\s+)?(\w+)\.evaluate\(\(\) => fetch\(([^)]+)\)\)/g,
    replacement: (match: string, page: string, url: string): string => {
      return (
        `// Consider using Playwright's API testing capabilities (2024+)\n` +
        `// const response = await ${page}.request.get(${url});\n` +
        `// expect(response.status()).toBe(200);\n` +
        `${match}`
      );
    },
    description: 'Suggest API testing instead of evaluate fetch',
    priority: 1,
    category: 'playwright-modern',
  },

  // Enhanced network interception with maxRedirects - TEMPORARILY DISABLED
  // TODO: Fix rule interference with Selenium 4 NetworkInterceptor conversion
  // {
  //   pattern: /(\w+)\.route\(([^,]+),\s*([^)]+)\);?(?!\s*\/\/.*maxRedirects)/g,
  //   replacement: (match: string, page: string, pattern: string, handler: string): string => {
  //     // Skip if handler looks like a multi-line arrow function (from basic conversion)
  //     if (handler.includes('=>') && handler.includes('{') && !handler.includes('}')) {
  //       return match;
  //     }
  //     // Skip if already has maxRedirects mention
  //     if (match.includes('maxRedirects')) {
  //       return match;
  //     }
  //     return (
  //       `// Enhanced network interception in Playwright 2024+\n` +
  //       `await ${page}.route(${pattern}, ${handler});\n` +
  //       `// Consider using request context with maxRedirects:\n` +
  //       `// const apiContext = await request.newContext({ maxRedirects: 5 });`
  //     );
  //   },
  //   description: 'Add maxRedirects option for network requests',
  //   priority: 0, // Lower priority to run after basic conversions
  //   category: 'playwright-modern',
  // },

  // Enhanced URL matching with ignoreCase
  {
    pattern: /expect\(([^)]+)\)\.toHaveURL\(([^)]+)\)/g,
    replacement: (match: string, page: string, url: string): string => {
      return (
        `// Enhanced URL matching in Playwright 2024+\n` +
        `expect(${page}).toHaveURL(${url}, { ignoreCase: true })`
      );
    },
    description: 'Add ignoreCase option for URL matching',
    priority: 1,
    category: 'playwright-modern',
  },

  // Locator describe method
  {
    pattern: /console\.log\(([^)]+\.locator\([^)]+\)(?:\.[^)]+\(\))?)\)/g,
    replacement: (match: string, locator: string): string => {
      return (
        `// Enhanced locator debugging in Playwright 2024+\n` + `console.log(${locator}.describe())`
      );
    },
    description: 'Use locator.describe() for better debugging',
    priority: 1,
    category: 'playwright-modern',
  },

  // Enhanced cookie clearing with filters
  {
    pattern: /(\w+)\.context\(\)\.clearCookies\(\)/g,
    replacement: (match: string, page: string): string => {
      return (
        `// Enhanced cookie clearing in Playwright 2024+\n` +
        `await ${page}.context().clearCookies();\n` +
        `// Or use filters: await ${page}.context().clearCookies({ domain: 'example.com' });`
      );
    },
    description: 'Add filtered cookie clearing options',
    priority: 1,
    category: 'playwright-modern',
  },

  // Enhanced waitFor with multiple states
  {
    pattern: /(\w+)\.waitFor\(\s*\)/g,
    replacement: (match: string, locator: string): string => {
      return (
        `// Enhanced waitFor options in Playwright 2024+\n` +
        `await ${locator}.waitFor({ state: 'visible' });\n` +
        `// Other states: 'hidden', 'attached', 'detached'`
      );
    },
    description: 'Add explicit state options for waitFor',
    priority: 1,
    category: 'playwright-modern',
  },
];
