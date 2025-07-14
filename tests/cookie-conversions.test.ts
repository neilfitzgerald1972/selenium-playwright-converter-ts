import { createConverter, resetMocks } from './utils/test-utils';

describe('Cookie Conversions', () => {
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
        .find(line => line.includes('driver.context()'))
        ?.trim() + ';'
    );
  };

  it('should convert addCookie', () => {
    const input = 'driver.manage().addCookie({ name: "test", value: "value" });';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain('driver.context().addCookies([{ name: "test", value: "value" }])');
  });

  it('should convert getCookie', () => {
    const input = 'const cookie = driver.manage().getCookie("test");';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain(
      "const cookie = await driver.context().cookies().then(cookies => cookies.find(c => c.name === 'test'"
    );
  });

  it('should convert getCookies', () => {
    const input = 'const cookies = driver.manage().getCookies();';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain('const cookies = await driver.context().cookies()');
  });

  it('should convert deleteCookie', () => {
    const input = 'driver.manage().deleteCookie("test");';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain("await driver.context().clearCookies({ name: 'test' })");
  });

  it('should convert deleteAllCookies', () => {
    const input = 'driver.manage().deleteAllCookies();';
    const result = converter.convert(input);
    const converted = getConvertedCode(result);
    expect(converted).toContain('driver.context().cookies().then(cookies => {');
    expect(converted).toContain('return Promise.all(cookies.map(cookie =>');
    expect(converted).toContain('driver.context().clearCookies({ name: cookie.name })');
  });
});
