import {
  keyboardConversions,
  convertKeyboardAction,
} from '../src/conversions/keyboard-conversions';
import { UnsupportedActionError, InvalidInputError } from '../src/utils/errors';

describe('Keyboard Conversion Error Handling', () => {
  describe('keyboardConversions', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(keyboardConversions)).toBe(true);
      expect(keyboardConversions.length).toBeGreaterThan(0);
    });

    it('should have expected structure for each conversion rule', () => {
      keyboardConversions.forEach(rule => {
        expect(rule).toHaveProperty('pattern');
        expect(rule).toHaveProperty('replacement');
        expect(rule).toHaveProperty('description');
        expect(rule).toHaveProperty('priority');
        expect(rule).toHaveProperty('category');
      });
    });
  });

  describe('Error Handling', () => {
    describe('convertKeyboardAction', () => {
      it('should throw InvalidInputError for empty key', () => {
        expect(() => convertKeyboardAction('press', '')).toThrow(InvalidInputError);
        expect(() => convertKeyboardAction('press', '   ')).toThrow(InvalidInputError);
      });

      it('should throw InvalidInputError for non-string key', () => {
        // @ts-expect-error - Testing invalid input
        expect(() => convertKeyboardAction('press', null)).toThrow(InvalidInputError);
        // @ts-expect-error - Testing invalid input
        expect(() => convertKeyboardAction('press', undefined)).toThrow(InvalidInputError);
        expect(() => convertKeyboardAction('press', 123 as any)).toThrow(InvalidInputError);
      });

      it('should throw UnsupportedActionError for unsupported actions', () => {
        expect(() => convertKeyboardAction('unsupportedAction', 'a')).toThrow(
          UnsupportedActionError
        );
        expect(() => convertKeyboardAction('type', 'a')).toThrow(UnsupportedActionError);
      });

      it('should throw InvalidInputError for invalid key format', () => {
        // This assumes that 'INVALID_KEY' is not in the key mappings
        expect(() => convertKeyboardAction('press', 'INVALID_KEY')).toThrow(InvalidInputError);
      });
    });

    it('should handle errors from key mappings', () => {
      // Mock the key-mappings module to throw an error
      jest.mock('@/utils/key-mappings', () => ({
        ...jest.requireActual('@/utils/key-mappings'),
        normalizeKey: jest.fn().mockImplementation(() => {
          throw new Error('Test error from normalizeKey');
        }),
      }));

      // Import the module after mocking
      return import('../src/conversions/keyboard-conversions')
        .then(({ keyboardConversions: mockConversions }) => {
          // The keyboardConversions should still be an array even if there are errors in helper functions
          expect(Array.isArray(mockConversions)).toBe(true);
        })
        .finally(() => {
          // Restore the original implementation
          jest.unmock('@/utils/key-mappings');
        });
    });
  });
});
