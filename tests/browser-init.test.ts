import { createConverter, resetMocks } from './utils/test-utils';

describe('Browser Initialization', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should convert Chrome browser initialization', () => {
    const converter = createConverter();
    const input = 'const driver = new Builder().forBrowser("chrome").build();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const browser = await chromium.launch()');
    expect(result.convertedCode).toContain('const context = await browser.newContext()');
    expect(result.convertedCode).toContain('const driver = await context.newPage()');
  });

  it('should convert Firefox browser initialization', () => {
    const converter = createConverter();
    const input = 'const driver = new Builder().forBrowser("firefox").build();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const browser = await firefox.launch()');
  });

  it('should convert Safari browser initialization', () => {
    const converter = createConverter();
    const input = 'const driver = new Builder().forBrowser("safari").build();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const browser = await webkit.launch()');
  });

  it('should convert browser quit', () => {
    const converter = createConverter();
    const input = 'driver.quit();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('await browser.close()');
  });

  describe('Selenium 4 Modern Browser Initialization', () => {
    it('should handle Chrome browser with options', () => {
      const converter = createConverter();
      const input =
        'const driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build();';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain('const browser = await chromium.launch()');
      expect(result.convertedCode).toContain('const context = await browser.newContext()');
    });

    it('should handle Firefox browser with options', () => {
      const converter = createConverter();
      const input =
        'const driver = await new Builder().forBrowser("firefox").setFirefoxOptions(firefoxOptions).build();';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain('const browser = await firefox.launch()');
    });

    it('should handle async Builder patterns', () => {
      const converter = createConverter();
      const input = 'const driver = await new Builder().forBrowser("chrome").build();';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain('const browser = await chromium.launch()');
    });

    it('should handle WebDriver import removal', () => {
      const converter = createConverter();
      const input = 'import { Builder, WebDriver, By } from "selenium-webdriver";';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        '// TODO: Remove Selenium WebDriver imports after conversion'
      );
    });

    it('should add Playwright imports', () => {
      const converter = createConverter();
      const input = 'const driver = new Builder().forBrowser("chrome").build();';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "import { chromium, firefox, webkit } from 'playwright';"
      );
    });
  });
});
