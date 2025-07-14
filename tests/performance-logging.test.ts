import { SeleniumToPlaywrightConverter } from '../src/converter';

describe('Performance Logging', () => {
  let converter: SeleniumToPlaywrightConverter;

  beforeEach(() => {
    converter = new SeleniumToPlaywrightConverter();
  });

  it('should convert enablePerformanceLogging', () => {
    const input = `
      const options = new chrome.Options();
      options.setLoggingPrefs({
        performance: 'ALL',
        browser: 'ALL'
      });
      const driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain("performance: 'all'");
    expect(result.convertedCode).toContain("browser: 'all'");
  });

  it('should convert getLogs for performance logs', () => {
    const input = `
      const logs = driver.manage().logs().get('performance');
      console.log('Performance logs:', logs);
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('page.evaluate(() => window.performance.getEntries())');
  });

  it('should convert getMetrics', () => {
    const input = `
      const metrics = driver.executeScript('return window.performance.getEntriesByType('measure')');
      console.log('Performance metrics:', metrics);
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      `page.evaluate(() => window.performance.getEntriesByType('measure'))`
    );
  });

  it('should convert performance timing', () => {
    const input = `
      const timing = driver.executeScript('return window.performance.timing');
      console.log('Navigation timing:', timing);
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('page.evaluate(() => window.performance.timing)');
  });

  it('should convert performance marks and measures', () => {
    const input = `
      // Record a mark
      driver.executeScript('performance.mark('myMark')');
      
      // Record a measure
      driver.executeScript('performance.measure('myMeasure', 'myMark', 'myEndMark')');
      
      // Get marks and measures
      const marks = driver.executeScript('return performance.getEntriesByType('mark')');
      const measures = driver.executeScript('return performance.getEntriesByType('measure')');
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain(`await page.evaluate(() => performance.mark('myMark'))`);
    expect(result.convertedCode).toContain(
      `await page.evaluate(() => performance.measure('myMeasure', 'myMark', 'myEndMark'))`
    );
    expect(result.convertedCode).toContain(
      `const marks = await page.evaluate(() => performance.getEntriesByType('mark'))`
    );
    expect(result.convertedCode).toContain(
      `const measures = await page.evaluate(() => performance.getEntriesByType('measure'))`
    );
  });

  it('should handle performance.now()', () => {
    const input = `
      const time = driver.executeScript('return performance.now()');
      console.log('Current timestamp:', time);
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      'const time = await page.evaluate(() => performance.now())'
    );
  });

  it('should handle non-existent marks gracefully', () => {
    const input = `
      driver.executeScript('performance.measure('measure1', 'non-existent-mark')');
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      `await page.evaluate(() => performance.measure('measure1', 'non-existent-mark'))`
    );
  });

  it('should clear marks and measures', () => {
    const input = `
      // Clear marks and measures
      driver.executeScript('performance.clearMarks()');
      driver.executeScript('performance.clearMeasures()');
      
      // Clear specific mark
      driver.executeScript('performance.clearMarks('specificMark')');
      
      // Clear specific measure
      driver.executeScript('performance.clearMeasures('specificMeasure')');
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain(`await page.evaluate(() => performance.clearMarks())`);
    expect(result.convertedCode).toContain(
      `await page.evaluate(() => performance.clearMeasures())`
    );
    expect(result.convertedCode).toContain(
      `await page.evaluate(() => performance.clearMarks('specificMark'))`
    );
    expect(result.convertedCode).toContain(
      `await page.evaluate(() => performance.clearMeasures('specificMeasure'))`
    );
  });

  it('should handle performance memory (Chrome only)', () => {
    const input = `
      const memory = driver.executeScript('return window.performance.memory');
      console.log('Memory usage:', memory);
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      'const memory = await page.evaluate(() => (window as any).performance.memory)'
    );
  });
});
