import { createConverter, resetMocks } from './utils/test-utils';

describe('Window Management Conversions', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should convert getWindowHandle()', () => {
    const input = 'const handle = driver.getWindowHandle();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      'const handle = driver.context().pages().findIndex(p => p === driver.page)'
    );
  });

  it('should convert getAllWindowHandles()', () => {
    const input = 'const handles = driver.getAllWindowHandles();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      'const handles = driver.context().pages().map((_, i) => i)'
    );
  });

  it('should convert switchTo().window(handle)', () => {
    const input = 'await driver.switchTo().window(handle);';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const pages = driver.context().pages()');
    expect(result.convertedCode).toContain('const targetPage = pages[handle]');
    expect(result.convertedCode).toContain('driver.page = targetPage');
    expect(result.convertedCode).toContain('await targetPage.bringToFront()');
  });

  it('should convert switchTo().newWindow()', () => {
    const input = 'await driver.switchTo().newWindow("https://example.com");';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const newPage = await driver.context().newPage()');
    expect(result.convertedCode).toContain('await newPage.goto("https://example.com"');
    expect(result.convertedCode).toContain('driver.page = newPage');
  });

  it('should convert close() for the last window', () => {
    const input = 'await driver.close();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const pages = driver.context().pages()');
    expect(result.convertedCode).toContain('if (pages.length <= 1)');
    expect(result.convertedCode).toContain('await driver.close()');
  });

  it('should convert close() for a tab', () => {
    const input = 'await driver.close();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const currentPage = driver.page');
    expect(result.convertedCode).toContain('await currentPage.close()');
    expect(result.convertedCode).toContain('driver.page = pages[0]');
  });
});
