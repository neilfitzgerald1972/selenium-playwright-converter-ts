import { ConversionRule } from '../types';

export const browserConversions: ConversionRule[] = [
  // Handle browser.get()
  {
    pattern: /(\w+)\.get\(['"]([^'"]+)['"]\)/g,
    replacement: "$1.goto('$2')",
    description: 'Convert browser.get() to page.goto()',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.navigate().to()
  {
    pattern: /(\w+)\.navigate\(\)\.to\(['"]([^'"]+)['"]\)/g,
    replacement: "$1.goto('$2')",
    description: 'Convert browser.navigate().to() to page.goto()',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.getCurrentUrl()
  {
    pattern: /(\w+)\.getCurrentUrl\(\)/g,
    replacement: '$1.url()',
    description: 'Convert getCurrentUrl() to url()',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.getTitle()
  {
    pattern: /(\w+)\.getTitle\(\)/g,
    replacement: '$1.title()',
    description: 'Convert getTitle() to title()',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.navigate().back()
  {
    pattern: /(\w+)\.navigate\(\)\.back\(\)/g,
    replacement: '$1.goBack()',
    description: 'Convert navigate().back() to goBack()',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.navigate().forward()
  {
    pattern: /(\w+)\.navigate\(\)\.forward\(\)/g,
    replacement: '$1.goForward()',
    description: 'Convert navigate().forward() to goForward()',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.navigate().refresh()
  {
    pattern: /(\w+)\.navigate\(\)\.refresh\(\)/g,
    replacement: '$1.reload()',
    description: 'Convert navigate().refresh() to reload()',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.manage().window().maximize()
  {
    pattern: /(\w+)\.manage\(\)\.window\(\)\.maximize\(\)/g,
    replacement: '$1.setViewportSize($1.viewportSize()?.max || { width: 1920, height: 1080 })',
    description: 'Convert window maximize to set viewport size',
    priority: 2,
    category: 'browser',
  },

  // Handle browser.manage().deleteAllCookies()
  {
    pattern: /(\w+)\.manage\(\)\.deleteAllCookies\(\)/g,
    replacement:
      '$1.context().cookies().then(cookies => {\
      return Promise.all(cookies.map(cookie => \
        $1.context().clearCookies({ name: cookie.name })\
      ));\
    })',
    description: 'Convert deleteAllCookies to clear cookies via context',
    priority: 2,
    category: 'browser',
  },
];
