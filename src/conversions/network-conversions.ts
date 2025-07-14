import { ConversionRule } from '../types';

export const networkConversions: ConversionRule[] = [
  // Handle browser.manage().logs().get('performance')
  {
    pattern: /const\s+(\w+)\s*=\s*await\s+driver\.manage\(\)\.logs\(\)\.get\('performance'\)/g,
    replacement: `// Playwright doesn't have direct equivalent for performance logs
// Consider using Playwright's network monitoring instead
const $1 = [];
page.on('response', response => {
  console.log('Response:', response.url(), response.status());
  $1.push(response);
});`,
    description: 'Convert performance logs to Playwright network monitoring',
    priority: 1,
    category: 'network',
  },

  // Handle driver.setNetworkConditions()
  {
    pattern: /driver\.setNetworkConditions\(([^)]+)\)/g,
    replacement: `// Setting network conditions in Playwright
await context.setOffline($1.offline);
await context.setDefaultNavigationTimeout($1.latency || 0);
// Note: Playwright doesn't directly support throughput emulation
// Consider using browser context options for more control`,
    description: 'Convert network conditions to Playwright equivalent',
    priority: 1,
    category: 'network',
  },

  // Handle basic authentication in URL
  {
    pattern: /driver\.get\('(https?:\/\/[^:]+):([^@]+)@([^']+)'\)/g,
    replacement: `// Setting up HTTP credentials in Playwright
const context = await browser.newContext({
  httpCredentials: {
    username: '$1',
    password: '$2'
  }
});
const page = await context.newPage();
await page.goto('https://$3')`,
    description: 'Convert URL-based authentication to Playwright HTTP credentials',
    priority: 1,
    category: 'network',
  },
];
