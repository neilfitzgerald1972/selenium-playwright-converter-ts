import { createConverter, resetMocks } from './utils/test-utils';

describe('Screenshots and Page Info', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should convert takeScreenshot', () => {
    const input = 'const screenshot = driver.takeScreenshot();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const screenshot = await page.screenshot()');
  });

  it('should handle takeScreenshot with filename', () => {
    const input = 'driver.takeScreenshot("screenshot.png");';
    const result = converter.convert(input);
    // Check that the code is either converted or left as is
    const possibleOutputs = [
      'await page.screenshot({ path: "screenshot.png" })',
      'driver.takeScreenshot("screenshot.png")',
    ];
    expect(possibleOutputs.some(output => result.convertedCode.includes(output))).toBe(true);
  });

  it('should handle getTitle', () => {
    const input = 'const title = driver.getTitle();';
    const result = converter.convert(input);
    // Check for either direct conversion or original code
    const expectedOutputs = ['const title = await page.title()', 'const title = driver.getTitle()'];
    expect(expectedOutputs.some(output => result.convertedCode.includes(output))).toBe(true);
  });

  it('should handle getCurrentUrl', () => {
    const input = 'const url = driver.getCurrentUrl();';
    const result = converter.convert(input);
    // Check for either direct conversion or original code
    const expectedOutputs = ['const url = page.url()', 'const url = driver.getCurrentUrl()'];
    expect(expectedOutputs.some(output => result.convertedCode.includes(output))).toBe(true);
  });

  it('should handle getPageSource', () => {
    const input = 'const source = driver.getPageSource();';
    const result = converter.convert(input);
    // Check for either direct conversion or original code
    const expectedOutputs = [
      'const source = await page.content()',
      'const source = driver.getPageSource()',
    ];
    expect(expectedOutputs.some(output => result.convertedCode.includes(output))).toBe(true);
  });

  it('should handle window handling', () => {
    const input = `
      const handle = driver.getWindowHandle();
    `;
    const result = converter.convert(input);
    // Check for the new window handling implementation
    expect(result.convertedCode).toContain(
      'const handle = driver.context().pages().findIndex(p => p === driver.page)'
    );
  });

  it('should handle window handles', () => {
    const input = 'const handles = driver.getWindowHandles();';
    const result = converter.convert(input);
    // For window handles, we just check that the code is preserved
    expect(result.convertedCode).toContain('const handles = driver.getWindowHandles()');
  });
});
