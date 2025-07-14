/**
 * String utility functions for the Selenium to Playwright converter.
 *
 * This module provides helper functions for string manipulation and escaping,
 * particularly for generating valid JavaScript/TypeScript code strings.
 */

/**
 * Escapes special characters in a string for safe use in single-quoted Playwright code.
 *
 * This function ensures that a string can be safely embedded in single-quoted template literals
 * by escaping special characters according to the following rules:
 *
 * 1. Single quotes (') are escaped as \'
 * 2. Backticks (`) are escaped as \`
 * 3. Backslashes (\\) are escaped as \\\\
 * 4. Control characters (0x00-0x1F, 0x7F-0x9F) are escaped as \xNN
 * 5. Double quotes (") are NOT escaped since we're using single quotes
 * 6. All other characters are left as-is
 *
 * @example
 * escapeForSingleQuotes("Don't stop") // returns "Don\\'t stop"
 * escapeForSingleQuotes("Line 1\nLine 2") // returns "Line 1\\nLine 2"
 * escapeForSingleQuotes('`code`') // returns "\\`code\\`"
 *
 * @param {unknown} text - The input to escape
 * @returns {string} The escaped string, suitable for embedding in single-quoted strings
 */
/**
 * Determines if a key is a special key that should use press() instead of type()
 *
 * @example
 * isSpecialKey('Keys.ENTER') // returns true
 * isSpecialKey('Key.ENTER') // returns true
 * isSpecialKey('ENTER') // returns true
 * isSpecialKey('a') // returns false
 */
/**
 * Checks if a string is wrapped in single or double quotes
 *
 * @example
 * isQuoted("'hello'") // returns true
 * isQuoted('"world"') // returns true
 * isQuoted('hello')    // returns false
 */
export function isQuoted(key: string): boolean {
  return (key.startsWith("'") && key.endsWith("'")) || (key.startsWith('"') && key.endsWith('"'));
}

/**
 * Converts Selenium key names to Playwright key names
 *
 * @example
 * getKeyName('Keys.ENTER') // returns 'Enter'
 * getKeyName('Key.ENTER') // returns 'Enter'
 * getKeyName('CONTROL')   // returns 'Control'
 *
 * @param {string} key - The Selenium key name to convert
 * @returns {string} The equivalent Playwright key name
 */
export function getKeyName(key: string): string {
  if (key === 'Key.ENTER') return 'Enter';
  if (key.startsWith('Keys.')) {
    // Normalize key names like 'Keys.ENTER' to 'Enter'
    return key.substring(5);
  }
  // Preserve original case for key chords to maintain readability (e.g., 'Control+a')
  return key;
}

/**
 * Splits a string by commas, respecting quoted segments
 *
 * @example
 * splitByCommas('a, b, "c, d", e') // returns ['a', 'b', '"c, d"', 'e']
 * splitByCommas("'hello, world', 'goodbye, world'") // returns ["'hello, world'", "'goodbye, world'"]
 *
 * @param {string} input - The input string to split
 * @returns {string[]} An array of strings split by commas, with quoted segments preserved
 */
export function splitByCommas(input: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if ((char === '"' || char === "'") && (i === 0 || input[i - 1] !== '\\')) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
      current += char;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Determines if a key is a special key that should use press() instead of type()
 */
export function isSpecialKey(key: string): boolean {
  return (
    key.startsWith('Keys.') || key === 'Key.ENTER' || (/^[A-Z_]+$/.test(key) && !/^[a-z]/.test(key))
  );
}

export function escapeForSingleQuotes(text: unknown): string {
  // Handle null or undefined input
  if (text == null) {
    return '';
  }

  const str = String(text);
  let result = str;
  // Define control characters and their escape sequences
  const controlChars: Record<string, string> = {
    '\0': '\\0',
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\v': '\\v',
    '\f': '\\f',
    '\r': '\\r',
    "'": "\\'",
    '`': '\\`',
    '\\': '\\\\',
  };

  // First, handle backslashes to prevent double-escaping
  result = str.replace(/[\\]/g, '\\\\');

  // Then handle other control characters
  result = result.replace(/[\0\b\t\n\v\f\r'`]/g, match => controlChars[match] || '');

  // Replace any remaining control characters with hex escape sequences
  const controlCharRanges = [
    '\\x00-\\x1F', // ASCII control characters
    '\\x7F-\\x9F', // Extended ASCII control characters
  ];
  const controlCharRegex = new RegExp(`[${controlCharRanges.join('')}]`, 'g');
  result = result.replace(controlCharRegex, char => {
    // Skip already escaped characters
    if (char.startsWith('\\')) return char;
    const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
    return `\\x${hex}`;
  });

  return result;
}

/**
 * Escapes a string for use in a regular expression.
 *
 * @example
 * escapeRegExp('^[test]') // returns '\\^\\[test\\]'
 *
 * @param {string} text - The string to escape
 * @returns {string} The escaped string
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
