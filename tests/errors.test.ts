import {
  ConversionError,
  UnsupportedActionError,
  InvalidInputError,
  createError,
  isConversionError,
} from '../src/utils/errors';

describe('Error Utilities', () => {
  describe('Custom Error Types', () => {
    it('should create a basic ConversionError', () => {
      const error = new ConversionError('Test error', { key: 'value' });
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.name).toBe('ConversionError');
      expect(error.message).toBe('Test error');
      expect(error.context).toEqual({ key: 'value' });
    });

    it('should create an UnsupportedActionError', () => {
      const error = new UnsupportedActionError('unsupported_action', { detail: 'test' });
      expect(error).toBeInstanceOf(ConversionError);
      expect(error).toBeInstanceOf(UnsupportedActionError);
      expect(error.name).toBe('UnsupportedActionError');
      expect(error.message).toBe('Unsupported action: unsupported_action');
      expect(error.action).toBe('unsupported_action');
      expect(error.context).toEqual({ action: 'unsupported_action', detail: 'test' });
    });

    it('should create an InvalidInputError', () => {
      const input = { bad: 'input' };
      const error = new InvalidInputError(input, 'string', { extra: 'info' });
      expect(error).toBeInstanceOf(ConversionError);
      expect(error).toBeInstanceOf(InvalidInputError);
      expect(error.name).toBe('InvalidInputError');
      expect(error.message).toContain('Invalid input: expected string but got object');
      expect(error.input).toBe(input);
      expect(error.expected).toBe('string');
      expect(error.context).toEqual({
        input,
        expected: 'string',
        extra: 'info',
      });
    });
  });

  describe('createError', () => {
    it('should create a ConversionError by default', () => {
      const error = createError('Test error', 'conversion', { test: true });
      expect(error).toBeInstanceOf(ConversionError);
      expect(error.message).toBe('Test error');
      expect((error as ConversionError).context).toHaveProperty('test', true);
      expect((error as ConversionError).context).toHaveProperty('timestamp');
    });

    it('should create an UnsupportedActionError', () => {
      const error = createError('unsupported_action', 'unsupported', { detail: 'test' });
      expect(error).toBeInstanceOf(UnsupportedActionError);
      expect(error.message).toBe('Unsupported action: unsupported_action');
    });

    it('should create an InvalidInputError', () => {
      const error = createError('', 'input', {
        input: 123,
        expected: 'string',
        detail: 'test',
      });
      expect(error).toBeInstanceOf(InvalidInputError);
      expect(error.message).toContain('Invalid input: expected string but got number');
    });
  });

  describe('isConversionError', () => {
    it('should return true for ConversionError instances', () => {
      const error = new ConversionError('test');
      expect(isConversionError(error)).toBe(true);
    });

    it('should return true for UnsupportedActionError instances', () => {
      const error = new UnsupportedActionError('test');
      expect(isConversionError(error)).toBe(true);
    });

    it('should return true for InvalidInputError instances', () => {
      const error = new InvalidInputError('test', 'number');
      expect(isConversionError(error)).toBe(true);
    });

    it('should return true for error-like objects with matching name', () => {
      const error = {
        name: 'ConversionError',
        message: 'test',
        context: {},
      };
      expect(isConversionError(error)).toBe(true);
    });

    it('should return false for non-conversion errors', () => {
      expect(isConversionError(new Error('test'))).toBe(false);
      expect(isConversionError('not an error')).toBe(false);
      expect(isConversionError(null)).toBe(false);
      expect(isConversionError(undefined)).toBe(false);
    });
  });
});
