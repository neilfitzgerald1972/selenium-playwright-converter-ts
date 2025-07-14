import { ConversionRule } from '../types';

export const cookieConversions: ConversionRule[] = [
  // Add a cookie
  {
    pattern: /(\w+)\.manage\(\)\.addCookie\(([^)]+)\)/g,
    replacement: (match: string, pageVar: string, cookieObj: string): string => {
      return `await ${pageVar}.context().addCookies([${cookieObj}])`;
    },
    description: 'Convert addCookie to Playwright equivalent',
    priority: 5, // Higher priority to run before enhanced cookie rules
    category: 'cookies',
  },

  // Get a cookie by name
  {
    pattern: /(\w+)\.manage\(\)\.getCookie\((['"])([^'"]+)\2\)/g,
    replacement: (match: string, pageVar: string, quote: string, cookieName: string): string => {
      return `await ${pageVar}.context().cookies().then(cookies => cookies.find(c => c.name === '${cookieName}'))`;
    },
    description: 'Convert getCookie to Playwright equivalent',
    priority: 2,
    category: 'cookies',
  },

  // Get all cookies
  {
    pattern: /(\w+)\.manage\(\)\.getCookies\(\s*\)/g,
    replacement: (match: string, pageVar: string): string => {
      return `await ${pageVar}.context().cookies()`;
    },
    description: 'Convert getCookies to Playwright equivalent',
    priority: 2,
    category: 'cookies',
  },

  // Delete a cookie by name
  {
    pattern: /(\w+)\.manage\(\)\.deleteCookie\((['"])([^'"]+)\2\)/g,
    replacement: (match: string, pageVar: string, quote: string, cookieName: string): string => {
      return `await ${pageVar}.context().clearCookies({ name: '${cookieName}' })`;
    },
    description: 'Convert deleteCookie to Playwright equivalent',
    priority: 2,
    category: 'cookies',
  },

  // Delete all cookies
  {
    pattern: /(\w+)\.manage\(\)\.deleteAllCookies\(\s*\)/g,
    replacement: (match: string, pageVar: string): string => {
      return `await ${pageVar}.context().clearCookies()`;
    },
    description: 'Convert deleteAllCookies to Playwright equivalent',
    priority: 2,
    category: 'cookies',
  },
];
