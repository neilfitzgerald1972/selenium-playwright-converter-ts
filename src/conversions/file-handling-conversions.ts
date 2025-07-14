import { ConversionRule } from '../types';

export const fileHandlingConversions: ConversionRule[] = [
  // Handle file upload using sendKeys
  {
    pattern: /(\w+)\.sendKeys\(["']([^"']+)["']\)/g,
    replacement: (match: string, elementVar: string, filePath: string): string => {
      // Check if this is likely a file input by variable name or file path pattern
      // Only apply if variable name suggests file input AND path looks like file path
      if (
        elementVar.toLowerCase().includes('file') &&
        (filePath.includes('/') ||
          filePath.includes('\\') ||
          filePath.includes('.txt') ||
          filePath.includes('.pdf') ||
          filePath.includes('.jpg') ||
          filePath.includes('.png'))
      ) {
        // For multiple file uploads (newline separated)
        if (filePath.includes('\\n')) {
          const files = filePath
            .split('\\n')
            .map(f => `'${f.trim()}'`)
            .join(', ');
          return `await ${elementVar}.setInputFiles([${files}])`;
        }
        // For single file upload
        return `await ${elementVar}.setInputFiles('${filePath.trim()}')`;
      }
      // For non-file inputs, keep the original behavior
      return match;
    },
    description: 'Convert file upload using sendKeys to Playwright setInputFiles',
    priority: 101, // Higher priority than keyboard conversions (which are ~100)
    category: 'file-handling',
  },

  // Handle file download with click
  {
    pattern: /(\/\/ In Selenium, you'd typically wait for the download to complete\s*)$/gm,
    replacement: `// Wait for the download to complete
const [download] = await Promise.all([
  page.waitForEvent("download"),
  $1
]);
const path = await download.path();
console.log('Downloaded file path:', path);`,
    description: 'Add download handling for file downloads',
    priority: 1,
    category: 'file-handling',
  },

  // Handle drag and drop file upload
  {
    pattern:
      /const file = new File\(\[\], '([^']+)'\)[\s\S]*?fileInput\.sendKeys\(dataTransfer\.files\)/g,
    replacement: `// Using Playwright's setInputFiles for file upload\n    await page.locator('.drop-zone').setInputFiles('$1')`,
    description: 'Convert drag and drop file upload to Playwright setInputFiles',
    priority: 1,
    category: 'file-handling',
  },
];
