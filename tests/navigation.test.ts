import { createConverter, resetMocks, testNavigation } from './utils/test-utils';

describe('Navigation', () => {
  beforeEach(() => {
    resetMocks();
  });

  // Test navigation methods
  testNavigation('get', 'goto', 'https://example.com');
  testNavigation('navigate().to', 'goto', 'https://example.com');
  testNavigation('navigate().back', 'goBack');
  testNavigation('navigate().forward', 'goForward');
  testNavigation('navigate().refresh', 'reload');

  it('should convert getCurrentUrl', () => {
    const converter = createConverter();
    const input = 'const url = driver.getCurrentUrl();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const url = page.url()');
  });

  it('should convert getTitle', () => {
    const converter = createConverter();
    const input = 'const title = driver.getTitle();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const title = await page.title()');
  });
});
