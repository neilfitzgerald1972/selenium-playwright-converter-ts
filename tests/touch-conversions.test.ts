import { SeleniumToPlaywrightConverter } from '../src/converter';

// Create a new instance of the converter with touch conversions
const converter = new SeleniumToPlaywrightConverter();

// Helper function to get the converted code
function getConvertedCode(input: string): string {
  const result = converter.convert(input);
  return result.convertedCode;
}

describe('Touch Action Conversions', () => {
  // Mock the page object for testing
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should convert tap', () => {
    const input = 'touchActions.tap(element).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('await element.tap()');
  });

  it('should convert doubleTap', () => {
    const input = 'touchActions.doubleTap(element).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('await element.dblclick()');
  });

  it('should convert longPress without duration', () => {
    const input = 'touchActions.longPress(element).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('await element.hover()');
    expect(result).toContain('await page.mouse.down()');
    expect(result).toContain('await page.waitForTimeout(1000)');
    expect(result).toContain('await page.mouse.up()');
  });

  it('should convert longPress with duration', () => {
    const input = 'touchActions.longPress(element, 2000).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('await page.waitForTimeout(2000)');
  });

  it('should convert flick', () => {
    const input = 'touchActions.flick(100, 200).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('Flick with speed x:100, y:200');
    expect(result).toContain('await page.mouse.move(0, 0)');
    expect(result).toContain('await page.mouse.down()');
    expect(result).toMatch(/await page\.mouse\.move\(100, 200, \{ steps: 5 \}\)/);
    expect(result).toContain('await page.mouse.up()');
  });

  it('should convert flickElement', () => {
    const input = 'touchActions.flickElement(element, 10, 20, 100).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('Flick from element with offset x:10, y:20 at speed 100');
    expect(result).toContain('await element.hover()');
    expect(result).toContain('await page.mouse.down()');
    expect(result).toMatch(/await page\.mouse\.move\(10, 20, \{ steps: 5 \}\)/);
    expect(result).toContain('await page.mouse.up()');
  });

  it('should convert moveToElement with offset', () => {
    const input = 'touchActions.moveToElement(element, 10, 20).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('Move to element with offset x:10, y:20');
    expect(result).toContain('const box = await element.boundingBox()');
    expect(result).toContain('await page.mouse.move(box.x + 10, box.y + 20)');
  });

  it('should convert scroll', () => {
    const input = 'touchActions.scroll(100, 200).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('Scroll by x:100, y:200');
    expect(result).toContain('await page.mouse.wheel(100, 200)');
  });

  it('should convert scrollFromElement', () => {
    const input = 'touchActions.scrollFromElement(element, 10, 20).perform();';
    const result = getConvertedCode(input);
    expect(result).toContain('Scroll from element by x:10, y:20');
    expect(result).toContain('await element.hover()');
    expect(result).toContain('await page.mouse.wheel(10, 20)');
  });

  it('should handle TouchActions chain with manual review', () => {
    const input = 'new TouchActions(driver).tap(element1).doubleTap(element2).perform();';
    const result = converter.convert(input);
    // Check for the manual review comment in the output
    expect(result.convertedCode).toContain(
      '// Converted TouchActions chain - review and adjust as needed'
    );
    expect(result.convertedCode).toContain(
      '// TODO: Manually convert this TouchActions chain to Playwright equivalent'
    );
    expect(result.requiresManualReview).toBe(true);
  });
});
