import { ConversionRule } from '../types';

export const elementInteractionConversions: ConversionRule[] = [
  // Handle getText()
  {
    pattern: /\.getText\(\s*\)/g,
    replacement: '.textContent()',
    description: 'Convert getText to textContent',
    priority: 2,
    category: 'element-interaction',
  },

  // Handle getAttribute('value')
  {
    pattern: /\.getAttribute\(['"]value['"]\)/g,
    replacement: '.inputValue()',
    description: "Convert getAttribute('value') to inputValue",
    priority: 2,
    category: 'element-interaction',
  },

  // Handle isDisplayed()
  {
    pattern: /\.isDisplayed\(\s*\)/g,
    replacement: '.isVisible()',
    description: 'Convert isDisplayed to isVisible',
    priority: 2,
    category: 'element-interaction',
  },

  // Handle isEnabled()
  {
    pattern: /\.isEnabled\(\s*\)/g,
    replacement: '.isEnabled()',
    description: 'Convert isEnabled (kept the same in Playwright)',
    priority: 2,
    category: 'element-interaction',
  },

  // Handle isSelected()
  {
    pattern: /\.isSelected\(\s*\)/g,
    replacement: '.isChecked()',
    description: 'Convert isSelected to isChecked',
    priority: 2,
    category: 'element-interaction',
  },

  // Convert element.clear()
  {
    pattern: /(\w+)\.clear\(\s*\)/g,
    replacement: '$1.clear()',
    description: 'Convert element.clear() to element.clear()',
    priority: 2,
    category: 'element-interaction',
  },

  // Handle submit()
  {
    pattern: /\.submit\(\s*\)/g,
    replacement: '.evaluate(el => el.form?.submit())',
    description: 'Convert form submit',
    priority: 2,
    category: 'element-interaction',
  },

  // Handle getSize()
  {
    pattern: /\.getSize\(\s*\)/g,
    replacement:
      '.boundingBox().then(box => ({\n      width: box?.width || 0,\n      height: box?.height || 0\n    }))',
    description: 'Convert getSize to boundingBox',
    priority: 2,
    category: 'element-state',
  },

  // Handle getLocation()
  {
    pattern: /\.getLocation\(\s*\)/g,
    replacement:
      '.boundingBox().then(box => ({\n      x: box?.x || 0,\n      y: box?.y || 0\n    }))',
    description: 'Convert getLocation to boundingBox',
    priority: 2,
    category: 'element-state',
  },

  // Handle getRect()
  {
    pattern: /\.getRect\(\s*\)/g,
    replacement: '.boundingBox()',
    description: 'Convert getRect to boundingBox',
    priority: 2,
    category: 'element-state',
  },

  // Handle getCssValue()
  {
    pattern: /\.getCssValue\(['"]([^'"]+)['"]\)/g,
    replacement: (match, property) =>
      `.evaluate((el, prop) => {\n      const style = window.getComputedStyle(el);\n      return style.getPropertyValue(prop);\n    }, '${property}')`,
    description: 'Convert getCssValue to evaluate with getComputedStyle',
    priority: 2,
    category: 'element-state',
  },

  // Handle getAriaRole()
  {
    pattern: /\.getAriaRole\(\s*\)/g,
    replacement: ".evaluate(el => el.getAttribute('role') || '')",
    description: "Convert getAriaRole to getAttribute('role')",
    priority: 2,
    category: 'element-state',
  },

  // Handle getAccessibleName()
  {
    pattern: /\.getAccessibleName\(\s*\)/g,
    replacement:
      ".evaluate(el => (\n      el.getAttribute('aria-label') ||\n      el.getAttribute('alt') ||\n      el.getAttribute('title') ||\n      (el.textContent || '').trim() || ''\n    ))",
    description: 'Convert getAccessibleName to accessible name resolution',
    priority: 2,
    category: 'element-state',
  },
];
