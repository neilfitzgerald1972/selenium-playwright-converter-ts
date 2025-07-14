import { createConverter, resetMocks } from './utils/test-utils';

describe('Dialog Handling', () => {
  let converter: any;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should handle simple alert dialog', () => {
    const input = `
      const alert = driver.switchTo().alert();
      const alertText = alert.getText();
      alert.accept();
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('page.once');
    expect(result.convertedCode).toContain('dialog.accept()');
    expect(result.convertedCode).toContain('dialog.message()');
  });

  it('should handle confirm dialog with accept and dismiss', () => {
    const input = `
      const confirm = driver.switchTo().alert();
      const confirmText = confirm.getText();
      confirm.accept();  // or confirm.dismiss();
    `;

    const result = converter.convert(input);
    expect(result.convertedCode).toContain('page.once');
    expect(result.convertedCode).toContain('dialog.accept()');
    expect(result.convertedCode).toContain('dialog.dismiss()');
    expect(result.convertedCode).toContain('dialog.message()');
  });

  it('should handle prompt dialog with input', () => {
    const input = `
      const prompt = driver.switchTo().alert();
      const promptText = prompt.getText();
      prompt.sendKeys('Hello, Playwright!');
      prompt.accept();
    `;

    // Debug output removed for production

    const result = converter.convert(input);

    // Check for specific patterns in the converted code
    const checks = {
      'page.once': result.convertedCode.includes('page.once'),
      'dialog.accept(': result.convertedCode.includes('dialog.accept('),
      'Hello, Playwright!': result.convertedCode.includes('Hello, Playwright!'),
      'dialog.message()': result.convertedCode.includes('dialog.message()'),
    };

    // Assertions
    expect(checks['page.once']).toBe(true);
    expect(checks['dialog.accept(']).toBe(true);
    expect(checks['Hello, Playwright!']).toBe(true);
    expect(checks['dialog.message()']).toBe(true);
  });

  it('should handle multiple dialogs in sequence', () => {
    const input = `
      // First alert
      const alert1 = driver.switchTo().alert();
      alert1.accept();
      
      // Then a confirm
      const confirm = driver.switchTo().alert();
      confirm.dismiss();
      
      // Then a prompt
      const prompt = driver.switchTo().alert();
      prompt.sendKeys('Test');
      prompt.accept();
    `;

    const result = converter.convert(input);
    // Should have multiple dialog handlers
    expect((result.convertedCode.match(/page\.once\(/g) || []).length).toBe(3);
    expect(result.convertedCode).toContain('dialog.accept()');
    expect(result.convertedCode).toContain('dialog.dismiss()');
    expect(result.convertedCode).toContain('Test');
  });
});
