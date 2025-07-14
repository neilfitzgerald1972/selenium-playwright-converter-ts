import { createConverter, resetMocks, testElementFinder } from './utils/test-utils';

describe('Element Finding', () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test all locator strategies
  testElementFinder('id', 'username', '#username');
  testElementFinder('className', 'login-form', '.login-form');
  testElementFinder('css', 'button.submit', 'button.submit');
  testElementFinder('xpath', '//button[text()="Submit"]', 'xpath=//button[text()="Submit"]');
  testElementFinder('name', 'email', '[name="email"]');
  testElementFinder('tagName', 'input', 'input');
  testElementFinder('linkText', 'Click Here', 'text="Click Here"');
  testElementFinder('partialLinkText', 'Click', 'text*="Click"');

  // Test findElements
  it('should convert findElements by ID', () => {
    const converter = createConverter();
    const input = 'const elements = driver.findElements(By.id("items"));';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain("const elements = page.locator('#items').all()");
  });

  it('should convert findElements by CSS', () => {
    const converter = createConverter();
    const input = 'const elements = driver.findElements(By.css(".item"));';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain("const elements = page.locator('.item').all()");
  });

  describe('Selenium 4 Relative Locators', () => {
    it('should handle above() relative locator', () => {
      const converter = createConverter();
      const input =
        'const element = await driver.findElement(By.css(".target").above(baseElement));';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "// TODO: Manual conversion needed - Selenium 4 relative locator 'above' not directly supported"
      );
    });

    it('should handle below() relative locator', () => {
      const converter = createConverter();
      const input =
        'const element = await driver.findElement(By.css(".target").below(baseElement));';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "// TODO: Manual conversion needed - Selenium 4 relative locator 'below' not directly supported"
      );
    });

    it('should handle leftOf() relative locator', () => {
      const converter = createConverter();
      const input =
        'const element = await driver.findElement(By.css(".target").leftOf(baseElement));';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "// TODO: Manual conversion needed - Selenium 4 relative locator 'leftOf' not directly supported"
      );
    });

    it('should handle rightOf() relative locator', () => {
      const converter = createConverter();
      const input =
        'const element = await driver.findElement(By.css(".target").rightOf(baseElement));';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "// TODO: Manual conversion needed - Selenium 4 relative locator 'rightOf' not directly supported"
      );
    });

    it('should handle near() relative locator', () => {
      const converter = createConverter();
      const input =
        'const element = await driver.findElement(By.css(".target").near(baseElement));';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain(
        "// TODO: Manual conversion needed - Selenium 4 relative locator 'near' not directly supported"
      );
    });

    it('should provide filter guidance for relative locators', () => {
      const converter = createConverter();
      const input =
        'const element = await driver.findElement(By.css(".target").above(baseElement));';
      const result = converter.convert(input);
      expect(result.convertedCode).toContain('page.locator');
      expect(result.convertedCode).toContain('.filter');
    });
  });
});
