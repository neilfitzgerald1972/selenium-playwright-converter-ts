import { InvalidInputError } from './errors';

/**
 * Maps Selenium Keys to Playwright keyboard key names
 * Reference: https://playwright.dev/docs/api/class-keyboard#keyboard-press
 */
// Core key mappings from Selenium to Playwright
const keyMappings: Record<string, string> = {
  // Modifier keys
  Shift: 'Shift',
  Control: 'Control',
  Alt: 'Alt',
  Meta: 'Meta',
  Command: 'Meta',
  CommandOrControl: process.platform === 'darwin' ? 'Meta' : 'Control',
  LeftShift: 'ShiftLeft',
  LeftControl: 'ControlLeft',
  LeftAlt: 'AltLeft',
  LeftMeta: 'MetaLeft',
  RightShift: 'ShiftRight',
  RightControl: 'ControlRight',
  RightAlt: 'AltRight',
  RightMeta: 'MetaRight',

  // Navigation keys
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  Home: 'Home',
  End: 'End',
  Insert: 'Insert',
  Delete: 'Delete',
  Backspace: 'Backspace',
  Enter: 'Enter',
  Tab: 'Tab',
  Escape: 'Escape',

  // Function keys
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',

  // Whitespace keys
  Space: ' ',
  Return: 'Enter',

  // Special characters
  Add: 'NumpadAdd',
  Subtract: 'NumpadSubtract',
  Multiply: 'NumpadMultiply',
  Divide: 'NumpadDivide',
  Decimal: 'NumpadDecimal',
  Separator: ',',
  Semicolon: ';',
  Quote: "'",
  Backquote: '`',
  Backslash: '\\\\',
  Slash: '/',
  OpenBracket: '[',
  CloseBracket: ']',
  OpenBrace: '{',
  CloseBrace: '}',
  Pipe: '|',
  Ampersand: '&',
  Asterisk: '*',
  Dollar: '$',
  Hash: '#',
  At: '@',
  Exclamation: '!',
  Colon: ':',
  QuestionMark: '?',
  GreaterThan: '>',
  LessThan: '<',
  Underscore: '_',
  LeftParen: '(',
  RightParen: ')',
  Equal: '=',
  Minus: '-',
  Plus: '+',
  Period: '.',
  Comma: ',',

  // Numpad keys
  Numpad0: 'Numpad0',
  Numpad1: 'Numpad1',
  Numpad2: 'Numpad2',
  Numpad3: 'Numpad3',
  Numpad4: 'Numpad4',
  Numpad5: 'Numpad5',
  Numpad6: 'Numpad6',
  Numpad7: 'Numpad7',
  Numpad8: 'Numpad8',
  Numpad9: 'Numpad9',
  NumpadAdd: 'NumpadAdd',
  NumpadSubtract: 'NumpadSubtract',
  NumpadMultiply: 'NumpadMultiply',
  NumpadDivide: 'NumpadDivide',
  NumpadDecimal: 'NumpadDecimal',
  NumpadEnter: 'NumpadEnter',

  // Legacy keys (for backward compatibility)
  ADD: 'NumpadAdd',
  SUBTRACT: 'NumpadSubtract',
  MULTIPLY: 'NumpadMultiply',
  DIVIDE: 'NumpadDivide',
  DECIMAL: 'NumpadDecimal',
};

/**
 * Converts Selenium Keys to Playwright key names
 */
