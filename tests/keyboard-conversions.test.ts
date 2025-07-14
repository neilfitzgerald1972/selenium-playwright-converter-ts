import {
  convertKey,
  convertKeyChord,
  parseKeyChord,
  isModifierKey,
} from '../src/utils/key-mappings';

describe('Key Mappings', () => {
  describe('convertKey', () => {
    it('should convert basic keys', () => {
      expect(convertKey('Enter')).toBe('Enter');
      expect(convertKey('Escape')).toBe('Escape');
      expect(convertKey('Tab')).toBe('Tab');
    });

    it('should convert keys with Keys. prefix', () => {
      expect(convertKey('Keys.Enter')).toBe('Enter');
      expect(convertKey('Keys.Escape')).toBe('Escape');
      expect(convertKey('Keys.Tab')).toBe('Tab');
    });

    it('should convert modifier keys', () => {
      expect(convertKey('Shift')).toBe('Shift');
      expect(convertKey('Control')).toBe('Control');
      expect(convertKey('Alt')).toBe('Alt');
      expect(convertKey('Meta')).toBe('Meta');
      expect(convertKey('Command')).toBe('Meta');
    });

    it('should convert numpad keys', () => {
      expect(convertKey('Numpad0')).toBe('Numpad0');
      expect(convertKey('NumpadAdd')).toBe('NumpadAdd');
      expect(convertKey('NumpadDecimal')).toBe('NumpadDecimal');

      // Legacy numpad keys
      expect(convertKey('ADD')).toBe('NumpadAdd');
      expect(convertKey('DECIMAL')).toBe('NumpadDecimal');
    });
  });

  describe('parseKeyChord', () => {
    it('should parse single key', () => {
      expect(parseKeyChord('Enter')).toEqual(['Enter']);
      expect(parseKeyChord('Keys.Enter')).toEqual(['Enter']);
    });

    it('should parse key combinations', () => {
      expect(parseKeyChord('Control+A')).toEqual(['Control', 'A']);
      expect(parseKeyChord('Control + A')).toEqual(['Control', 'A']);
      expect(parseKeyChord('Control+Shift+A')).toEqual(['Control', 'Shift', 'A']);
    });

    it('should handle Keys. prefix in combinations', () => {
      expect(parseKeyChord('Keys.Control+Keys.A')).toEqual(['Control', 'A']);
      expect(parseKeyChord('Keys.Control + Keys.A')).toEqual(['Control', 'A']);
    });

    it('should handle quoted keys', () => {
      expect(parseKeyChord("'a'")).toEqual(['a']);
      expect(parseKeyChord('"a"')).toEqual(['a']);
      expect(parseKeyChord('Control + "a"')).toEqual(['Control', 'a']);
    });
  });

  describe('convertKeyChord', () => {
    it('should convert single key', () => {
      expect(convertKeyChord('Enter')).toBe('Enter');
      expect(convertKeyChord('Keys.Enter')).toBe('Enter');
    });

    it('should convert key combinations', () => {
      expect(convertKeyChord('Control+A')).toBe('Control+A');
      expect(convertKeyChord('Control+Shift+A')).toBe('Control+Shift+A');
      expect(convertKeyChord('CommandOrControl+C')).toBe(
        process.platform === 'darwin' ? 'Meta+C' : 'Control+C'
      );
    });

    it('should handle Keys. prefix in combinations', () => {
      expect(convertKeyChord('Keys.Control+Keys.A')).toBe('Control+A');
      expect(convertKeyChord('Keys.Command+Keys.C')).toBe('Meta+C');
    });
  });

  describe('isModifierKey', () => {
    it('should identify modifier keys', () => {
      expect(isModifierKey('Shift')).toBe(true);
      expect(isModifierKey('Control')).toBe(true);
      expect(isModifierKey('Alt')).toBe(true);
      expect(isModifierKey('Meta')).toBe(true);
      expect(isModifierKey('Command')).toBe(true);
      expect(isModifierKey('LeftShift')).toBe(true);
      expect(isModifierKey('RightControl')).toBe(true);
    });

    it('should identify non-modifier keys', () => {
      expect(isModifierKey('A')).toBe(false);
      expect(isModifierKey('Enter')).toBe(false);
      expect(isModifierKey('Space')).toBe(false);
    });

    it('should handle Keys. prefix', () => {
      expect(isModifierKey('Keys.Shift')).toBe(true);
      expect(isModifierKey('Keys.Control')).toBe(true);
      expect(isModifierKey('Keys.A')).toBe(false);
    });
  });
});

describe('Keyboard Conversions', () => {
  // Test cases for the keyboard conversions will be added here
  // after we implement the keyboard-conversions.ts file
  it('should have tests for keyboard conversions', () => {
    expect(true).toBe(true);
  });
});
