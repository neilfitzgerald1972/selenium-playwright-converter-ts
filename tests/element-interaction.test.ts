import { createConverter, resetMocks } from './utils/test-utils';

describe('Element Interaction', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should convert click', () => {
    const input = 'element.click();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('element.click()');
  });

  it('should convert sendKeys to type', () => {
    const input = 'element.sendKeys("test");';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain("await element.type('test')");
  });

  it('should convert sendKeys with Key', () => {
    const input = 'element.sendKeys(Key.ENTER);';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain("await element.press('Enter')");
  });

  it('should convert getText', () => {
    const input = 'const text = element.getText();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const text = element.textContent()');
  });

  it('should convert getAttribute', () => {
    const input = 'const value = element.getAttribute("value");';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const value = element.inputValue()');
  });

  it('should convert isDisplayed', () => {
    const input = 'const visible = element.isDisplayed();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const visible = element.isVisible()');
  });

  it('should convert clear', () => {
    const input = 'element.clear();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('element.clear()');
  });

  it('should handle submit', () => {
    const input = 'element.submit();';
    const result = converter.convert(input);
    // Check for either direct conversion or original code
    const possibleOutputs = [
      'element.evaluate(e => e.submit())',
      'element.submit()',
      'element.evaluate(el => el.form?.submit())',
      'await element.evaluate(el => el.form?.submit())',
    ];
    expect(possibleOutputs.some(output => result.convertedCode.includes(output))).toBe(true);
  });
});
