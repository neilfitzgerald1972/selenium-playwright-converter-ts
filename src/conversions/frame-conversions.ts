import { ConversionRule } from '../types';

export const frameConversions: ConversionRule[] = [
  // Switch to frame by name
  {
    pattern: /(\w+)\.switchTo\(\)\.frame\(['"]([^'"]+)['"]\)/g,
    replacement: (match: string, _driver: string, frameName: string): string => {
      return (
        `// Frame switching in Playwright\n` +
        `const frame = page.frameLocator('iframe[name="${frameName}"]');\n` +
        `// Use frame.locator() for elements within the frame`
      );
    },
    description: 'Convert switchTo().frame(name) to Playwright frameLocator',
    priority: 15,
    category: 'frame-handling',
  },

  // Switch to frame by index
  {
    pattern: /(\w+)\.switchTo\(\)\.frame\((\d+)\)/g,
    replacement: (match: string, _driver: string, frameIndex: string): string => {
      return (
        `// Frame switching by index in Playwright\n` +
        `const frame = page.frameLocator(\`iframe:nth-child(\${${frameIndex} + 1})\`);\n` +
        `// Use frame.locator() for elements within the frame`
      );
    },
    description: 'Convert switchTo().frame(index) to Playwright frameLocator',
    priority: 15,
    category: 'frame-handling',
  },

  // Switch to frame by element
  {
    pattern: /(\w+)\.switchTo\(\)\.frame\(([^)]+)\)/g,
    replacement: (match: string, _driver: string, frameElement: string): string => {
      // If frameElement looks like a variable, use contentFrame pattern
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(frameElement)) {
        return `const frame = await ${frameElement}.contentFrame()`;
      }
      return (
        `// Frame switching by element in Playwright\n` +
        `// TODO: Manual conversion needed - get the frame selector from ${frameElement}\n` +
        `const frame = page.frameLocator('iframe'); // Update selector based on ${frameElement}\n` +
        `// Use frame.locator() for elements within the frame`
      );
    },
    description: 'Convert switchTo().frame(element) to Playwright frameLocator',
    priority: 15,
    category: 'frame-handling',
  },

  // Switch to default content
  {
    pattern: /(\w+)\.switchTo\(\)\.defaultContent\(\)/g,
    replacement: (_match: string, _driver: string): string => {
      return (
        `// Switch back to main page content\n` + `// No need to explicitly switch in Playwright`
      );
    },
    description: 'Convert switchTo().defaultContent() to Playwright comment',
    priority: 15,
    category: 'frame-handling',
  },

  // Switch to parent frame
  {
    pattern: /(\w+)\.switchTo\(\)\.parentFrame\(\)/g,
    replacement: (_match: string, _driver: string): string => {
      return (
        `// Switch to parent frame\n` +
        `// TODO: Manual conversion needed - Playwright uses frameLocator hierarchy\n` +
        `// Use page.locator() for parent frame content`
      );
    },
    description: 'Convert switchTo().parentFrame() to Playwright comment',
    priority: 15,
    category: 'frame-handling',
  },

  // Wait for frame to be available
  {
    pattern: /(\w+)\.wait\(until\.ableToSwitchToFrame\(([^)]+)\),?\s*([^)]*)\)/g,
    replacement: (
      _match: string,
      _driver: string,
      frameLocator: string,
      timeout: string
    ): string => {
      const timeoutParam = timeout ? `, { timeout: ${timeout} }` : '';
      return (
        `// Wait for frame to be available\n` +
        `await page.locator('iframe').waitFor()${timeoutParam};\n` +
        `const frame = page.frameLocator(${frameLocator});`
      );
    },
    description: 'Convert wait for frame availability to Playwright',
    priority: 15,
    category: 'frame-handling',
  },

  // Get frame source
  {
    pattern: /const\s+(\w+)\s*=\s*(\w+)\.getPageSource\(\);?/g,
    replacement: (_match: string, varName: string, _driver: string): string => {
      return `const ${varName} = await page.content()`;
    },
    description: 'Convert getPageSource to Playwright content()',
    priority: 15,
    category: 'frame-handling',
  },

  // Multiple frame operations
  {
    pattern: /(\w+)\.findElements\(By\.tagName\(['"]iframe['"]\)\)/g,
    replacement: (_match: string, _driver: string): string => {
      return (
        `// Get all iframes in Playwright\n` +
        `const frames = await page.locator('iframe').all();\n` +
        `// Or use page.frames() to get frame objects`
      );
    },
    description: 'Convert finding iframe elements to Playwright',
    priority: 15,
    category: 'frame-handling',
  },
];
