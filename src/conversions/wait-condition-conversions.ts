import { ConversionRule } from '../types';

export const waitConditionConversions: ConversionRule[] = [
  // Convert driver.wait(until.elementLocated()) to page.waitForSelector()
  {
    pattern:
      /(\w+)\.wait\(until\.elementLocated\(By\.(id|css|xpath)\((['"])([^'"]+)\3\),\s*(\d+)\)/g,
    replacement: (
      match: string,
      driver: string,
      locatorType: string,
      quote: string,
      selector: string,
      timeout: string
    ): string => {
      let playLocator = selector;
      if (locatorType === 'id') {
        playLocator = `#${selector}`;
      } else if (locatorType === 'xpath') {
        playLocator = `xpath=${selector}`;
      }
      return `await page.waitForSelector('${playLocator}', { timeout: ${timeout} })`;
    },
    description: 'Convert driver.wait(until.elementLocated()) to page.waitForSelector()',
    priority: 2,
    category: 'wait',
  },

  // Convert driver.wait(until.elementLocated()) with By.id to page.waitForSelector() with #
  {
    pattern: /(\w+)\.wait\(until\.elementLocated\(By\.id\(['"]([^'"]+)['"]\)\),\s*(\d+)\)/g,
    replacement: "await page.waitForSelector('#$2', { timeout: $3 })",
    description: 'Convert wait for element by ID to waitForSelector with #',
    priority: 3, // Higher priority than the more general pattern
    category: 'wait',
  },

  // Convert driver.wait(until.elementLocated()) with By.css to page.waitForSelector()
  {
    pattern: /(\w+)\.wait\(until\.elementLocated\(By\.css\(['"]([^'"]+)['"]\)\),\s*(\d+)\)/g,
    replacement: "await page.waitForSelector('$2', { timeout: $3 })",
    description: 'Convert wait for element by CSS to waitForSelector',
    priority: 3, // Higher priority than the more general pattern
    category: 'wait',
  },

  // Convert driver.wait(until.elementIsVisible()) to page.waitForSelector() with state: 'visible'
  {
    pattern: /(\w+)\.wait\(until\.elementIsVisible\((\w+)\),\s*(\d+)\)/g,
    replacement: "await $2.waitFor({ state: 'visible', timeout: $3 })",
    description: 'Convert driver.wait(until.elementIsVisible()) to element.waitFor()',
    priority: 2,
    category: 'wait',
  },

  // Convert driver.wait(until.titleContains()) to page.waitForFunction()
  {
    pattern: /(\w+)\.wait\(until\.titleContains\((['"])([^'"]+)\2\),\s*(\d+)\)/g,
    replacement:
      "await page.waitForFunction(\n    `document.title.includes('$3')`,\n    { timeout: $4 }\n  )",
    description: 'Convert driver.wait(until.titleContains()) to page.waitForFunction()',
    priority: 2,
    category: 'wait',
  },
];
