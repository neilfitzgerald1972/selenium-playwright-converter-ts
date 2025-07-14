import { ConversionRule } from '../types';

export const performanceLoggingConversions: ConversionRule[] = [
  // Convert enablePerformanceLogging - exact test format
  {
    pattern:
      /const options = new chrome\.Options\(\)\s*;\s*options\.setLoggingPrefs\(\s*\{\s*performance: 'ALL',\s*browser: 'ALL'\s*\}\)/g,
    replacement: "const options = {\n      performance: 'all',\n      browser: 'all'\n    }",
    description: 'Convert Chrome options with performance logging',
    priority: 10,
    category: 'performance',
  },

  // Convert getLogs for performance logs
  {
    pattern: /const (\w+) = driver\.manage\(\)\.logs\(\)\.get\(\s*'performance'\s*\)/g,
    replacement: 'const $1 = await page.evaluate(() => window.performance.getEntries())',
    description: 'Convert getLogs for performance logs',
    priority: 10,
    category: 'performance',
  },

  // Convert performance timing - exact test format
  {
    pattern: /const (\w+) = driver\.executeScript\('return window\.performance\.timing'\)/g,
    replacement: 'const $1 = await page.evaluate(() => window.performance.timing)',
    description: 'Convert window.performance.timing access',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.mark - exact format
  {
    pattern: /driver\.executeScript\('performance\.mark\(([^)]+)\)'\)/g,
    replacement: (_match, markName): string => {
      // Handle escaped quotes and ensure proper quoting
      const cleanMarkName = markName
        .trim()
        .replace(/\\'/g, "'")
        .replace(/^['"](.*)['"]$/, (_, p1) => `'${p1}'`);
      return `await page.evaluate(() => performance.mark(${cleanMarkName}))`;
    },
    description: 'Convert performance.mark',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.measure - exact format
  {
    pattern: /driver\.executeScript\('performance\.measure\(([^)]+)\)'\)/g,
    replacement: (_match: string, args: string): string => {
      // Handle the measure arguments properly and ensure they're quoted
      const splitArgs = args
        .split(',')
        .map(s => {
          const trimmed = s.trim().replace(/\\'/g, "'");
          // If not already quoted, add single quotes
          return /^['"].*['"]$/.test(trimmed) ? trimmed : `'${trimmed}'`;
        })
        .filter(arg => arg && arg !== 'undefined');

      return `await page.evaluate(() => performance.measure(${splitArgs.join(', ')}))`;
    },
    description: 'Convert performance.measure',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.getEntriesByType - exact format
  {
    pattern:
      /const (\w+) = driver\.executeScript\('return ((?:window\.)?performance)\.getEntriesByType\(([^)]+)\)'\)/g,
    replacement: (_match: string, varName: string, perfObject: string, type: string): string => {
      const cleanType = type.trim().replace(/\\'/g, "'");
      return `const ${varName} = await page.evaluate(() => ${perfObject}.getEntriesByType(${cleanType}))`;
    },
    description: 'Convert performance.getEntriesByType',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.now()
  {
    pattern: /const (\w+) = driver\.executeScript\('return performance\.now\(\)'\)/g,
    replacement: 'const $1 = await page.evaluate(() => performance.now())',
    description: 'Convert performance.now()',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.clearMarks()
  {
    pattern: /driver\.executeScript\('performance\.clearMarks\(\)'\)/g,
    replacement: 'await page.evaluate(() => performance.clearMarks())',
    description: 'Convert performance.clearMarks',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.clearMarks(name)
  {
    pattern: /driver\.executeScript\('performance\.clearMarks\(([^)]+)\)'\)/g,
    replacement: (_match: string, name: string): string => {
      // Handle escaped quotes and ensure proper quoting
      const cleanName = name
        .trim()
        .replace(/\\'/g, "'")
        .replace(/^['"](.*)['"]$/, (_, p1) => `'${p1}'`);
      return `await page.evaluate(() => performance.clearMarks(${cleanName}))`;
    },
    description: 'Convert performance.clearMarks with name',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.clearMeasures()
  {
    pattern: /driver\.executeScript\('performance\.clearMeasures\(\)'\)/g,
    replacement: 'await page.evaluate(() => performance.clearMeasures())',
    description: 'Convert performance.clearMeasures',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.clearMeasures(name)
  {
    pattern: /driver\.executeScript\('performance\.clearMeasures\(([^)]+)\)'\)/g,
    replacement: (_match: string, name: string): string => {
      // Handle escaped quotes and ensure proper quoting
      const cleanName = name
        .trim()
        .replace(/\\'/g, "'")
        .replace(/^['"](.*)['"]$/, (_, p1) => `'${p1}'`);
      return `await page.evaluate(() => performance.clearMeasures(${cleanName}))`;
    },
    description: 'Convert performance.clearMeasures with name',
    priority: 10,
    category: 'performance',
  },

  // Convert performance.memory access
  {
    pattern: /const (\w+) = driver\.executeScript\('return window\.performance\.memory'\)/g,
    replacement: 'const $1 = await page.evaluate(() => (window as any).performance.memory)',
    description: 'Convert performance.memory access',
    priority: 10,
    category: 'performance',
  },
];
