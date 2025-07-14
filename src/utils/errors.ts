/**
 * Custom error types for the Selenium to Playwright converter.
 * These errors provide more context about what went wrong during conversion.
 */

export class ConversionError extends Error {
  constructor(
    message: string,
    public readonly context: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = 'ConversionError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConversionError);
    }
  }
}

export class UnsupportedActionError extends ConversionError {
  constructor(
    public readonly action: string,
    context: Record<string, unknown> = {}
  ) {
    super(`Unsupported action: ${action}`, { ...context, action });
    this.name = 'UnsupportedActionError';
  }
}

export class InvalidInputError extends ConversionError {
  constructor(
    public readonly input: unknown,
    public readonly expected: string,
    context: Record<string, unknown> = {}
  ) {
    super(`Invalid input: expected ${expected} but got ${typeof input}`, {
      ...context,
      input,
      expected,
    });
    this.name = 'InvalidInputError';
  }
}

/**
 * Creates a standardized error object with additional context
 */
export function createError(
  message: string,
  type: 'conversion' | 'unsupported' | 'input' = 'conversion',
  context: Record<string, unknown> = {}
): Error {
  const errorContext = {
    ...context,
    timestamp: new Date().toISOString(),
  };

  switch (type) {
    case 'unsupported':
      return new UnsupportedActionError(message, errorContext);
    case 'input':
      return new InvalidInputError(context.input, context.expected as string, errorContext);
    case 'conversion':
    default:
      return new ConversionError(message, errorContext);
  }
}

/**
 * Type guard to check if an error is one of our custom error types
 */
export function isConversionError(error: unknown): error is ConversionError {
  if (!error || typeof error !== 'object') return false;

  const errorObj = error as Record<string, unknown>;
  const hasName = 'name' in errorObj && typeof errorObj.name === 'string';
  const hasMessage = 'message' in errorObj && typeof errorObj.message === 'string';
  const validErrorNames = ['ConversionError', 'UnsupportedActionError', 'InvalidInputError'];

  return hasName && hasMessage && validErrorNames.includes(errorObj.name as string);
}
