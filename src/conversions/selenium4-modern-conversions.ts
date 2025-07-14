import { ConversionRule } from '../types';

export const selenium4ModernConversions: ConversionRule[] = [
  // CDP Connection Creation
  {
    pattern: /(\w+)\.createCDPConnection\(['"]([^'"]+)['"]\)/g,
    replacement: (match: string, driver: string, _target: string): string => {
      return (
        `// TODO: Manual conversion needed - CDP not directly supported in Playwright\n` +
        `// Consider using Playwright's built-in CDP session:\n` +
        `// const cdpSession = await ${driver}.context().newCDPSession(${driver})`
      );
    },
    description: 'Convert CDP connection creation (requires manual review)',
    priority: 1,
    category: 'selenium4-modern',
  },

  // CDP Command Execution
  {
    pattern: /(\w+)\.executeCdpCommand\(['"]([^'"]+)['"],\s*([^)]+)\)/g,
    replacement: (match: string, driver: string, command: string, params: string): string => {
      return (
        `// TODO: Manual conversion needed - CDP command execution\n` +
        `// const cdpSession = await ${driver}.context().newCDPSession(${driver});\n` +
        `// await cdpSession.send('${command}', ${params})`
      );
    },
    description: 'Convert CDP command execution (requires manual review)',
    priority: 1,
    category: 'selenium4-modern',
  },

  // BiDi Connection Creation
  {
    pattern: /(\w+)\.createBiDiConnection\(\s*\)/g,
    replacement: (match: string, driver: string): string => {
      return (
        `// TODO: Manual conversion needed - BiDi not directly supported in Playwright\n` +
        `// Consider using Playwright's event listeners:\n` +
        `// ${driver}.on('request', request => { /* handle request */ })\n` +
        `// ${driver}.on('response', response => { /* handle response */ })`
      );
    },
    description: 'Convert BiDi connection creation (requires manual review)',
    priority: 1,
    category: 'selenium4-modern',
  },

  // Window Management - setRect
  {
    pattern: /(\w+)\.manage\(\)\.window\(\)\.setRect\(([^)]+)\)/g,
    replacement: (match: string, driver: string, rect: string): string => {
      return (
        `// TODO: Manual conversion needed - Window sizing not directly supported in Playwright\n` +
        `// Consider setting viewport size in browser context:\n` +
        `// await ${driver}.setViewportSize(${rect})`
      );
    },
    description: 'Convert window setRect (requires manual review)',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Window Management - getRect
  {
    pattern: /(\w+)\.manage\(\)\.window\(\)\.getRect\(\s*\)/g,
    replacement: (match: string, driver: string): string => {
      return (
        `// TODO: Manual conversion needed - Window rect not directly available in Playwright\n` +
        `// Consider using viewport size:\n` +
        `// const viewport = ${driver}.viewportSize()`
      );
    },
    description: 'Convert window getRect (requires manual review)',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Window Management - maximize
  {
    pattern: /(\w+)\.manage\(\)\.window\(\)\.maximize\(\s*\)/g,
    replacement: (match: string, driver: string): string => {
      return (
        `// TODO: Manual conversion needed - Window maximize not supported in Playwright\n` +
        `// Consider setting a large viewport size:\n` +
        `// await ${driver}.setViewportSize({ width: 1920, height: 1080 })`
      );
    },
    description: 'Convert window maximize (requires manual review)',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Window Management - minimize
  {
    pattern: /(\w+)\.manage\(\)\.window\(\)\.minimize\(\s*\)/g,
    replacement: (match: string, driver: string): string => {
      return (
        `// TODO: Manual conversion needed - Window minimize not supported in Playwright\n` +
        `// Consider setting a small viewport size:\n` +
        `// await ${driver}.setViewportSize({ width: 320, height: 240 })`
      );
    },
    description: 'Convert window minimize (requires manual review)',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Window Management - fullscreen
  {
    pattern: /(\w+)\.manage\(\)\.window\(\)\.fullscreen\(\s*\)/g,
    replacement: (match: string, driver: string): string => {
      return (
        `// TODO: Manual conversion needed - Window fullscreen not supported in Playwright\n` +
        `// Consider setting fullscreen viewport:\n` +
        `// await ${driver}.setViewportSize({ width: 1920, height: 1080 })`
      );
    },
    description: 'Convert window fullscreen (requires manual review)',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Network Interception - Selenium 4 NetworkInterceptor
  {
    pattern: /const\s+(\w+)\s*=\s*await\s+(\w+)\.createNetworkInterceptor\(\s*\);?/g,
    replacement: (match: string, varName: string, driver: string): string => {
      return (
        `// Network interception in Playwright\n` +
        `await ${driver}.route('**/*', (route) => {\n` +
        `  // Handle request interception\n` +
        `  route.continue();\n` +
        `})`
      );
    },
    description: 'Convert Selenium 4 NetworkInterceptor to Playwright route',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Selenium 4 - New Window API
  {
    pattern: /(?:await\s+)?(\w+)\.switchTo\(\)\.newWindow\(['"]([^'"]+)['"]\);?/g,
    replacement: (match: string, driver: string, type: string): string => {
      if (type === 'tab') {
        return (
          `const newPage = await ${driver}.context().newPage();\n` +
          `await newPage.goto('about:blank');\n` +
          `// Switch to new page\n` +
          `${driver} = newPage`
        );
      } else if (type === 'window') {
        return (
          `// TODO: Manual conversion needed - New window not directly supported\n` +
          `// Consider using a new browser context:\n` +
          `// const newContext = await browser.newContext();\n` +
          `// const newPage = await newContext.newPage()`
        );
      }
      return match;
    },
    description: 'Convert Selenium 4 new window API to Playwright',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Local Storage Operations
  {
    pattern:
      /(\w+)\.executeScript\(['"]return window\.localStorage\.getItem\(\\?['"]([^'"]+)\\?['"]\)['"]\)/g,
    replacement: (match: string, driver: string, key: string): string => {
      return `await ${driver}.evaluate((key) => localStorage.getItem(key), '${key}')`;
    },
    description: 'Convert localStorage.getItem to Playwright evaluate',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Local Storage - setItem
  {
    pattern:
      /(\w+)\.executeScript\(['"]window\.localStorage\.setItem\(\\?['"]([^'"]+)\\?['"],\s*\\?['"]([^'"]+)\\?['"]\)['"]\)/g,
    replacement: (match: string, driver: string, key: string, value: string): string => {
      return `await ${driver}.evaluate(({ key, value }) => localStorage.setItem(key, value), { key: '${key}', value: '${value}' })`;
    },
    description: 'Convert localStorage.setItem to Playwright evaluate',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Session Storage Operations
  {
    pattern:
      /(\w+)\.executeScript\(['"]return window\.sessionStorage\.getItem\(\\?['"]([^'"]+)\\?['"]\)['"]\)/g,
    replacement: (match: string, driver: string, key: string): string => {
      return `await ${driver}.evaluate((key) => sessionStorage.getItem(key), '${key}')`;
    },
    description: 'Convert sessionStorage.getItem to Playwright evaluate',
    priority: 20,
    category: 'selenium4-modern',
  },

  // Session Storage - setItem
  {
    pattern:
      /(\w+)\.executeScript\(['"]window\.sessionStorage\.setItem\(\\?['"]([^'"]+)\\?['"],\s*\\?['"]([^'"]+)\\?['"]\)['"]\)/g,
    replacement: (match: string, driver: string, key: string, value: string): string => {
      return `await ${driver}.evaluate(({ key, value }) => sessionStorage.setItem(key, value), { key: '${key}', value: '${value}' })`;
    },
    description: 'Convert sessionStorage.setItem to Playwright evaluate',
    priority: 20,
    category: 'selenium4-modern',
  },
];
