import { ConversionRule } from '../types';

// Helper function to convert WebElement to Playwright locator
function convertWebElementToLocator(webElement: string): string {
  // Handle driver.findElement(By.*) patterns
  const byPatterns = [
    // driver.findElement(By.id("value"))
    /\w+\.findElement\(By\.(\w+)\(['"]([^'"]+)['"]\)\)/,
    // By.id("value") directly
    /By\.(\w+)\(['"]([^'"]+)['"]\)/,
  ];

  for (const pattern of byPatterns) {
    const match = webElement.match(pattern);
    if (match) {
      const [, byMethod, value] = match;
      const locatorMap: Record<string, (v: string) => string> = {
        id: v => `#${v}`,
        className: v => `.${v}`,
        css: v => v,
        xpath: v => `xpath=${v}`,
        name: v => `[name="${v}"]`,
        linkText: v => `text=${v}`,
        partialLinkText: v => `text=${v}`,
        tagName: v => v,
      };

      const selectorFn = locatorMap[byMethod] || ((v: string): string => v);
      return `page.locator('${selectorFn(value)}')`;
    }
  }

  // If it's a simple variable or already a locator, return as is
  return webElement.trim();
}

export const advancedDragDropConversions: ConversionRule[] = [
  // Handle dragAndDrop with WebElement parameters (highest priority)
  {
    pattern:
      /new Actions\(\s*\w+\s*\).dragAndDrop\(\s*(\w+\.findElement\(By\.\w+\([^)]+\)\),?\s*\w+\.findElement\(By\.\w+\([^)]+\)\))\)/g,
    replacement: (match: string, elements: string): string => {
      const [source, target] = elements.split(',').map(e => e.trim());
      const sourceLocator = convertWebElementToLocator(source);
      const targetLocator = convertWebElementToLocator(target);
      return `await ${sourceLocator}.dragTo(${targetLocator})`;
    },
    description: 'Convert dragAndDrop with WebElement parameters to Playwright locators',
    priority: 5,
    category: 'drag-and-drop',
  },

  // Handle dragAndDrop with offset parameters (x, y)
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?dragAndDrop\(\s*(\w+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)(?:\s*\.perform\(\))?/g,
    replacement: (match: string, source: string, x: string, y: string): string => {
      return `await ${source}.dragTo(${source}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description:
      'Convert dragAndDrop(element, x, y) to element.dragTo(element, { targetPosition: {x, y} })',
    priority: 4,
    category: 'drag-and-drop',
  },

  // Handle dragAndDrop(element, element)
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?dragAndDrop\(\s*([^,]+)\s*,\s*([^)]+)\s*\)(?:\s*\.perform\(\))?/g,
    replacement: (match: string, source: string, target: string): string => {
      return `await ${source}.dragTo(${target})`;
    },
    description: 'Convert dragAndDrop(source, target) to source.dragTo(target)',
    priority: 3,
    category: 'drag-and-drop',
  },

  // Handle dragAndDrop with offset {x, y}
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?dragAndDrop\(\s*(\w+)\s*,\s*\{\s*x\s*:\s*(\d+)\s*,\s*y\s*:\s*(\d+)\s*\}\s*\)(?:\s*\.perform\(\))?/g,
    replacement: (match: string, source: string, x: string, y: string): string => {
      return `await ${source}.dragTo(${source}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description:
      'Convert dragAndDrop(element, {x, y}) to element.dragTo(element, { targetPosition: {x, y} })',
    priority: 4,
    category: 'drag-and-drop',
  },

  // Handle dragAndDropBy with x, y coordinates (highest priority)
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?dragAndDropBy\(\s*([^,]+?)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)(?:\s*\.perform\(\))?/g,
    replacement: (match: string, source: string, x: string, y: string): string => {
      return `await ${source}.dragTo(${source}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description:
      'Convert dragAndDropBy(element, x, y) to element.dragTo(element, { targetPosition: {x, y} })',
    priority: 5,
    category: 'drag-and-drop',
  },

  // Handle dragAndDropBy with an object parameter
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?dragAndDropBy\(\s*([^,]+?)\s*,\s*\{\s*x\s*:\s*(-?\d+)\s*,\s*y\s*:\s*(-?\d+)\s*\}\s*\)(?:\s*\.perform\(\))?/g,
    replacement: (match: string, source: string, x: string, y: string): string => {
      return `await ${source}.dragTo(${source}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description:
      'Convert dragAndDropBy(element, {x, y}) to element.dragTo(element, { targetPosition: {x, y} })',
    priority: 4,
    category: 'drag-and-drop',
  },

  // Handle WebElement dragAndDropBy with x, y coordinates
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?dragAndDropBy\(\s*((?:\w+\.)?(?:findElement|findElements?)\([^)]+\))\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)(?:\s*\.perform\(\))?/g,
    replacement: (match: string, element: string, x: string, y: string): string => {
      const locator = convertWebElementToLocator(element);
      return `await ${locator}.dragTo(${locator}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description:
      'Convert dragAndDropBy(webelement, x, y) to locator.dragTo(locator, { targetPosition: {x, y} })',
    priority: 5,
    category: 'drag-and-drop',
  },

  // Handle dragAndDropBy in action chains
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?(\w+)\(([^)]*)\)\s*\.dragAndDropBy\(([^)]+)\)/g,
    replacement: (match: string, method: string, methodArgs: string, ddArgs: string): string => {
      // Extract x, y from dragAndDropBy arguments
      const xyMatch = ddArgs.match(
        /(?:\{?\s*x\s*:\s*(-?\d+)\s*,\s*y\s*:\s*(-?\d+)\s*\}|(-?\d+)\s*,\s*(-?\d+))/
      );
      if (!xyMatch) return match; // Return original if no match

      const x = xyMatch[1] || xyMatch[3];
      const y = xyMatch[2] || xyMatch[4];
      const element = methodArgs.split(',')[0].trim();

      return `await ${element}.dragTo(${element}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description: 'Convert action chain with dragAndDropBy to Playwright',
    priority: 3,
    category: 'drag-and-drop',
  },

  // Handle clickAndHold()...moveToElement()...release() sequence
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?clickAndHold\(\s*(\w+)\s*\)\s*\.moveToElement\(\s*(\w+)(?:\s*,\s*(\d+)\s*,\s*(\d+)\s*)?\)\s*\.release\(\)(?:\s*\.perform\(\))?/gs,
    replacement: (
      match: string,
      source: string,
      target: string,
      x: string = '0',
      y: string = '0'
    ): string => {
      if (x === '0' && y === '0') {
        return `await ${source}.dragTo(${target})`;
      }
      return `await ${source}.dragTo(${target}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description:
      'Convert clickAndHold(source).moveToElement(target, x, y).release() to source.dragTo(target, { targetPosition: {x, y} })',
    priority: 3,
    category: 'drag-and-drop',
  },

  // Handle complex drag and drop with moveToElement
  {
    pattern:
      /(?:new\s+Actions\s*\(\s*\w+\s*\)\s*\.)?moveToElement\(\s*(\w+)\s*\)\s*\.clickAndHold\(\s*\)\s*\.moveToElement\(\s*(\w+)(?:\s*,\s*(\d+)\s*,\s*(\d+)\s*)?\)\s*\.release\(\)(?:\s*\.perform\(\))?/gs,
    replacement: (
      match: string,
      source: string,
      target: string,
      x: string = '0',
      y: string = '0'
    ): string => {
      if (x === '0' && y === '0') {
        return `await ${source}.dragTo(${target})`;
      }
      return `await ${source}.dragTo(${target}, { targetPosition: { x: ${x}, y: ${y} } })`;
    },
    description:
      'Convert moveToElement(source).clickAndHold().moveToElement(target, x, y).release() to source.dragTo(target, { targetPosition: {x, y} })',
    priority: 3,
    category: 'drag-and-drop',
  },
];
