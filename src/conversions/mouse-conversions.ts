import { ConversionRule } from '../types';

export const mouseConversions: ConversionRule[] = [
  // Handle moveToElement
  {
    pattern: /\.moveToElement\((\w+)\)/g,
    replacement: '.hover($1)',
    description: 'Convert moveToElement to hover',
    priority: 2,
    category: 'mouse',
  },

  // Handle click
  {
    pattern: /\.click\(\s*(\w*)\s*\)/g,
    replacement: '.click()',
    description: 'Convert click action',
    priority: 2,
    category: 'mouse',
  },

  // Handle double click
  {
    pattern: /\.doubleClick\(\s*(\w*)\s*\)/g,
    replacement: '.dblclick()',
    description: 'Convert double click action',
    priority: 2,
    category: 'mouse',
  },

  // Handle context click (right click)
  {
    pattern: /\.contextClick\(\s*(\w*)\s*\)/g,
    replacement: ".click({ button: 'right' })",
    description: 'Convert context click (right click) action',
    priority: 2,
    category: 'mouse',
  },

  // Handle drag and drop
  {
    pattern: /\.dragAndDrop\(\s*(\w+)\s*,\s*(\w+)\s*\)/g,
    replacement: '.dragTo($2)',
    description: 'Convert drag and drop action',
    priority: 2,
    category: 'mouse',
  },

  // Handle click and hold
  {
    pattern: /\.clickAndHold\(\s*(\w*)\s*\)/g,
    replacement: '.hover($1).then(() => page.mouse.down())',
    description: 'Convert click and hold action',
    priority: 2,
    category: 'mouse',
  },

  // Handle release
  {
    pattern: /\.release\(\s*(\w*)\s*\)/g,
    replacement: '.then(() => page.mouse.up())',
    description: 'Convert release action',
    priority: 2,
    category: 'mouse',
  },

  // Handle move by offset
  {
    pattern: /\.moveByOffset\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
    replacement: (match: string, x: string, y: string): string => {
      return `.then(async () => { await page.mouse.move(${x}, ${y}) })`;
    },
    description: 'Convert move by offset to page.mouse.move',
    priority: 2,
    category: 'mouse',
  },

  // Handle moveByOffset in action chain without .perform()
  {
    pattern: /(\w+)\.moveByOffset\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/g,
    replacement: (match: string, element: string, x: string, y: string): string => {
      return `await ${element}.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width/2 + ${x};
        const y = rect.top + rect.height/2 + ${y};
        return {x, y};
      }).then(({x, y}) => page.mouse.move(x, y))`;
    },
    description: 'Convert moveByOffset in action chain to relative movement',
    priority: 3,
    category: 'mouse',
  },
];
