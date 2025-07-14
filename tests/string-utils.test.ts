import { escapeForSingleQuotes, escapeRegExp } from '../src/utils/string-utils';

describe('String Utils', () => {
  describe('escapeForSingleQuotes', () => {
    it('should escape single quotes', () => {
      expect(escapeForSingleQuotes("Don't stop")).toBe("Don\\'t stop");
    });

    it('should escape backticks', () => {
      expect(escapeForSingleQuotes('`code`')).toBe('\\`code\\`');
    });

    it('should escape backslashes', () => {
      expect(escapeForSingleQuotes('C:\\path\\to\\file')).toBe('C:\\\\path\\\\to\\\\file');
    });

    it('should escape control characters', () => {
      expect(escapeForSingleQuotes('Line 1\nLine 2\tTabbed')).toBe('Line 1\\nLine 2\\tTabbed');
    });

    it('should not escape double quotes', () => {
      expect(escapeForSingleQuotes('"quoted"')).toBe('"quoted"');
    });

    it('should handle empty string', () => {
      expect(escapeForSingleQuotes('')).toBe('');
    });

    it('should handle null or undefined', () => {
      expect(escapeForSingleQuotes(null as any)).toBe('');
      expect(escapeForSingleQuotes(undefined as any)).toBe('');
    });

    it('should handle non-string input by converting to string', () => {
      expect(escapeForSingleQuotes(123 as any)).toBe('123');
      expect(escapeForSingleQuotes(true as any)).toBe('true');
    });
  });

  describe('escapeRegExp', () => {
    it('should escape special regex characters', () => {
      expect(escapeRegExp('^[test]')).toBe('\\^\\[test\\]');
    });

    it('should not escape normal characters', () => {
      expect(escapeRegExp('test123')).toBe('test123');
    });

    it('should handle empty string', () => {
      expect(escapeRegExp('')).toBe('');
    });
  });
});
