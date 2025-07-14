import { SeleniumToPlaywrightConverter } from '../src/converter';

describe('Mouse Actions', () => {
  let converter: SeleniumToPlaywrightConverter;

  beforeEach(() => {
    converter = new SeleniumToPlaywrightConverter();
  });

  describe('moveByOffset', () => {
    it('should convert moveByOffset with positive coordinates', () => {
      const seleniumCode = `
        const actions = new Actions(driver);
        await actions.moveByOffset(100, 200).perform();
      `;

      const result = converter.convert(seleniumCode);
      // The actual output uses evaluate to get the element's position
      expect(result.convertedCode).toContain('const x = rect.left + rect.width/2 + 100');
      expect(result.convertedCode).toContain('const y = rect.top + rect.height/2 + 200');
      expect(result.convertedCode).toContain('page.mouse.move(x, y)');
    });

    it('should convert moveByOffset with negative coordinates', () => {
      const seleniumCode = `
        const actions = new Actions(driver);
        await actions.moveByOffset(-50, -75).perform();
      `;

      const result = converter.convert(seleniumCode);
      // The actual output uses evaluate to get the element's position
      expect(result.convertedCode).toContain('const x = rect.left + rect.width/2 + -50');
      expect(result.convertedCode).toContain('const y = rect.top + rect.height/2 + -75');
      expect(result.convertedCode).toContain('page.mouse.move(x, y)');
    });

    it('should convert moveByOffset in action chain', () => {
      const seleniumCode = `
        const actions = new Actions(driver);
        await actions
          .moveToElement(element)
          .moveByOffset(10, 20)
          .click()
          .perform();
      `;

      const result = converter.convert(seleniumCode);
      // In a chain, it uses the simplified version with direct mouse movement
      expect(result.convertedCode).toContain(
        '.then(async () => { await page.mouse.move(10, 20) })'
      );
    });
  });
});
