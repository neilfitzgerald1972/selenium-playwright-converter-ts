import { ConversionRule } from '../types';

export const navigationConversions: ConversionRule[] = [
  // Convert driver.get() to page.goto() (specific to WebDriver objects, exclude newPage)
  {
    pattern: /(?<!new)(driver|webDriver|browser|selenium)\.get\((['"])([^'"]+)\2\)/g,
    replacement: 'await page.goto($2$3$2)',
    description: 'Convert driver.get() to page.goto()',
    priority: 1,
    category: 'navigation',
  },

  // Convert driver.navigate().to() to page.goto()
  {
    pattern: /(\w+)\.navigate\(\)\.to\((['"])([^'"]+)\2\)/g,
    replacement: 'await page.goto($2$3$2)',
    description: 'Convert driver.navigate().to() to page.goto()',
    priority: 1,
    category: 'navigation',
  },

  // Convert driver.navigate().back() to page.goBack()
  {
    pattern: /(\w+)\.navigate\(\)\.back\(\s*\)/g,
    replacement: 'await page.goBack()',
    description: 'Convert driver.navigate().back() to page.goBack()',
    priority: 1,
    category: 'navigation',
  },

  // Convert driver.navigate().forward() to page.goForward()
  {
    pattern: /(\w+)\.navigate\(\)\.forward\(\s*\)/g,
    replacement: 'await page.goForward()',
    description: 'Convert driver.navigate().forward() to page.goForward()',
    priority: 1,
    category: 'navigation',
  },

  // Convert driver.navigate().refresh() to page.reload()
  {
    pattern: /(\w+)\.navigate\(\)\.refresh\(\s*\)/g,
    replacement: 'await page.reload()',
    description: 'Convert driver.navigate().refresh() to page.reload()',
    priority: 1,
    category: 'navigation',
  },

  // Convert driver.getCurrentUrl() to page.url()
  {
    pattern: /(\w+)\.getCurrentUrl\(\s*\)/g,
    replacement: 'page.url()',
    description: 'Convert driver.getCurrentUrl() to page.url()',
    priority: 1,
    category: 'navigation',
  },

  // Convert driver.getTitle() to page.title()
  {
    pattern: /(\w+)\.getTitle\(\s*\)/g,
    replacement: 'await page.title()',
    description: 'Convert driver.getTitle() to page.title()',
    priority: 1,
    category: 'navigation',
  },

  // Convert driver.goto() to page.goto() (non-standard but used, exclude newPage)
  {
    pattern: /(driver|webDriver|browser|selenium)\.goto\((['"])([^'"]+)\2\)/g,
    replacement: 'await page.goto($2$3$2)',
    description: 'Convert driver.goto() to page.goto()',
    priority: 2,
    category: 'navigation',
  },

  // Convert driver.goBack() to page.goBack()
  {
    pattern: /(\w+)\.goBack\(\s*\)/g,
    replacement: 'await page.goBack()',
    description: 'Convert driver.goBack() to page.goBack()',
    priority: 2,
    category: 'navigation',
  },

  // Convert driver.goForward() to page.goForward()
  {
    pattern: /(\w+)\.goForward\(\s*\)/g,
    replacement: 'await page.goForward()',
    description: 'Convert driver.goForward() to page.goForward()',
    priority: 2,
    category: 'navigation',
  },

  // Convert driver.reload() to page.reload()
  {
    pattern: /(\w+)\.reload\(\s*\)/g,
    replacement: 'await page.reload()',
    description: 'Convert driver.reload() to page.reload()',
    priority: 2,
    category: 'navigation',
  },

  // Convert driver.url() to page.url()
  {
    pattern: /(\w+)\.url\(\s*\)/g,
    replacement: 'page.url()',
    description: 'Convert driver.url() to page.url()',
    priority: 2,
    category: 'navigation',
  },

  // Convert driver.title() to page.title()
  {
    pattern: /(\w+)\.title\(\s*\)/g,
    replacement: 'await page.title()',
    description: 'Convert driver.title() to page.title()',
    priority: 2,
    category: 'navigation',
  },
];
