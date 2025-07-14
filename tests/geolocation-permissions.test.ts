import { SeleniumToPlaywrightConverter } from '../src/converter';

describe('Geolocation and Permissions', () => {
  let converter: SeleniumToPlaywrightConverter;

  beforeEach(() => {
    converter = new SeleniumToPlaywrightConverter();
  });

  it('should convert geolocation get', () => {
    const input = `
      const location = driver.executeScript('return navigator.geolocation.getCurrentPosition(function(position) { return position; })');
      console.log('Location:', location);
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      'const location = await page.evaluate(() => navigator.geolocation.getCurrentPosition((position) => position))'
    );
  });

  it('should convert geolocation watch', () => {
    const input = `
      const watchId = driver.executeScript('return navigator.geolocation.watchPosition(function(position) { console.log(position); })');
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const watchId = await page.evaluate(() => {');
    expect(result.convertedCode).toContain(
      'return navigator.geolocation.watchPosition((position) => {'
    );
    expect(result.convertedCode).toContain('console.log(position);');
  });

  it('should convert geolocation clearWatch', () => {
    const input = `
      driver.executeScript('navigator.geolocation.clearWatch(123)');
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('await page.evaluate((watchId) => {');
    expect(result.convertedCode).toContain('return navigator.geolocation.clearWatch(watchId);');
    expect(result.convertedCode).toContain('}, 123)');
  });

  it('should convert permissions query', () => {
    const input = `
      const permission = driver.executeScript('return navigator.permissions.query({name: 'geolocation'})');
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const permission = await page.evaluate(');
    expect(result.convertedCode).toContain('navigator.permissions.query');
  });

  it('should convert geolocation mock', () => {
    const input = `
      driver.executeScript('navigator.geolocation.getCurrentPosition = function(success) { 
        success({ coords: { latitude: 40.7128, longitude: -74.0060 } }); 
      }');
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('await page.evaluate(() => {');
    expect(result.convertedCode).toContain(
      'navigator.geolocation.getCurrentPosition = function(success)'
    );
    expect(result.convertedCode).toContain(
      'success({ coords: { latitude: 40.7128, longitude: -74.0060 } });'
    );
  });
});
