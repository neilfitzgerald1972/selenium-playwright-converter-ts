import { convertSendKeys } from '../src/conversions/keyboard-conversions';

describe('Special Character Handling', () => {
  // Test basic special characters
  it('should handle basic special characters', () => {
    const input = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?`~';
    const expected = "await page.keyboard.type('!@#$%^&*()_+-=[]{}|;:\\'\",.<>/?\\`~')";
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test Unicode characters
  it('should handle Unicode characters', () => {
    const input = 'こんにちは世界';
    const expected = `await page.keyboard.type('${input}')`;
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test emojis
  it('should handle emojis', () => {
    const input = 'Hello 😊 World 🌍';
    const expected = `await page.keyboard.type('Hello 😊 World 🌍')`;
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test RTL text
  it('should handle right-to-left text', () => {
    const input = 'مرحبا بالعالم';
    const expected = `await page.keyboard.type('${input}')`;
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test combining characters
  it('should handle combining characters', () => {
    const input = 'café';
    const expected = `await page.keyboard.type('${input}')`;
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test control characters
  it('should escape control characters', () => {
    const input = 'Line 1\nLine 2\tTabbed';
    const expected = `await page.keyboard.type('Line 1\\nLine 2\\tTabbed')`;
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test mixed content
  it('should handle mixed content with special characters', () => {
    const input = 'Email: test@example.com, Phone: (123) 456-7890';
    const expected = `await page.keyboard.type('Email: test@example.com, Phone: (123) 456-7890')`;
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test strings with backticks
  it('should handle strings containing backticks', () => {
    const input = 'Code: `const x = 1`';
    const expected = "await page.keyboard.type('Code: \\`const x = 1\\`')";
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test with element context
  it('should handle special characters with element context', () => {
    const input = 'user@example.com';
    const expected = `await element.type('user@example.com')`;
    expect(convertSendKeys(`"${input}"`, 'element')).toBe(expected);
  });

  // Test with key chords and special characters
  it('should handle key chords with special characters', () => {
    const chord = 'Control+a';
    const expected = `await page.keyboard.press('Control+a')`;
    expect(convertSendKeys(chord)).toBe(expected);
  });

  // Test with multiple special characters in sequence
  it('should handle multiple special characters in sequence', () => {
    const input = '★☆★ Special ★☆★';
    const expected = `await page.keyboard.type('★☆★ Special ★☆★')`;
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });

  // Test control characters
  it('should properly escape control characters', () => {
    const input = 'Line 1\nLine 2\tTabbed\r\f\v';
    const expected = "await page.keyboard.type('Line 1\\nLine 2\\tTabbed\\r\\f\\v')";
    expect(convertSendKeys(`"${input}"`)).toBe(expected);
  });
});
