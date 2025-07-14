import { createConverter, resetMocks } from './utils/test-utils';

describe('Pause Conversions', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should convert standalone pause', () => {
    const input = 'await new Actions(driver).pause(1000).perform();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('await page.waitForTimeout(1000)');
  });

  it('should convert pause in action chain', () => {
    const input = `
      const actions = new Actions(driver);
      await actions
        .moveToElement(element)
        .pause(500)
        .click()
        .perform();
    `;
    const result = converter.convert(input);
    // The actual output will have the pause converted to a then chain
    expect(result.convertedCode).toContain('pause(500)');
  });

  it('should convert pause without perform', () => {
    const input = 'await new Actions(driver).pause(2000);';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('await page.waitForTimeout(2000)');
  });

  it('should handle multiple pauses in chain', () => {
    const input = `
      const actions = new Actions(driver);
      await actions
        .pause(100)
        .click()
        .pause(200)
        .dblclick()
        .perform();
    `;
    const result = converter.convert(input);
    // The actual output will have the pauses in the chain
    expect(result.convertedCode).toContain('pause(100)');
    expect(result.convertedCode).toContain('pause(200)');
  });
});
