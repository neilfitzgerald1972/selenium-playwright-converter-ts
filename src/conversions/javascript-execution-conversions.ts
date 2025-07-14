import { ConversionRule } from '../types';

export const javascriptExecutionConversions: ConversionRule[] = [
  // Convert executeScript with string script
  {
    pattern: /(\w+)\.executeScript\((['"])([\s\S]*?)\2(?:\s*,\s*\[([^\]]*)\])?\)/g,
    replacement: (
      match: string,
      driver: string,
      quote: string,
      script: string,
      args = ''
    ): string => {
      const formattedArgs = args
        .split(',')
        .map(arg => arg.trim())
        .filter(Boolean);

      if (formattedArgs.length > 0) {
        return `await page.evaluate(([${formattedArgs.join(', ')}]) => {\n      ${script}\n    }, [${formattedArgs.join(', ')}])`;
      }
      return `await page.evaluate(() => {\n      ${script}\n    })`;
    },
    description: 'Convert executeScript to page.evaluate',
    priority: 2,
    category: 'javascript',
  },

  // Convert executeScript with function
  {
    pattern: /(\w+)\.executeScript\(function\(([^)]*)\)\s*{([\s\S]*?)}\s*(?:,\s*\[([^\]]*)\])?\)/g,
    replacement: (
      match: string,
      driver: string,
      params: string,
      script: string,
      args = ''
    ): string => {
      const formattedArgs = args
        .split(',')
        .map(arg => arg.trim())
        .filter(Boolean);

      if (formattedArgs.length > 0) {
        return `await page.evaluate((${params}) => {\n      ${script}\n    }, [${formattedArgs.join(', ')}])`;
      }
      return `await page.evaluate((${params}) => {\n      ${script}\n    })`;
    },
    description: 'Convert executeScript with function to page.evaluate',
    priority: 2,
    category: 'javascript',
  },

  // Convert executeAsyncScript with string script
  {
    pattern: /(\w+)\.executeAsyncScript\((['"])([\s\S]*?)\2(?:\s*,\s*\[([^\]]*)\])?\)/g,
    replacement: (
      match: string,
      driver: string,
      quote: string,
      script: string,
      args = ''
    ): string => {
      // Add done parameter to the script if not present
      const hasDone = /\bdone\s*\(/.test(script);
      let processedScript = script;

      if (!hasDone) {
        // Try to find the last statement that might be a return and replace it with done()
        processedScript = script.replace(/([^;{}\n]*return\s+[^;]*);?\s*$/, (_, returnStmt) => {
          return `done(${returnStmt.replace(/^\s*return\s+/, '')})`;
        });

        // If no return was found, just add done() at the end
        if (processedScript === script) {
          processedScript += '; done();';
        }
      }

      const formattedArgs = args
        .split(',')
        .map(arg => arg.trim())
        .filter(Boolean);

      if (formattedArgs.length > 0) {
        return `await page.evaluate(([${formattedArgs.join(', ')}]) => {\n      return new Promise((done) => {\n        ${processedScript}\n      });\n    }, [${formattedArgs.join(', ')}])`;
      }
      return `await page.evaluate(() => {\n      return new Promise((done) => {\n        ${processedScript}\n      });\n    })`;
    },
    description: 'Convert executeAsyncScript to page.evaluate with Promise',
    priority: 2,
    category: 'javascript',
  },

  // Convert executeAsyncScript with function
  {
    pattern:
      /(\w+)\.executeAsyncScript\(function\(([^)]*)\)\s*{([\s\S]*?)}\s*(?:,\s*\[([^\]]*)\])?\)/g,
    replacement: (
      match: string,
      driver: string,
      params: string,
      script: string,
      args = ''
    ): string => {
      // Add done to params if not already there
      const paramList = params.split(',').map(p => p.trim());
      if (!paramList.includes('done')) {
        paramList.push('done');
      }

      const formattedArgs = args
        .split(',')
        .map(arg => arg.trim())
        .filter(Boolean);

      if (formattedArgs.length > 0) {
        return `await page.evaluate(async ([${formattedArgs.join(', ')}]) => {\n      return new Promise((done) => {\n        (${paramList.join(', ')}) => {\n          ${script}\n        }(${[...formattedArgs, 'done'].join(', ')});\n      });\n    }, [${formattedArgs.join(', ')}])`;
      }
      return `await page.evaluate(async () => {\n      return new Promise((done) => {\n        (${paramList.join(', ')}) => {\n          ${script}\n        }('done');\n      });\n    })`;
    },
    description: 'Convert executeAsyncScript with function to page.evaluate with Promise',
    priority: 2,
    category: 'javascript',
  },

  // Convert return values (Selenium returns the last evaluated expression, Playwright needs explicit return)
  {
    pattern: /(\w+)\.executeScript\((['"])([^;]*?)(?:;\s*)?\2\)/g,
    replacement: (match: string, driver: string, quote: string, expression: string): string => {
      return `${driver}.executeScript('return ${expression.replace(/'/g, '\\' + quote)}')`;
    },
    description: 'Add explicit return to executeScript with expression',
    priority: 3, // Higher priority to process before the general pattern
    category: 'javascript',
  },
];
