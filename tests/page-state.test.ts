import { createConverter, resetMocks } from './utils/test-utils';

describe('Page State Conversions', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  /**
   * Test cases for document.readyState checks
   * These ensure that Selenium's executeScript for readyState checks
   * are properly converted to Playwright's waitForFunction
   */
  describe('Document Ready State', () => {
    it('should convert document.readyState check with single quotes', () => {
      const input = `await driver.executeScript('return document.readyState === "complete"');`;
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "await page.waitForFunction(() => document.readyState === 'complete')"
      );
    });

    it('should convert document.readyState check with double quotes', () => {
      const input = 'await driver.executeScript(\'return document.readyState === "complete"\');';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "await page.waitForFunction(() => document.readyState === 'complete')"
      );
    });
  });

  describe('Page Navigation', () => {
    it('should convert driver.get() with waitUntil: load', () => {
      const input = `await driver.get('https://example.com');`;
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "await page.goto('https://example.com', { waitUntil: 'load' })"
      );
    });

    it('should convert driver.navigate().to() with waitUntil: load', () => {
      const input = `await driver.navigate().to('https://example.com');`;
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "await page.goto('https://example.com', { waitUntil: 'load' })"
      );
    });
  });
});
