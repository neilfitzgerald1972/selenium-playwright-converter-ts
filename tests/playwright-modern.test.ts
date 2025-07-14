import { createConverter, resetMocks } from './utils/test-utils';

describe('Playwright Modern (2024/2025) Conversions', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  describe('Clock API Suggestions', () => {
    it('should suggest Clock API for time-based testing', () => {
      const input = 'await driver.manage().timeouts().setScriptTimeout(5000);';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        "// TODO: Consider using Playwright's Clock API for time-based testing"
      );
      expect(result.convertedCode).toContain('// await page.clock.install({ time: new Date() });');
      expect(result.convertedCode).toContain('// await page.clock.fastForward(5000);');
    });
  });

  describe('Enhanced Cookie Operations', () => {
    it.skip('should suggest partitionKey for enhanced cookie privacy', () => {
      const input = 'await page.context().addCookies([{ name: "session", value: "abc123" }]);';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced cookie support in Playwright 2024+');
      expect(result.convertedCode).toContain("partitionKey: 'https://example.com'");
      expect(result.convertedCode).toContain('// Add partitionKey for enhanced privacy');
    });
  });

  describe('Directory Upload Support', () => {
    it('should suggest directory upload for file inputs', () => {
      const input = 'await element.setInputFiles("files", "/path/to/files");';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        '// Enhanced file upload in Playwright 2024+ supports directories'
      );
      expect(result.convertedCode).toContain(
        '// For directory uploads, use webkitdirectory input:'
      );
      expect(result.convertedCode).toContain(
        "{ name: 'folder/file1.txt', mimeType: 'text/plain', buffer: Buffer.from('content1') }"
      );
    });
  });

  describe('Aria Snapshot Testing', () => {
    it('should suggest aria snapshot testing for accessibility', () => {
      const input = 'await element.getAttribute("aria-label");';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        "// Consider using Playwright's aria snapshot testing (2024+)"
      );
      expect(result.convertedCode).toContain(
        '// const snapshot = await element.ariaSnapshot({ ref: true });'
      );
      expect(result.convertedCode).toContain(
        "// expect(snapshot).toMatchSnapshot('aria-structure.txt');"
      );
    });

    it('should suggest aria snapshot for aria attributes', () => {
      const input = 'await element.getAttribute("aria-expanded");';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        "// Consider using Playwright's aria snapshot testing (2024+)"
      );
    });
  });

  describe('Enhanced Locator Methods', () => {
    it('should suggest toContainClass for class checking', () => {
      const input = 'await page.locator(".card").getAttribute("class");';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced class checking in Playwright 2024+');
      expect(result.convertedCode).toContain('// Use toContainClass for better class assertions:');
      expect(result.convertedCode).toContain(
        '// await expect(page.locator(".card")).toContainClass(\'expected-class\');'
      );
    });
  });

  describe('API Testing Integration', () => {
    it('should suggest API testing instead of evaluate fetch', () => {
      const input = 'await page.evaluate(() => fetch("/api/data"));';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        "// Consider using Playwright's API testing capabilities (2024+)"
      );
      expect(result.convertedCode).toContain(
        '// const response = await page.request.get("/api/data");'
      );
      expect(result.convertedCode).toContain('// expect(response.status()).toBe(200);');
    });

    it('should handle complex fetch patterns', () => {
      const input = 'await page.evaluate(() => fetch("/api/users", { method: "POST" }));';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        "// Consider using Playwright's API testing capabilities (2024+)"
      );
    });
  });

  describe('Enhanced Network Interception', () => {
    it.skip('should suggest maxRedirects option for network requests', () => {
      const input = 'await page.route("**/api/**", route => route.continue());';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        '// Enhanced network interception in Playwright 2024+'
      );
      expect(result.convertedCode).toContain(
        '// Consider using request context with maxRedirects:'
      );
      expect(result.convertedCode).toContain(
        '// const apiContext = await request.newContext({ maxRedirects: 5 });'
      );
    });
  });

  describe('Enhanced URL Matching', () => {
    it('should add ignoreCase option for URL matching', () => {
      const input = 'expect(page).toHaveURL("/dashboard");';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced URL matching in Playwright 2024+');
      expect(result.convertedCode).toContain(
        'expect(page).toHaveURL("/dashboard", { ignoreCase: true })'
      );
    });

    it('should handle regex URL patterns', () => {
      const input = 'expect(page).toHaveURL(/dashboard/);';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced URL matching in Playwright 2024+');
      expect(result.convertedCode).toContain('{ ignoreCase: true }');
    });
  });

  describe('Locator Debugging', () => {
    it('should use locator.describe() for better debugging', () => {
      const input = 'console.log(page.locator(".button"));';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced locator debugging in Playwright 2024+');
      expect(result.convertedCode).toContain('console.log(page.locator(".button").describe())');
    });

    it('should handle complex locator debugging', () => {
      const input = 'console.log(page.locator(".card").first());';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced locator debugging in Playwright 2024+');
      expect(result.convertedCode).toContain('.describe()');
    });
  });

  describe('Enhanced Cookie Clearing', () => {
    it('should add filtered cookie clearing options', () => {
      const input = 'await page.context().clearCookies();';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced cookie clearing in Playwright 2024+');
      expect(result.convertedCode).toContain(
        "// Or use filters: await page.context().clearCookies({ domain: 'example.com' });"
      );
    });
  });

  describe('Enhanced WaitFor', () => {
    it('should add explicit state options for waitFor', () => {
      const input = 'await element.waitFor();';
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('// Enhanced waitFor options in Playwright 2024+');
      expect(result.convertedCode).toContain("await element.waitFor({ state: 'visible' });");
      expect(result.convertedCode).toContain("// Other states: 'hidden', 'attached', 'detached'");
    });
  });

  describe('Complex Modern Patterns', () => {
    it('should handle multiple modern features together', () => {
      const input = `
        expect(page).toHaveURL("/dashboard");
        console.log(page.locator(".status"));
        await page.context().clearCookies();
      `;
      const result = converter.convert(input);

      expect(result.convertedCode).toContain('{ ignoreCase: true }');
      expect(result.convertedCode).toContain('.describe()');
      expect(result.convertedCode).toContain('// Enhanced cookie clearing in Playwright 2024+');
    });

    it.skip('should handle API testing with enhanced features', () => {
      const input = `
        await page.evaluate(() => fetch("/api/data"));
        await page.route("**/api/**", route => route.continue());
      `;
      const result = converter.convert(input);

      expect(result.convertedCode).toContain(
        "// Consider using Playwright's API testing capabilities (2024+)"
      );
      expect(result.convertedCode).toContain(
        '// Enhanced network interception in Playwright 2024+'
      );
    });
  });
});
