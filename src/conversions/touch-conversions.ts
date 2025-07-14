import { ConversionRule } from '../types';

export const touchConversions: ConversionRule[] = [
  // Handle single tap
  {
    pattern: /(\w+)\.tap\(\s*(\w+)\s*\)/g,
    replacement: (_match: string, _driver: string, element: string): string =>
      `await ${element}.tap()`,
    description: 'Convert tap to Playwright tap',
    priority: 2,
    category: 'touch',
  },

  // Handle double tap
  {
    pattern: /(\w+)\.doubleTap\(\s*(\w+)\s*\)/g,
    replacement: (_match: string, _driver: string, element: string): string =>
      `await ${element}.dblclick()`,
    description: 'Convert doubleTap to Playwright dblclick',
    priority: 2,
    category: 'touch',
  },

  // Handle long press
  {
    pattern: /(\w+)\.longPress\(\s*(\w+)\s*(?:,\s*(\d+)\s*)?\)/g,
    replacement: (_match: string, _driver: string, element: string, duration = '1000'): string => {
      return (
        '// Long press simulation\n' +
        `await ${element}.hover();\n` +
        'await page.mouse.down();\n' +
        `await page.waitForTimeout(${duration});\n` +
        'await page.mouse.up();'
      );
    },
    description: 'Convert longPress to mouse down/wait/up sequence',
    priority: 2,
    category: 'touch',
  },

  // Handle flick (swipe) with speed
  {
    pattern: /(\w+)\.flick\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
    replacement: (_match: string, _driver: string, xSpeed: string, ySpeed: string): string =>
      // Use the provided x and y speeds as the target coordinates
      // since flick() in Selenium takes speed, but we'll use them as coordinates in Playwright
      `// Flick with speed x:${xSpeed}, y:${ySpeed} (converted to coordinates)
await page.mouse.move(0, 0);
await page.mouse.down();
await page.mouse.move(${xSpeed}, ${ySpeed}, { steps: 5 });
await page.mouse.up();`,
    description: 'Convert flick to mouse movement sequence',
    warning:
      'Flick conversion uses speeds as coordinates - verify this matches your expected behavior',
    priority: 2,
    category: 'touch',
    requiresManualReview: true,
  },

  // Handle flick from element with offset and speed
  {
    pattern: /(\w+)\.flickElement\(\s*(\w+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(\d+)\s*\)/g,
    replacement: (
      _match: string,
      _driver: string,
      element: string,
      xOffset: string,
      yOffset: string,
      _speed: string
    ): string => {
      return (
        `// Flick from element with offset x:${xOffset}, y:${yOffset} at speed ${_speed}\n` +
        `await ${element}.hover();\n` +
        'await page.mouse.down();\n' +
        `await page.mouse.move(${xOffset}, ${yOffset}, { steps: 5 });\n` +
        'await page.mouse.up();'
      );
    },
    description: 'Convert flickElement to mouse movement sequence',
    priority: 2,
    category: 'touch',
  },

  // Handle move to element with offset
  {
    pattern: /(\w+)\.moveToElement\(\s*(\w+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
    replacement: (
      _match: string,
      _driver: string,
      element: string,
      x: string,
      y: string
    ): string => {
      return (
        `// Move to element with offset x:${x}, y:${y}\n` +
        `const box = await ${element}.boundingBox();\n` +
        `await page.mouse.move(box.x + ${x}, box.y + ${y});`
      );
    },
    description: 'Convert moveToElement with offset to mouse movement',
    priority: 2,
    category: 'touch',
  },

  // Handle scroll
  {
    pattern: /(\w+)\.scroll\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
    replacement: (_match: string, _driver: string, xOffset: string, yOffset: string): string => {
      return (
        `// Scroll by x:${xOffset}, y:${yOffset}\n` +
        `await page.mouse.wheel(${xOffset}, ${yOffset});`
      );
    },
    description: 'Convert scroll to mouse wheel',
    priority: 2,
    category: 'touch',
  },

  // Handle scroll from element
  {
    pattern: /(\w+)\.scrollFromElement\(\s*(\w+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
    replacement: (
      _match: string,
      _driver: string,
      element: string,
      xOffset: string,
      yOffset: string
    ): string =>
      `// Scroll from element by x:${xOffset}, y:${yOffset}
await ${element}.hover();
await page.mouse.wheel(${xOffset}, ${yOffset});`,
    description: 'Convert scrollFromElement to hover + mouse wheel',
    priority: 2,
    category: 'touch',
  },

  // Handle TouchActions chaining with perform()
  {
    pattern: /new\s+TouchActions\(\s*(\w+)\s*\)(?:\s*\.(\w+)\(([^)]*)\)\s*)+\s*\.perform\(\)/g,
    replacement: (_match: string, _driver: string, ..._actions: string[]): string => {
      // This is a complex pattern that needs to be handled by breaking down the chain
      return (
        '// Converted TouchActions chain - review and adjust as needed\n' +
        `// Original: ${_match}\n` +
        '// TODO: Manually convert this TouchActions chain to Playwright equivalent'
      );
    },
    description: 'Convert TouchActions chain to Playwright equivalent',
    warning: 'Complex TouchActions chains may need manual adjustment',
    priority: 1,
    category: 'touch',
    requiresManualReview: true,
  },
];
