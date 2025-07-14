import { ConversionRule } from '../types';

export const advancedInteractions: ConversionRule[] = [
  // Handle Actions class - key down/up sequence with SHIFT
  {
    pattern:
      /new Actions\(\s*(\w+)\s*\)\.keyDown\(Keys\.(SHIFT|CONTROL|ALT|COMMAND)\)\.sendKeys\(([^)]+)\)\.keyUp\(Keys\.(\w+)\)\.perform\(\)/g,
    replacement: (match: string, driver: string, ...args: string[]): string => {
      const key = args[0]; // This will be 'SHIFT', 'CONTROL', 'ALT', or 'COMMAND'
      const chars = args[1];
      const keyMap: Record<string, string> = {
        SHIFT: 'Shift',
        CONTROL: 'Control',
        ALT: 'Alt',
        COMMAND: 'Meta',
      };
      const keyName = keyMap[key] || key;
      return (
        `await page.keyboard.down('${keyName}');\n` +
        `await page.keyboard.type('${chars}');\n` +
        `await page.keyboard.up('${keyName}');`
      );
    },
    description: 'Convert keyDown/sendKeys/keyUp with modifier keys',
    priority: 3,
    category: 'advanced-interactions',
  },

  // Handle key combinations
  {
    pattern:
      /new Actions\(\s*(\w+)\s*\)\.keyDown\(([^)]+)\)\.sendKeys\(([^)]+)\)\.keyUp\(([^)]+)\)\.perform\(\)/g,
    replacement: (match: string, driver: string, key: string, chars: string): string => {
      return `await page.keyboard.press('${key}+${chars}');`;
    },
    description: 'Convert key combinations to keyboard.press',
    priority: 2,
    category: 'advanced-interactions',
  },

  // Handle complex action chains
  {
    pattern:
      /new Actions\(\s*(\w+)\s*\)\s*\n?\s*\.(\w+)\(([^)]*)\)\s*\n?(?:\.(\w+)\(([^)]*)\)\s*\n?)*\.perform\(\)/gs,
    replacement: (match: string): string => {
      // Extract all method calls from the action chain
      const methodCalls: Array<{ method: string; args: string }> = [];
      const methodRegex = /\.(\w+)\(([^)]*)\)/g;
      const matches = match.matchAll(methodRegex);

      // Extract all method calls
      for (const methodMatch of matches) {
        const [, method, args] = methodMatch; // Using comma to ignore the full match
        if (method !== 'perform') {
          methodCalls.push({ method, args: args.trim() });
        }
      }

      // Convert to Playwright equivalent
      const convertedCalls = methodCalls.map(({ method, args }) => {
        switch (method) {
          case 'moveToElement':
            return `await ${args}.hover();`;
          case 'click':
            return `await ${args || 'page'}.click();`;
          case 'pause':
            return `await page.waitForTimeout(${args});`;
          case 'sendKeys':
            return `await page.keyboard.type(${args});`;
          case 'doubleClick':
            return `await ${args || 'page'}.dblclick();`;
          case 'contextClick':
            return `await ${args || 'page'}.click({ button: 'right' });`;
          case 'dragAndDrop': {
            const [source, target] = args.split(',').map(s => s.trim());
            return `await ${source}.hover();\nawait page.mouse.down();\nawait ${target}.hover();\nawait page.mouse.up();`;
          }
          default:
            return `// TODO: Convert action: .${method}(${args})`;
        }
      });

      return `// Converted action chain:\n${convertedCalls.join('\n')}`;
    },
    description: 'Convert complex action chains to Playwright equivalents',
    priority: 2,
    category: 'advanced-interactions',
  },

  // Remove .perform() calls from Actions
  {
    pattern: /new Actions\(\s*(\w+)\s*\)\.(\w+)\(([^)]*)\)\.perform\(\)/g,
    replacement:
      '// TODO: Actions in Playwright are performed immediately, no need for perform()\n$1.$2($3)',
    description: 'Remove .perform() from Actions and add TODO comment',
    priority: 2,
    category: 'advanced-interactions',
  },

  // Handle unknown action methods
  {
    pattern: /new Actions\(\s*(\w+)\s*\)\.(\w+)\(([^)]*)\)/g,
    replacement: (match: string, driver: string, method: string, args: string): string => {
      return `// TODO: Convert this action to Playwright equivalent\n// Original: new Actions(${driver}).${method}(${args})\n// Check Playwright docs for equivalent of ${method}`;
    },
    description: 'Add TODO comment for unknown action methods',
    priority: 1,
    category: 'advanced-interactions',
  },

  // Handle Actions class instantiation without perform()
  {
    pattern: /new Actions\(\s*(\w+)\s*\)\.(\w+)\(([^)]*)\)\.perform\(\)/g,
    replacement: (match: string, driver: string, method: string, args: string): string => {
      // For actions that should be performed immediately
      const actionsMap: Record<string, string> = {
        click: 'click',
        doubleClick: 'dblclick',
        contextClick: 'click',
        sendKeys: 'type',
        moveToElement: 'hover',
      };

      if (method in actionsMap) {
        if (method === 'contextClick') {
          return `await ${args || 'page'}.click({ button: 'right' });`;
        } else if (method === 'sendKeys') {
          return `await page.keyboard.type(${args});`;
        } else if (method === 'clickAndHold') {
          return `await ${args || 'page'}.hover();\nawait page.mouse.down();`;
        } else if (method === 'release') {
          return `await page.mouse.up();`;
        } else {
          return `await ${args || 'page'}.${actionsMap[method]}();`;
        }
      }

      return `// TODO: Convert action to Playwright equivalent\n// Original: new Actions(${driver}).${method}(${args}).perform()\n// Check Playwright docs for equivalent of ${method}`;
    },
    description: 'Convert Actions with perform() to direct Playwright calls',
    priority: 3, // Higher priority to catch these before other patterns
    category: 'advanced-interactions',
  },
];
