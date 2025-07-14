import { createConverter, resetMocks } from './utils/test-utils';

// Helper function to normalize whitespace for comparison
const normalizeWhitespace = (str: string): string => {
  return str
    .replace(/\s+/g, ' ') // Replace all whitespace with single space
    .trim();
};

describe('JavaScript Execution', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should convert simple executeScript with string', () => {
    const input = 'driver.executeScript("return document.title");';
    const result = converter.convert(input);

    // Extract just the relevant part of the output
    const code = result.convertedCode.split('await page.evaluate')[1] || '';
    const normalized = normalizeWhitespace(code);

    expect(normalized).toContain('() => { return return document.title }');
  });

  it('should convert executeScript with arguments', () => {
    const input = 'driver.executeScript("return arguments[0] + arguments[1]", [1, 2]);';
    const result = converter.convert(input);

    const code = result.convertedCode.split('await page.evaluate')[1] || '';
    const normalized = normalizeWhitespace(code);

    expect(normalized).toContain('([1, 2]) => { return arguments[0] + arguments[1] }');
    expect(normalized).toContain(', [1, 2]');
  });

  it('should convert executeScript with function', () => {
    const input = 'driver.executeScript(function(arg1, arg2) { return arg1 + arg2; }, [1, 2]);';
    const result = converter.convert(input);

    const code = result.convertedCode.split('await page.evaluate')[1] || '';
    const normalized = normalizeWhitespace(code);

    expect(normalized).toContain('(arg1, arg2) => { return arg1 + arg2; }');
    expect(normalized).toContain(', [1, 2]');
  });

  it('should convert executeAsyncScript with string', () => {
    const input =
      'driver.executeAsyncScript("const callback = arguments[arguments.length - 1]; callback(document.title);");';
    const result = converter.convert(input);

    const code = result.convertedCode.split('await page.evaluate')[1] || '';
    const normalized = normalizeWhitespace(code);

    expect(normalized).toContain('() => { return new Promise((done) => {');
    expect(normalized).toContain(
      'const callback = arguments[arguments.length - 1]; callback(document.title);'
    );
  });

  it('should convert executeAsyncScript with function', () => {
    const input = 'driver.executeAsyncScript(function(done) { done(document.title); });';
    const result = converter.convert(input);

    const code = result.convertedCode.split('await page.evaluate')[1] || '';
    const normalized = normalizeWhitespace(code);

    expect(normalized).toContain('async () => { return new Promise((done) => {');
    expect(normalized).toContain('(done) => { done(document.title); }');
  });

  it('should handle return values in executeScript', () => {
    const input = 'driver.executeScript("document.title");';
    const result = converter.convert(input);

    const code = result.convertedCode.split('await page.evaluate')[1] || '';
    const normalized = normalizeWhitespace(code);

    expect(normalized).toContain('() => { return document.title }');
  });
});
