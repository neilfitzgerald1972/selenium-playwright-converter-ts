import { ConversionRule } from '../types';

// Common device configurations for mobile emulation
interface DeviceConfig {
  viewport: { width: number; height: number };
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
}

const DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  // iPhone devices
  'iPhone 6': {
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  'iPhone 6 Plus': {
    viewport: { width: 414, height: 736 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  'iPhone X': {
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  // Pixel devices
  'Pixel 5': {
    viewport: { width: 393, height: 851 },
    deviceScaleFactor: 2.75,
    isMobile: true,
    hasTouch: true,
  },
  // Add more device configurations as needed
};

export const mobileEmulationConversions: ConversionRule[] = [
  // Handle mobile emulation with device name
  {
    pattern: /const\s+mobileEmulation\s*=\s*\{\s*deviceName\s*:\s*['"]([^'"]+)['"]\s*\};?/g,
    replacement: (match: string, deviceName: string): string => {
      const deviceConfig = DEVICE_CONFIGS[deviceName];
      if (!deviceConfig) {
        return `// No predefined config for device: ${deviceName}
// Please set up viewport and device metrics manually
const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true
});
const page = await context.newPage();`;
      }

      return `const context = await browser.newContext({
  viewport: { width: ${deviceConfig.viewport.width}, height: ${deviceConfig.viewport.height} },
  deviceScaleFactor: ${deviceConfig.deviceScaleFactor},
  isMobile: ${deviceConfig.isMobile},
  hasTouch: ${deviceConfig.hasTouch}
});
const page = await context.newPage();`;
    },
    description: 'Convert mobile emulation with device name to Playwright context options',
    priority: 100, // Higher priority to ensure it's applied first
    category: 'mobile-emulation',
  },

  // Handle mobile emulation with device metrics
  {
    pattern:
      /const\s+mobileEmulation\s*=\s*\{[\s\S]*?deviceMetrics\s*:\s*\{\s*width\s*:\s*(\d+)\s*,\s*height\s*:\s*(\d+)\s*,\s*pixelRatio\s*:\s*(\d+)\s*,\s*touch\s*:\s*(true|false)[\s\S]*?\}[\s\S]*?userAgent\s*:\s*['"]([^'"]+)['"]/g,
    replacement: (
      _match: string,
      width: string,
      height: string,
      pixelRatio: string,
      touch: string,
      userAgent: string
    ): string => {
      return `const context = await browser.newContext({
  viewport: { width: ${width}, height: ${height} },
  deviceScaleFactor: ${pixelRatio},
  isMobile: true,
  hasTouch: ${touch},
  userAgent: '${userAgent}'
});
const page = await context.newPage();`;
    },
    description: 'Convert mobile emulation with device metrics to Playwright context options',
    priority: 1,
    category: 'mobile-emulation',
  },

  // Handle mobile emulation with user agent only
  {
    pattern: /const\s+mobileEmulation\s*=\s*\{[\s\S]*?userAgent\s*:\s*['"]([^'"]+)['"]/g,
    replacement: (_match: string, userAgent: string): string => {
      return `const context = await browser.newContext({
  userAgent: '${userAgent}'
});
const page = await context.newPage();`;
    },
    description: 'Convert mobile emulation with user agent to Playwright context options',
    priority: 1,
    category: 'mobile-emulation',
  },

  // Remove ChromeOptions setMobileEmulation calls
  {
    pattern:
      /const\s+chromeOptions\s*=\s*new\s+chrome\.Options\(\)\.setMobileEmulation\([^)]+\);?/g,
    replacement: '// Chrome options are handled in the context creation above',
    description: 'Remove Chrome options setMobileEmulation as they are handled in context creation',
    priority: 90, // Lower priority than device name pattern
    category: 'mobile-emulation',
  },

  // Remove ChromeDriver builder with chrome options
  {
    pattern:
      /const\s+driver\s*=\s*new\s+Builder\(\)[\s\S]*?\.setChromeOptions\([^)]+\)[\s\S]*?\.build\(\);?/g,
    replacement: '// Driver initialization is handled by the context creation above',
    description: 'Remove driver builder with chrome options',
    priority: 80,
    category: 'mobile-emulation',
  },
];
