import { ConversionRule } from '../types';

// Helper function to convert pause in action chains
function convertPauseInChain(match: string, prefix: string, ms: string): string {
  // If the prefix ends with .perform(), remove it as we'll add it back later
  const cleanPrefix = prefix.replace(/\.perform\(\)\s*$/, '');
  return `${cleanPrefix}
  .then(async () => { await page.waitForTimeout(${ms}); })
  .then(() => {})`; // Add empty then to allow further chaining
}

export const pauseConversions: ConversionRule[] = [
  // Handle standalone pause with perform()
  {
    pattern: /new\s+Actions\s*\(\s*\w+\s*\)\s*\.pause\s*\(\s*(\d+)\s*\)\s*\.perform\s*\(\s*\)/g,
    replacement: (_match: string, ms: string): string => {
      return `await page.waitForTimeout(${ms})`;
    },
    description: 'Convert standalone pause(ms).perform() to page.waitForTimeout(ms)',
    priority: 5, // Higher priority to catch these first
    category: 'pause',
  },

  // Handle pause in action chain with perform() at the end
  {
    pattern:
      /((?:\w+\s*=\s*new\s+Actions\s*\([^)]*\)|\w+)\.(?:\w+(?:\([^)]*\)|\.\w+\([^)]*\))*?)\s*\.pause\s*\(\s*(\d+)\s*\)(\s*\.perform\s*\(\s*\))?)/g,
    replacement: (match: string, prefix: string, ms: string): string => {
      return convertPauseInChain(match, prefix, ms);
    },
    description: 'Convert pause(ms) in action chain with perform() to page.waitForTimeout(ms)',
    priority: 4,
    category: 'pause',
  },

  // Handle pause in the middle of an action chain
  {
    pattern:
      /((?:\w+\s*=\s*new\s+Actions\s*\([^)]*\)|\w+)\.(?:\w+(?:\([^)]*\)|\.\w+\([^)]*\))*?)\s*\.pause\s*\(\s*(\d+)\s*\)(\s*\.\w+\s*\([^)]*\))*)/g,
    replacement: (match: string, prefix: string, ms: string): string => {
      return convertPauseInChain(match, prefix, ms);
    },
    description: 'Convert pause(ms) in the middle of an action chain',
    priority: 3,
    category: 'pause',
  },

  // Handle standalone pause without perform()
  {
    pattern: /new\s+Actions\s*\(\s*\w+\s*\)\s*\.pause\s*\(\s*(\d+)\s*\)/g,
    replacement: (_match: string, ms: string): string => {
      return `await page.waitForTimeout(${ms})`;
    },
    description: 'Convert standalone pause(ms) without perform() to page.waitForTimeout(ms)',
    priority: 2,
    category: 'pause',
  },
];
