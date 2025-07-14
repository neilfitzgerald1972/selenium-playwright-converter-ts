import { createConverter, resetMocks } from './utils/test-utils';

describe('Drag and Drop Conversions', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  // Helper function to extract the relevant part of the converted code
  const getConvertedCode = (result: { convertedCode: string }): string | undefined => {
    return (
      result.convertedCode
        .split(';')
        .find(line => line.includes('dragAndDrop') || line.includes('dragTo'))
        ?.trim() + ';'
    );
  };

  it('should convert dragAndDrop to Playwright', () => {
    const input = 'new Actions(driver).dragAndDrop(source, target).perform();';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain('source.dragTo(target)');
  });

  it('should convert dragAndDrop with WebElement parameters', () => {
    const input =
      'new Actions(driver).dragAndDrop(driver.findElement(By.id("source")), driver.findElement(By.id("target"))).perform();';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    // Check for the converted locator pattern
    expect(converted).toContain('dragTo(');
    expect(converted).toContain('page.locator');
  });

  it('should convert dragAndDrop with offset', () => {
    const input = 'new Actions(driver).dragAndDrop(source, 100, 200).perform();';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain('source.dragTo(source, { targetPosition: { x: 100, y: 200 } })');
  });

  it('should convert clickAndHold and moveToElement', () => {
    const input =
      'new Actions(driver).clickAndHold(source).moveToElement(target).release().perform();';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain('source.dragTo(target)');
  });

  it('should convert complex drag and drop sequence', () => {
    const input =
      'new Actions(driver)' +
      '.moveToElement(source)' +
      '.clickAndHold()' +
      '.moveToElement(target, 10, 20)' +
      '.release()' +
      '.perform();';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain('source.dragTo(target, { targetPosition: { x: 10, y: 20 } })');
  });

  describe('dragAndDropBy', () => {
    it('should convert dragAndDropBy with x, y coordinates', () => {
      const input = 'new Actions(driver).dragAndDropBy(element, 50, 100).perform();';
      const result = converter.convert(input);
      const converted = getConvertedCode(result);
      expect(converted).toContain('element.dragTo(element, { targetPosition: { x: 50, y: 100 } })');
    });

    it('should convert dragAndDropBy with negative coordinates', () => {
      const input = 'new Actions(driver).dragAndDropBy(element, -30, -20).perform();';
      const result = converter.convert(input);
      const converted = getConvertedCode(result);
      expect(converted).toContain(
        'element.dragTo(element, { targetPosition: { x: -30, y: -20 } })'
      );
    });

    it('should convert dragAndDropBy with object parameter', () => {
      const input = 'new Actions(driver).dragAndDropBy(element, { x: 75, y: 150 }).perform();';
      const result = converter.convert(input);
      const converted = getConvertedCode(result);
      expect(converted).toContain('element.dragTo(element, { targetPosition: { x: 75, y: 150 } })');
    });

    it('should convert dragAndDropBy with WebElement', () => {
      const input =
        'new Actions(driver).dragAndDropBy(driver.findElement(By.id("draggable")), 100, 50).perform();';
      const result = converter.convert(input);
      const converted = getConvertedCode(result);
      expect(converted).toContain('dragTo(');
      expect(converted).toContain('page.locator');
      expect(converted).toContain('{ targetPosition: { x: 100, y: 50 } }');
    });

    it('should handle dragAndDropBy without perform()', () => {
      const input = 'new Actions(driver).dragAndDropBy(element, 10, 20);';
      const result = converter.convert(input);
      const converted = getConvertedCode(result);
      expect(converted).toContain('element.dragTo(element, { targetPosition: { x: 10, y: 20 } })');
    });
  });
});