export function convertKey(seleniumKey: string): string {
  if (!seleniumKey) {
    return '';
  }

  // Handle already converted keys
  if (Object.values(keyMappings).includes(seleniumKey)) {
    return seleniumKey;
  }

  // Remove any leading Keys. if present and clean up the key
  const key = seleniumKey
    .replace(/^Keys\.?/i, '')
    .replace(/^['"]|['"]$/g, '')
    .trim();

  // Handle special cases
  if (key === '') {
    return '';
  }

  // Handle single character keys
  if (key.length === 1) {
    return key;
  }

  // Convert to uppercase for lookup
  const upperKey = key.toUpperCase();

  // Check if it's a known key
  if (keyMappings[upperKey]) {
    return keyMappings[upperKey];
  }

  // Handle common variations
  const variations: Record<string, string> = {
    CTRL: 'Control',
    CMD: 'Meta',
    WINDOWS: 'Meta',
    OPTION: 'Alt',
    RETURN: 'Enter',
    ESCAPE: 'Escape',
    SPACE: ' ',
    BACK_SPACE: 'Backspace',
    BACKSPACE: 'Backspace',
    TAB: 'Tab',
    ENTER: 'Enter',
    SHIFT: 'Shift',
    CONTROL: 'Control',
    ALT: 'Alt',
    PAUSE: 'Pause',
    BREAK: 'Pause',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    END: 'End',
    HOME: 'Home',
    ARROW_LEFT: 'ArrowLeft',
    LEFT: 'ArrowLeft',
    ARROW_UP: 'ArrowUp',
    UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    RIGHT: 'ArrowRight',
    ARROW_DOWN: 'ArrowDown',
    DOWN: 'ArrowDown',
    INSERT: 'Insert',
    DELETE: 'Delete',
    SEMICOLON: ';',
    EQUALS: '=',
    NUMPAD0: 'Numpad0',
    NUMPAD1: 'Numpad1',
    NUMPAD2: 'Numpad2',
    NUMPAD3: 'Numpad3',
    NUMPAD4: 'Numpad4',
    NUMPAD5: 'Numpad5',
    NUMPAD6: 'Numpad6',
    NUMPAD7: 'Numpad7',
    NUMPAD8: 'Numpad8',
    NUMPAD9: 'Numpad9',
    MULTIPLY: 'NumpadMultiply',
    ADD: 'NumpadAdd',
    SEPARATOR: ',',
    SUBTRACT: 'NumpadSubtract',
    DECIMAL: 'NumpadDecimal',
    DIVIDE: 'NumpadDivide',
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
    META: 'Meta',
    COMMAND: 'Meta',
    ZENKAKU_HANKAKU: 'ZenkakuHankaku',
  };

  // Check variations
  if (variations[upperKey]) {
    return variations[upperKey];
  }

  // If no match found, throw an error
  throw new InvalidInputError(seleniumKey, 'valid key name');
}

/**
 * Parses a key chord string (e.g., "Keys.CONTROL + 'a'" or "Control+Shift+A")
 * and returns an array of Playwright key names
 */
export function parseKeyChord(chord: string): string[] {
  if (!chord) return [];

  // Handle already parsed chords
  if (chord.includes('+') && !chord.includes('Keys.')) {
    return chord.split('+').map(k => k.trim().replace(/^['"]|['"]$/g, ''));
  }

  // Handle Keys.chord() syntax
  const chordMatch = chord.match(/Keys\.chord\(([^)]+)\)/i);
  if (chordMatch) {
    const args = chordMatch[1];
    return args
      .split(',')
      .map(arg => {
        // Clean up the argument - remove whitespace and quotes
        let cleanArg = arg.trim().replace(/^['"]|['"]$/g, '');
        // Remove Keys. prefix if present
        cleanArg = cleanArg.replace(/^Keys\./i, '');
        // Handle special case for space
        return cleanArg === 'SPACE' ? ' ' : cleanArg;
      })
      .filter(Boolean);
  }

  // Handle string concatenation with +
  if (chord.includes('+')) {
    return chord
      .split('+')
      .map(part => {
        // Remove any whitespace and quotes
        let trimmed = part.trim().replace(/^['"]|['"]$/g, '');
        // Remove Keys. prefix if present
        trimmed = trimmed.replace(/^Keys\./i, '');
        // Handle special case for space
        return trimmed === 'SPACE' ? ' ' : trimmed;
      })
      .filter(Boolean);
  }

  // Handle single key
  const singleKey = chord.replace(/^Keys\./i, '').replace(/^['"]|['"]$/g, '');
  return singleKey === 'SPACE' ? [' '] : [singleKey];
}

/**
 * Converts a key chord to a Playwright keyboard shortcut string
 * e.g., "Keys.CONTROL + Keys.A" -> "Control+A"
 */
export function convertKeyChord(chord: string): string {
  if (!chord) return '';

  // Handle the case where the chord is already in the correct format
  if (chord.includes('+') && !chord.includes('Keys.')) {
    // Ensure consistent casing for special keys
    return chord
      .split('+')
      .map(part => {
        const trimmed = part.trim();
        const lower = trimmed.toLowerCase();
        if (lower === 'control' || lower === 'ctrl') return 'Control';
        if (lower === 'shift') return 'Shift';
        if (lower === 'alt') return 'Alt';
        if (lower === 'meta' || lower === 'command') return 'Meta';
        // Handle CommandOrControl based on platform
        if (lower === 'commandorcontrol') {
          return process.platform === 'darwin' ? 'Meta' : 'Control';
        }
        return trimmed; // Return as is for non-modifier keys
      })
      .join('+');
  }

  // Parse the chord into individual keys
  const keys = parseKeyChord(chord);

  // Convert each key to its Playwright equivalent
  const convertedKeys = keys.map(key => {
    // Convert the key to title case for modifier keys
    const lowerKey = key.toLowerCase();
    if (['control', 'ctrl'].includes(lowerKey)) return 'Control';
    if (lowerKey === 'shift') return 'Shift';
    if (lowerKey === 'alt') return 'Alt';
    if (['meta', 'command'].includes(lowerKey)) return 'Meta';
    // Handle CommandOrControl based on platform
    if (lowerKey === 'commandorcontrol') {
      return process.platform === 'darwin' ? 'Meta' : 'Control';
    }

    // For single letters, capitalize them (e.g., 'a' -> 'A')
    if (key.length === 1 && /[a-z]/.test(key)) {
      return key.toUpperCase();
    }

    // For other keys, convert them using the standard key mapping
    const converted = convertKey(key);
    if (converted.length === 1) {
      return converted.toUpperCase();
    }
    return converted;
  });

  // Join with '+' and ensure proper casing for special keys
  return convertedKeys.join('+');
}

/**
 * Checks if a key is a modifier key
 */
export function isModifierKey(key: string): boolean {
  const normalizedKey = key.replace(/^Keys\.?/, '');
  return [
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'Command',
    'CommandOrControl',
    'LeftShift',
    'LeftControl',
    'LeftAlt',
    'LeftMeta',
    'RightShift',
    'RightControl',
    'RightAlt',
    'RightMeta',
  ].includes(normalizedKey);
}

/**
 * Gets the key without the 'Keys.' prefix
 */
export function normalizeKey(key: string): string {
  return key.replace(/^Keys\.?/, '');
}
