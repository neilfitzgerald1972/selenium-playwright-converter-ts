import { ConversionRule } from '../types';

export const windowManagementConversions: ConversionRule[] = [
  // Convert driver.getWindowHandle()
  {
    pattern: /(\w+)\.getWindowHandle\s*\(\s*\)/g,
    replacement: (_match: string, driver: string): string => {
      return `${driver}.context().pages().findIndex(p => p === ${driver}.page)`;
    },
    description: 'Convert getWindowHandle() to Playwright page context',
    priority: 3,
    category: 'window-management',
  },

  // Convert driver.getAllWindowHandles()
  {
    pattern: /(\w+)\.getAllWindowHandles\s*\(\s*\)/g,
    replacement: (_match: string, driver: string): string => {
      return `${driver}.context().pages().map((_, i) => i)`;
    },
    description: 'Convert getAllWindowHandles() to Playwright pages array',
    priority: 3,
    category: 'window-management',
  },

  // Convert driver.switchTo().window(handle)
  {
    pattern: /(\w+)\.switchTo\(\)\.window\(([^)]+)\)/g,
    replacement: (match: string, driver: string, handle: string): string => {
      return [
        'await (async () => {',
        `  const pages = ${driver}.context().pages();`,
        `  const targetPage = pages[${handle}];`,
        `  if (!targetPage) throw new Error('Window/tab not found');`,
        `  ${driver}.page = targetPage;`,
        '  await targetPage.bringToFront();',
        '})()',
      ].join('\n');
    },
    description: 'Convert switchTo().window(handle) to Playwright page switching',
    priority: 3,
    category: 'window-management',
  },

  // Convert driver.switchTo().newWindow()
  {
    pattern: /(\w+)\.switchTo\(\)\.newWindow\(([^)]*)\)/g,
    replacement: (match: string, driver: string, args: string): string => {
      const [url = '"about:blank"', options = '{}'] = args.split(',').map(s => s.trim());
      return [
        'await (async () => {',
        `  const newPage = await ${driver}.context().newPage();`,
        `  await newPage.goto(${url}, ${options});`,
        `  ${driver}.page = newPage;`,
        '  return newPage;',
        '})()',
      ].join('\n');
    },
    description: 'Convert switchTo().newWindow() to Playwright new page',
    priority: 3,
    category: 'window-management',
  },

  // Convert driver.close()
  {
    pattern: /(\w+)\.close\s*\(\s*\)/g,
    replacement: (match: string, driver: string): string => {
      return [
        'await (async () => {',
        `  const pages = ${driver}.context().pages();`,
        '  if (pages.length <= 1) {',
        `    await ${driver}.close();`,
        '  } else {',
        `    const currentPage = ${driver}.page;`,
        '    await currentPage.close();',
        `    ${driver}.page = pages[0]; // Switch to first tab if available`,
        '  }',
        '})()',
      ].join('\n');
    },
    description: 'Convert close() to handle page/tab closing in Playwright',
    priority: 3,
    category: 'window-management',
  },
];
