import { ConversionRule } from '../types';

export const geolocationPermissionsConversions: ConversionRule[] = [
  // Convert geolocation getCurrentPosition
  {
    pattern:
      /const\s+(\w+)\s*=\s*driver\.executeScript\('return\s+navigator\.geolocation\.getCurrentPosition\([^)]*\)/g,
    replacement: (_match: string, varName: string): string => {
      return `const ${varName} = await page.evaluate(() => navigator.geolocation.getCurrentPosition((position) => position))`;
    },
    description: 'Convert navigator.geolocation.getCurrentPosition',
    priority: 10,
    category: 'geolocation',
  },

  // Convert geolocation watchPosition
  {
    pattern:
      /const\s+(\w+)\s*=\s*driver\.executeScript\('return\s+navigator\.geolocation\.watchPosition\([^)]*\)/g,
    replacement: (_match: string, varName: string): string => {
      return `const ${varName} = await page.evaluate(() => {
        return navigator.geolocation.watchPosition((position) => {
          console.log(position);
        });
      })`;
    },
    description: 'Convert navigator.geolocation.watchPosition',
    priority: 10,
    category: 'geolocation',
  },

  // Convert geolocation clearWatch
  {
    pattern: /driver\.executeScript\('navigator\.geolocation\.clearWatch\((\d+)\)(?:;)?'\)/g,
    replacement: (_match: string, watchId: string): string => {
      return `await page.evaluate((watchId) => {
        return navigator.geolocation.clearWatch(watchId);
      }, ${watchId})`;
    },
    description: 'Convert navigator.geolocation.clearWatch',
    priority: 10,
    category: 'geolocation',
  },

  // Convert permissions.query
  {
    pattern:
      /const\s+(\w+)\s*=\s*driver\.executeScript\('return\s+navigator\.permissions\.query\(([^)]*)\)'/g,
    replacement: (_match: string, varName: string, query: string): string => {
      return `const ${varName} = await page.evaluate((query) => {
        return navigator.permissions.query(JSON.parse(query));
      }, '${query}')`;
    },
    description: 'Convert navigator.permissions.query',
    priority: 10,
    category: 'permissions',
  },

  // Convert geolocation mock
  {
    pattern:
      /driver\.executeScript\('(navigator\.geolocation\.getCurrentPosition\s*=\s*function\s*\([^)]*\)\s*\{[^}]*\})'\)/g,
    replacement: (_match: string, funcBody: string): string => {
      // Escape single quotes in the function body
      const escapedFunc = funcBody.replace(/'/g, "\\'");
      return `await page.evaluate(() => {
        ${escapedFunc}
      })`;
    },
    description: 'Convert geolocation mock',
    priority: 10,
    category: 'geolocation',
  },
];
