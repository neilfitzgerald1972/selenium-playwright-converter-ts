import { keyboardConversions } from '../src/conversions/keyboard-conversions';

describe('keyboardConversions', () => {
  // Helper function to apply the conversion rules to a string
  const applyConversion = (code: string): string => {
    let result = code;
    // Sort by priority (highest first) like the real converter does
    const sortedRules = [...keyboardConversions].sort(
      (a, b) => (b.priority || 0) - (a.priority || 0)
    );
    sortedRules.forEach(rule => {
      if (rule.pattern && rule.replacement) {
        result = result.replace(rule.pattern, rule.replacement as any);
      }
    });
    return result;
  };

  it('should convert modifier key combinations', () => {
    // Test Control+A
    expect(applyConversion('element.sendKeys(Keys.CONTROL, "a")')).toContain(
      "await element.press('Control+A')"
    );

    // Test Control+C
    expect(applyConversion('element.sendKeys(Keys.CONTROL, "c")')).toContain(
      "await element.press('Control+C')"
    );

    // Test Control+V
    expect(applyConversion('element.sendKeys(Keys.CONTROL, "v")')).toContain(
      "await element.press('Control+V')"
    );
  });

  it('should handle special keys', () => {
    // Test ArrowDown
    expect(applyConversion('element.sendKeys(Keys.ARROW_DOWN)')).toContain(
      "await element.press('ArrowDown')"
    );

    // Test Enter
    expect(applyConversion('element.sendKeys(Keys.ENTER)')).toContain(
      "await element.press('Enter')"
    );
  });

  it('should handle text input', () => {
    // Test simple text - should use type() for the entire string
    const result1 = applyConversion('element.sendKeys("Hello, World!")');
    expect(result1).toContain("await element.type('Hello, World!')");

    // Test text with special characters - should be properly escaped
    const result2 = applyConversion('element.sendKeys("Hello, World! 123 @#$%^&*()_+")');
    expect(result2).toContain("await element.type('Hello, World! 123 @#$%^&*()_+')");

    // Test text with newlines - should be properly escaped
    const result3 = applyConversion('element.sendKeys("Line 1\\nLine 2")');
    expect(result3).toContain("await element.type('Line 1\\\\nLine 2')");
  });
});
