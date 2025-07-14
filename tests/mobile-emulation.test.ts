import { createConverter, resetMocks } from './utils/test-utils';

describe('Mobile Emulation', () => {
  let converter: any;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should convert Chrome mobile emulation with device name', () => {
    const input = `
      const mobileEmulation = { deviceName: 'iPhone 6' };
      const chromeOptions = new chrome.Options().setMobileEmulation(mobileEmulation);
      const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('deviceScaleFactor');
    expect(result.convertedCode).toContain('isMobile');
    expect(result.convertedCode).toContain('hasTouch');
  });

  it('should convert Chrome mobile emulation with device metrics', () => {
    const input = `
      const mobileEmulation = {
        deviceMetrics: {
          width: 375,
          height: 812,
          pixelRatio: 3,
          touch: true
        },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A356 Safari/604.1'
      };
      const chromeOptions = new chrome.Options().setMobileEmulation(mobileEmulation);
      const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('viewport');
    expect(result.convertedCode).toContain('width: 375');
    expect(result.convertedCode).toContain('height: 812');
    expect(result.convertedCode).toContain('deviceScaleFactor: 3');
    expect(result.convertedCode).toContain('hasTouch: true');
    expect(result.convertedCode).toContain('userAgent');
  });

  it('should convert Chrome mobile emulation with user agent only', () => {
    const input = `
      const mobileEmulation = {
        userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
      };
      const chromeOptions = new chrome.Options().setMobileEmulation(mobileEmulation);
      const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('userAgent');
    expect(result.convertedCode).not.toContain('deviceScaleFactor');
  });

  it('should handle Android Chrome mobile emulation', () => {
    const input = `
      const mobileEmulation = { deviceName: 'Pixel 5' };
      const chromeOptions = new chrome.Options().setMobileEmulation(mobileEmulation);
      const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('isMobile');
    expect(result.convertedCode).toContain('hasTouch');
  });
});
