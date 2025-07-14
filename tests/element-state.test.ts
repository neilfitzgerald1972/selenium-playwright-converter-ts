import { createConverter, resetMocks } from './utils/test-utils';

describe('Element State Checks', () => {
  let converter: ReturnType<typeof createConverter>;

  beforeEach(() => {
    resetMocks();
    converter = createConverter();
  });

  it('should convert getSize()', () => {
    const input = 'const size = element.getSize();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      `const size = element.boundingBox().then(box => ({\n      width: box?.width || 0,\n      height: box?.height || 0\n    }))`
    );
  });

  it('should convert getLocation()', () => {
    const input = 'const loc = element.getLocation();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      `const loc = element.boundingBox().then(box => ({\n      x: box?.x || 0,\n      y: box?.y || 0\n    }))`
    );
  });

  it('should convert getRect()', () => {
    const input = 'const rect = element.getRect();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain('const rect = element.boundingBox()');
  });

  it('should convert getCssValue()', () => {
    const input = 'const color = element.getCssValue("color");';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      `const color = element.evaluate((el, prop) => {\n      const style = window.getComputedStyle(el);\n      return style.getPropertyValue(prop);\n    }, 'color')`
    );
  });

  it('should convert getAriaRole()', () => {
    const input = 'const role = element.getAriaRole();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      "const role = element.evaluate(el => el.getAttribute('role') || '')"
    );
  });

  it('should convert getAccessibleName()', () => {
    const input = 'const name = element.getAccessibleName();';
    const result = converter.convert(input);
    expect(result.convertedCode).toContain(
      `const name = element.evaluate(el => (\n      el.getAttribute('aria-label') ||\n      el.getAttribute('alt') ||\n      el.getAttribute('title') ||\n      (el.textContent || '').trim() || ''\n    ))`
    );
  });
});
