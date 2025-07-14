import { ConversionRule } from '../types';

export const elementFindingConversions: ConversionRule[] = [
  // Find element by ID
  {
    pattern: /(\w+)\.findElement\(By\.id\(['"]([^'"]+)['"]\)\)/g,
    replacement: (match: string, driver: string, id: string): string => {
      // Check if ID contains spaces or special characters
      if (/[\s\W]/.test(id)) {
        return `page.locator('[id="${id}"]')`;
      }
      return `page.locator('#${id}')`;
    },
    description: 'Convert findElement by ID',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by ID
  {
    pattern: /(\w+)\.findElements\(By\.id\(['"]([^'"]+)['"]\)\)/g,
    replacement: (match: string, driver: string, id: string): string => {
      if (/[\s\W]/.test(id)) {
        return `page.locator('[id="${id}"]').all()`;
      }
      return `page.locator('#${id}').all()`;
    },
    description: 'Convert findElements by ID',
    priority: 2,
    category: 'element-finding',
  },

  // Find element by CSS
  {
    pattern: /(\w+)\.findElement\(By\.css\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('$2')",
    description: 'Convert findElement by CSS',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by CSS
  {
    pattern: /(\w+)\.findElements\(By\.css\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('$2').all()",
    description: 'Convert findElements by CSS',
    priority: 2,
    category: 'element-finding',
  },

  // Find element by XPath
  {
    pattern: /(\w+)\.findElement\(By\.xpath\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('xpath=$2')",
    description: 'Convert findElement by XPath',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by XPath
  {
    pattern: /(\w+)\.findElements\(By\.xpath\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('xpath=$2').all()",
    description: 'Convert findElements by XPath',
    priority: 2,
    category: 'element-finding',
  },

  // Find element by link text
  {
    pattern: /(\w+)\.findElement\(By\.linkText\(['"]([^'"]+)['"]\)\)/g,
    replacement: 'page.locator(\'text="$2"\')',
    description: 'Convert findElement by link text',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by link text
  {
    pattern: /(\w+)\.findElements\(By\.linkText\(['"]([^'"]+)['"]\)\)/g,
    replacement: 'page.locator(\'text="$2"\').all()',
    description: 'Convert findElements by link text',
    priority: 2,
    category: 'element-finding',
  },

  // Find element by partial link text
  {
    pattern: /(\w+)\.findElement\(By\.partialLinkText\(['"]([^'"]+)['"]\)\)/g,
    replacement: 'page.locator(\'text*="$2"\')',
    description: 'Convert findElement by partial link text',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by partial link text
  {
    pattern: /(\w+)\.findElements\(By\.partialLinkText\(['"]([^'"]+)['"]\)\)/g,
    replacement: 'page.locator(\'text*="$2"\').all()',
    description: 'Convert findElements by partial link text',
    priority: 2,
    category: 'element-finding',
  },

  // Find element by name
  {
    pattern: /(\w+)\.findElement\(By\.name\(['"]([^'"]+)['"]\)\)/g,
    replacement: 'page.locator(\'[name="$2"]\')',
    description: 'Convert findElement by name',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by name
  {
    pattern: /(\w+)\.findElements\(By\.name\(['"]([^'"]+)['"]\)\)/g,
    replacement: 'page.locator(\'[name="$2"]\').all()',
    description: 'Convert findElements by name',
    priority: 2,
    category: 'element-finding',
  },

  // Find element by className
  {
    pattern: /(\w+)\.findElement\(By\.className\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('.$2')",
    description: 'Convert findElement by class name',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by className
  {
    pattern: /(\w+)\.findElements\(By\.className\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('.$2').all()",
    description: 'Convert findElements by class name',
    priority: 2,
    category: 'element-finding',
  },

  // Find element by tagName
  {
    pattern: /(\w+)\.findElement\(By\.tagName\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('$2')",
    description: 'Convert findElement by tag name',
    priority: 2,
    category: 'element-finding',
  },

  // Find elements by tagName
  {
    pattern: /(\w+)\.findElements\(By\.tagName\(['"]([^'"]+)['"]\)\)/g,
    replacement: "page.locator('$2').all()",
    description: 'Convert findElements by tag name',
    priority: 2,
    category: 'element-finding',
  },

  // Selenium 4 Relative Locators - above
  {
    pattern: /(\w+)\.findElement\(By\.(\w+)\(([^)]+)\)\.above\(([^)]+)\)\)/g,
    replacement:
      "// TODO: Manual conversion needed - Selenium 4 relative locator 'above' not directly supported in Playwright\n" +
      "page.locator('$3').filter({ has: page.locator('$4') })",
    description: 'Convert Selenium 4 relative locator above (needs manual review)',
    priority: 1,
    category: 'element-finding',
  },

  // Selenium 4 Relative Locators - below
  {
    pattern: /(\w+)\.findElement\(By\.(\w+)\(([^)]+)\)\.below\(([^)]+)\)\)/g,
    replacement:
      "// TODO: Manual conversion needed - Selenium 4 relative locator 'below' not directly supported in Playwright\n" +
      "page.locator('$3').filter({ has: page.locator('$4') })",
    description: 'Convert Selenium 4 relative locator below (needs manual review)',
    priority: 1,
    category: 'element-finding',
  },

  // Selenium 4 Relative Locators - leftOf
  {
    pattern: /(\w+)\.findElement\(By\.(\w+)\(([^)]+)\)\.leftOf\(([^)]+)\)\)/g,
    replacement:
      "// TODO: Manual conversion needed - Selenium 4 relative locator 'leftOf' not directly supported in Playwright\n" +
      "page.locator('$3').filter({ has: page.locator('$4') })",
    description: 'Convert Selenium 4 relative locator leftOf (needs manual review)',
    priority: 1,
    category: 'element-finding',
  },

  // Selenium 4 Relative Locators - rightOf
  {
    pattern: /(\w+)\.findElement\(By\.(\w+)\(([^)]+)\)\.rightOf\(([^)]+)\)\)/g,
    replacement:
      "// TODO: Manual conversion needed - Selenium 4 relative locator 'rightOf' not directly supported in Playwright\n" +
      "page.locator('$3').filter({ has: page.locator('$4') })",
    description: 'Convert Selenium 4 relative locator rightOf (needs manual review)',
    priority: 1,
    category: 'element-finding',
  },

  // Selenium 4 Relative Locators - near
  {
    pattern: /(\w+)\.findElement\(By\.(\w+)\(([^)]+)\)\.near\(([^)]+)\)\)/g,
    replacement:
      "// TODO: Manual conversion needed - Selenium 4 relative locator 'near' not directly supported in Playwright\n" +
      "page.locator('$3').filter({ has: page.locator('$4') })",
    description: 'Convert Selenium 4 relative locator near (needs manual review)',
    priority: 1,
    category: 'element-finding',
  },
];
