# Selenium to Playwright TypeScript Migration Specification

## Table of Contents

- [Overview](#overview)
- [Quick Reference](#quick-reference)
  - [Setup and Initialization](#setup-and-initialization)
  - [Navigation](#navigation)
  - [Element Location](#element-location)
  - [Element Actions](#element-actions)
  - [Waits and Synchronization](#waits-and-synchronization)
  - [Browser Management](#browser-management)
  - [Screenshots](#screenshots)
- [Advanced Topics](#advanced-topics)
  - [Network Interception and Mocking](#network-interception-and-mocking)
  - [Frames and iframes](#frames-and-iframes)
  - [Cookies and Storage](#cookies-and-storage)
  - [WebSockets](#websockets)
  - [Authentication Methods](#authentication-methods)
  - [Visual Testing](#visual-testing)
  - [Accessibility Testing](#accessibility-testing)
  - [Performance Metrics](#performance-metrics)
  - [Browser Console Logs](#browser-console-logs)
  - [Geolocation](#geolocation)
  - [Offline Mode](#offline-mode)
  - [File Upload/Download](#file-uploaddownload)
- [Best Practices](#best-practices)
- [Migration Tips](#migration-tips)

## Overview

This specification provides a comprehensive mapping of Selenium WebDriver API calls to their Playwright equivalents in TypeScript. Playwright offers a more modern, faster, and more reliable approach to browser automation with built-in waiting, better error handling, and multi-browser support.

## Quick Reference

### Setup and Initialization

## Setup and Initialization

### Selenium WebDriver 4 (Modern)
```typescript
import { Builder, WebDriver, By, until } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import { Options as FirefoxOptions } from 'selenium-webdriver/firefox';

// Modern Options class (replaces DesiredCapabilities)
const chromeOptions = new ChromeOptions()
  .addArguments('--headless')
  .addArguments('--disable-dev-shm-usage')
  .setUserPreferences({ 'profile.default_content_settings.popups': 0 });

// Selenium Manager handles driver setup automatically
const driver: WebDriver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions)
  .build();
```

### Selenium WebDriver 4 with Chrome DevTools Protocol (CDP)
```typescript
import { Builder, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';

const driver: WebDriver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new ChromeOptions().addArguments('--headless'))
  .build();

// Access Chrome DevTools Protocol
const cdpConnection = await driver.createCDPConnection('page');

// Enable network domain
await driver.executeCdpCommand('Network.enable', {});

// Set user agent via CDP
await driver.executeCdpCommand('Network.setUserAgentOverride', {
  userAgent: 'Custom User Agent'
});
```

### Playwright
```typescript
import { chromium, Browser, BrowserContext, Page } from 'playwright';

const browser: Browser = await chromium.launch({ headless: true });
const context: BrowserContext = await browser.newContext();
const page: Page = await context.newPage();
```

## Navigation

| Selenium | Playwright |
|----------|------------|
| `driver.get(url)` | `page.goto(url)` |
| `driver.navigate().to(url)` | `page.goto(url)` |
| `driver.navigate().back()` | `page.goBack()` |
| `driver.navigate().forward()` | `page.goForward()` |
| `driver.navigate().refresh()` | `page.reload()` |
| `driver.getCurrentUrl()` | `page.url()` |
| `driver.getTitle()` | `page.title()` |

## Element Location

### Selenium
```typescript
// By ID
const element = await driver.findElement(By.id('myId'));

// By CSS Selector
const element = await driver.findElement(By.css('.myClass'));

// By XPath
const element = await driver.findElement(By.xpath('//div[@class="myClass"]'));

// Multiple elements
const elements = await driver.findElements(By.css('.myClass'));

// Selenium 4 Relative Locators
const baseElement = await driver.findElement(By.id('baseElement'));
const elementAbove = await driver.findElement(By.css('.target').above(baseElement));
const elementBelow = await driver.findElement(By.css('.target').below(baseElement));
const elementLeft = await driver.findElement(By.css('.target').leftOf(baseElement));
const elementRight = await driver.findElement(By.css('.target').rightOf(baseElement));
const elementNear = await driver.findElement(By.css('.target').near(baseElement));
```

### Playwright
```typescript
// By ID
const element = page.locator('#myId');

// By CSS Selector
const element = page.locator('.myClass');

// By XPath
const element = page.locator('xpath=//div[@class="myClass"]');

// Text-based selection (Playwright advantage)
const element = page.locator('text=Click me');

// Multiple elements
const elements = page.locator('.myClass');

// Playwright Locator chaining and filtering
const specificElement = page.locator('.myClass').filter({ hasText: 'Specific text' });
const firstElement = page.locator('.myClass').first();
const lastElement = page.locator('.myClass').last();
const nthElement = page.locator('.myClass').nth(2);
```

## Element Actions

### Click Actions
| Selenium | Playwright |
|----------|------------|
| `element.click()` | `element.click()` |
| N/A | `element.dblclick()` |
| N/A | `element.click({ button: 'right' })` |
| N/A | `element.click({ modifiers: ['Shift'] })` |

### Text Input
| Selenium | Playwright |
|----------|------------|
| `element.sendKeys('text')` | `element.fill('text')` |
| `element.clear()` | `element.clear()` |
| `element.sendKeys(Key.ENTER)` | `element.press('Enter')` |
| N/A | `element.type('text', { delay: 100 })` |

### Form Interactions
```typescript
// Selenium
await element.sendKeys('text');
await selectElement.click();
await driver.findElement(By.css('option[value="value"]')).click();

// Playwright
await element.fill('text');
await element.selectOption('value');
await element.check(); // for checkboxes
await element.uncheck();
```

## Waiting and Synchronization

### Explicit Waits - Selenium 4 with Duration
```typescript
// Selenium 4 - Modern Duration-based timeouts (replaces TimeUnit)
import { until } from 'selenium-webdriver';
import { Duration } from 'selenium-webdriver';

// Duration-based waits (Selenium 4+)
await driver.wait(until.elementLocated(By.id('myId')), Duration.ofSeconds(10));
await driver.wait(until.elementIsVisible(element), Duration.ofSeconds(10));
await driver.wait(until.elementIsClickable(element), Duration.ofSeconds(10));

// Legacy timeout (still supported)
await driver.wait(until.elementLocated(By.id('myId')), 10000);

// WebDriverWait with Duration
const wait = new WebDriverWait(driver, Duration.ofSeconds(10));
await wait.until(until.elementLocated(By.id('myId')));

// Custom wait conditions
await driver.wait(async () => {
  const elements = await driver.findElements(By.css('.loading'));
  return elements.length === 0;
}, Duration.ofSeconds(30));

// Playwright (built-in auto-waiting)
await page.locator('#myId').click(); // Automatically waits
await page.waitForSelector('#myId');
await page.waitForSelector('#myId', { state: 'visible' });
await page.waitForSelector('#myId', { state: 'attached' });

// Advanced Playwright waiting
await page.waitForFunction(() => document.querySelectorAll('.item').length > 5);
await page.waitForResponse('**/api/data');
await page.waitForRequest('**/api/submit');
await page.waitForLoadState('networkidle');

// Locator-based waits
await page.locator('#myId').waitFor({ state: 'visible' });
await page.locator('#myId').waitFor({ state: 'hidden' });
await page.locator('#myId').waitFor({ state: 'detached' });
```

### Custom Waits
```typescript
// Selenium
await driver.wait(async () => {
  const text = await element.getText();
  return text.includes('expected');
}, 10000);

// Playwright
await page.waitForFunction(() => {
  const el = document.querySelector('#myId');
  return el?.textContent?.includes('expected');
});

// Or using locator assertions
await expect(page.locator('#myId')).toContainText('expected');
```

## Element Properties and Attributes

| Selenium | Playwright |
|----------|------------|
| `element.getText()` | `element.textContent()` or `element.innerText()` |
| `element.getAttribute('attr')` | `element.getAttribute('attr')` |
| `element.isDisplayed()` | `element.isVisible()` |
| `element.isEnabled()` | `element.isEnabled()` |
| `element.isSelected()` | `element.isChecked()` (for checkboxes) |
| `element.getTagName()` | N/A (use `element.evaluate(el => el.tagName)`) |
| `element.getCssValue('property')` | `element.evaluate(el => getComputedStyle(el).property)` |

## JavaScript Execution

```typescript
// Selenium
await driver.executeScript('return document.title');
await driver.executeScript('arguments[0].click()', element);

// Playwright
await page.evaluate(() => document.title);
await element.evaluate(el => el.click());
```

## Screenshots and PDFs

```typescript
// Selenium
await driver.takeScreenshot();

// Playwright
await page.screenshot({ path: 'screenshot.png' });
await element.screenshot({ path: 'element.png' });
await page.pdf({ path: 'page.pdf' }); // Only in Chromium
```

## Browser Management

### Window/Tab Management
```typescript
// Selenium 4 - Enhanced Window Management
const handles = await driver.getAllWindowHandles();
await driver.switchTo().window(handles[1]);

// Selenium 4 - New Window API
const newWindow = await driver.switchTo().newWindow('tab');
const newWindowHandle = await driver.switchTo().newWindow('window');

// Window positioning and sizing
const windowManager = driver.manage().window();
await windowManager.setRect({ width: 1280, height: 720, x: 0, y: 0 });
const windowRect = await windowManager.getRect();

// Playwright - Multi-page handling
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]')
]);

// Playwright - Page management
const allPages = context.pages();
const newPage2 = await context.newPage();
await newPage2.goto('https://example.com');

// Switch between pages
for (const page of allPages) {
  await page.bringToFront();
}
```

### Browser Context and BiDi Protocol
```typescript
// Selenium 4 - BiDi Protocol Support
const connection = await driver.createBiDiConnection();

// Listen to console logs via BiDi
const logEntry = await connection.logEntry();
logEntry.addListener('log.entryAdded', (entry) => {
  console.log(`Browser log: ${entry.text}`);
});

// Network interception via BiDi
const networkInterceptor = await connection.createNetworkInterceptor();
networkInterceptor.addIntercept({
  urlPattern: '**/api/**',
  method: 'GET'
});

// Selenium (limited context isolation)
await driver.manage().deleteAllCookies();

// Playwright (full context isolation)
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  userAgent: 'custom-agent',
  locale: 'en-US',
  geolocation: { latitude: 59.95, longitude: 30.31667 },
  permissions: ['geolocation']
});
```

## Assertions and Testing

### Selenium (with additional assertion library)
```typescript
import { expect } from 'chai';

const text = await element.getText();
expect(text).to.equal('expected text');

const isVisible = await element.isDisplayed();
expect(isVisible).to.be.true;
```

### Playwright (built-in assertions)
```typescript
import { expect } from '@playwright/test';

await expect(element).toHaveText('expected text');
await expect(element).toBeVisible();
await expect(element).toBeEnabled();
await expect(element).toHaveAttribute('href', '/path');
await expect(page).toHaveTitle('Page Title');
await expect(page).toHaveURL(/.*dashboard.*/);
```

## Network Interception and Mocking

Network interception is a powerful feature for testing web applications by controlling network requests and responses. This section covers how to mock API calls, modify requests/responses, and test various network scenarios in both Selenium and Playwright.

### Basic Request/Response Mocking

#### Selenium (Using NetworkInterceptor)
```typescript
// Selenium 4+ provides NetworkInterceptor for easier network interception
// This is the recommended approach over raw CDP usage

const { Builder } = require('selenium-webdriver');
const { NetworkInterceptor, NetworkInterceptorOptions } = require('selenium-webdriver/devtools/network');
const chrome = require('selenium-webdriver/chrome');

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options())
  .build();

try {
  // Create network interceptor
  const interceptor = new NetworkInterceptor(driver, {
    onRequest: async (request) => {
      // You can inspect or modify outgoing requests here
      console.log('Request:', request.method, request.url);
      return request; // Return the request to continue
    },
    onResponse: async (response) => {
      // Intercept and modify specific API responses
      if (response.url.includes('/api/data')) {
        return {
          ...response,
          status: 200,
          headers: {
            ...response.headers,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ mocked: true, data: 'Mocked response' })
        };
      }
      return response; // Return unmodified response for other requests
    }
  });

  // Navigate to your page - the API call will be intercepted
  await driver.get('https://example.com');
  
  // Remember to clean up
  await interceptor.close();
  
} finally {
  await driver.quit();
}
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';

test('should mock API response', async ({ page }) => {
  // Mock API response before navigation
  await page.route('**/api/data', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ mocked: true, data: 'Mocked response' })
    });
  });
  
  // Navigate to page - the API call will be intercepted
  await page.goto('https://example.com');
  
  // Verify the mocked response was used
  const response = await page.waitForResponse('**/api/data');
  const json = await response.json();
  expect(json).toEqual({ mocked: true, data: 'Mocked response' });
});

## Advanced Network Interception

### Request/Response Manipulation

#### Selenium (Using NetworkInterceptor)
```typescript
const { Builder, By, until } = require('selenium-webdriver');
const { NetworkInterceptor } = require('selenium-webdriver/devtools/network');
const { Capabilities } = require('selenium-webdriver');

/**
 * Advanced network interceptor for Selenium with request/response manipulation
 */
async function setupNetworkInterceptor(driver) {
  // Enable network interception
  const executor = await driver.createCDPConnection('page');
  
  // Create network interceptor
  const interceptor = new NetworkInterceptor(driver, {
    // Match specific URL patterns
    urlPatterns: [
      '**/api/*',
      '**/graphql',
      '**/analytics'
    ],
    // Match all URLs (use with caution)
    // urlPatterns: ['*'],
    // Block sensitive API calls
    if (request.url.includes('/api/sensitive')) {
      return { cancel: true }; // Block the request
    }
    
    // Add custom header to all API requests
    if (request.url.includes('/api/')) {
      return {
        ...request,
        headers: {
          ...request.headers,
          'X-Custom-Header': 'test-value'
        }
      };
    }
    
    return request; // Continue with unmodified request
  },
  
  onResponse: async (response) => {
    // You can modify responses here if needed
    return response;
  }
});

// Don't forget to clean up when done
// await interceptor.close();
```

#### Playwright
```typescript
test('should modify requests and responses', async ({ page }) => {
  // Modify request headers
  await page.route('**/api/*', async route => {
    const headers = {
      ...route.request().headers(),
      'X-Custom-Header': 'test-value'
    };
    
    // Block sensitive API calls
    if (route.request().url().includes('/api/sensitive')) {
      await route.abort('blockedbyclient');
      return;
    }
    
    // Continue with modified headers
    await route.continue({ headers });
  });
  
  // Modify response
  await page.route('**/api/data', async route => {
    const response = await route.fetch();
    const json = await response.json();
    
    // Modify the response
    json.modified = true;
    json.timestamp = Date.now();
    
    // Fulfill with modified response
    await route.fulfill({
      response,
      json
    });
  });
  
  await page.goto('https://example.com');
});
```

### Testing Different HTTP Methods and Status Codes

#### Selenium (Using CDP)
```typescript
// ... (previous setup code)

// Mock different responses based on request method
cdpConnection.on('Network.requestIntercepted', async (event) => {
  const { method, url } = event.request;
  
  if (url.includes('/api/users')) {
    if (method === 'GET') {
      await cdpConnection.send('Network.continueInterceptedRequest', {
        interceptionId: event.interceptionId,
        rawResponse: btoa(JSON.stringify({
          status: 200,
          headers: [
            { name: 'Content-Type', value: 'application/json' }
          ],
          body: JSON.stringify([{ id: 1, name: 'User 1' }])
        }))
      });
    } else if (method === 'POST') {
      await cdpConnection.send('Network.continueInterceptedRequest', {
        interceptionId: event.interceptionId,
        rawResponse: btoa(JSON.stringify({
          status: 201,
          headers: [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'Location', value: '/api/users/123' }
          ],
          body: JSON.stringify({ id: 123, name: 'New User' })
        }))
      });
    }
  }
});
```

#### Playwright
```typescript
test('should handle different HTTP methods', async ({ page }) => {
  // Mock GET request
  await page.route('**/api/users', (route, request) => {
    if (request.method() === 'GET') {
      return route.fulfill({
        status: 200,
        json: [{ id: 1, name: 'User 1' }]
      });
    }
    
    if (request.method() === 'POST') {
      return route.fulfill({
        status: 201,
        headers: { 'Location': '/api/users/123' },
        json: { id: 123, name: 'New User' }
      });
    }
    
    // Continue other requests
    return route.continue();
  });
  
  // Test error responses
  await page.route('**/api/error', route => {
    return route.fulfill({
      status: 500,
      json: { error: 'Internal Server Error' }
    });
  });
  
  await page.goto('https://example.com');
});
```

### Testing Loading States and Timeouts

#### Selenium (Using NetworkInterceptor)
```typescript
// Previous setup code (driver initialization)
const { Builder } = require('selenium-webdriver');
const { NetworkInterceptor } = require('selenium-webdriver/devtools/network');

// ... (driver setup code)

// Simulate slow network conditions
driver.setNetworkConditions({
  offline: false,
  download_throughput: 1024 * 100, // 100 KB/s
  upload_throughput: 1024 * 50,    // 50 KB/s
  latency: 200                    // 200ms
});

// Create interceptor for testing loading states
const interceptor = new NetworkInterceptor(driver, {
  onRequest: async (request) => {
    // Add delay to specific API calls
    if (request.url.includes('/api/slow')) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    return request;
  },
  
  onResponse: async (response) => {
    // You can also simulate slow responses
    if (response.url.includes('/api/slow-response')) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    return response;
  }
});

// Example of testing timeout behavior
try {
  // Set a page load timeout
  await driver.manage().setTimeouts({ pageLoad: 10000 });
  
  // This will throw a TimeoutError if the page takes longer than 10s to load
  await driver.get('https://example.com/slow-page');
} catch (error) {
  if (error.name === 'TimeoutError') {
    console.log('Page load timed out as expected');
  } else {
    throw error;
  }
}

// Don't forget to clean up
// await interceptor.close();
```

#### Playwright
```typescript
test('should test loading states', async ({ page }) => {
  // Simulate slow network
  await page.route('**/api/slow', async route => {
    // Delay response by 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await route.fulfill({
      status: 200,
      json: { status: 'slow-response' }
    });
  });
  
  // Test request timeout
  await page.route('**/api/timeout', route => {
    // Don't respond, let it time out
  });
  
  // Test loading UI
  await page.goto('https://example.com');
  
  // Click button that triggers slow API
  await page.click('button#load-data');
  
  // Verify loading state is shown
  await expect(page.locator('.loading-spinner')).toBeVisible();
  
  // Wait for loading to complete
  await expect(page.locator('.loading-spinner')).not.toBeVisible();
  
  // Verify content is displayed
  await expect(page.locator('.data-content')).toBeVisible();
});
```

### Testing File Uploads and Downloads

#### Selenium (Using CDP)
```typescript
// ... (previous setup code)

// Intercept file upload
await cdpConnection.send('Network.setRequestInterception', {
  patterns: [{ urlPattern: '**/api/upload*', interceptionStage: 'Request' }]
});

cdpConnection.on('Network.requestIntercepted', async (event) => {
  if (event.request.method === 'POST' && event.request.url.includes('/api/upload')) {
    // Get the request body
    const requestBody = await cdpConnection.send('Network.getRequestPostData', {
      requestId: event.requestId
    });
    
    // Verify file content
    expect(requestBody.postData).toContain('filename="test.txt"');
    
    // Mock response
    await cdpConnection.send('Network.continueInterceptedRequest', {
      interceptionId: event.interceptionId,
      rawResponse: btoa(JSON.stringify({
        status: 200,
        headers: [
          { name: 'Content-Type', value: 'application/json' }
        ],
        body: JSON.stringify({ success: true, fileId: '123' })
      }))
    });
  }
});
```

#### Playwright
```typescript
test('should test file upload and download', async ({ page }) => {
  // Mock file upload
  await page.route('**/api/upload', route => {
    // Verify request contains file
    const request = route.request();
    expect(request.method()).toBe('POST');
    
    // Mock successful upload response
    return route.fulfill({
      status: 200,
      json: { success: true, fileId: '123' }
    });
  });
  
  // Mock file download
  await page.route('**/api/download/*', route => {
    return route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="report.pdf"'
      },
      body: Buffer.from('PDF content...')
    });
  });
  
  await page.goto('https://example.com/upload');
  
  // Upload file
  const filePath = path.join(__dirname, 'test-file.txt');
  await page.setInputFiles('input[type="file"]', filePath);
  
  // Verify upload success
  await expect(page.locator('.upload-success')).toBeVisible();
  
  // Test download
  const downloadPromise = page.waitForEvent('download');
  await page.click('text=Download Report');
  const download = await downloadPromise;
  
  // Verify download
  const downloadPath = await download.path();
  expect(fs.existsSync(downloadPath)).toBe(true);
  
  // Clean up
  fs.unlinkSync(downloadPath);
});
```

### Error Handling and Edge Cases in Network Interception

#### Testing Error Responses

##### Selenium (Using NetworkInterceptor)
```typescript
// Previous setup code (driver initialization)
const { Builder } = require('selenium-webdriver');
const { NetworkInterceptor } = require('selenium-webdriver/devtools/network');

// ... (driver setup code)

describe('Network Error Handling', () => {
  let interceptor;
  
  afterEach(async () => {
    // Clean up interceptor after each test
    if (interceptor) {
      await interceptor.close();
    }
  });

  it('should handle 404 Not Found errors', async () => {
    interceptor = new NetworkInterceptor(driver, {
      onRequest: async (request) => {
        if (request.url.includes('/api/nonexistent')) {
          return {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Not Found' })
          };
        }
        return request;
      }
    });

    // Test that your application handles 404 errors gracefully
    await driver.get('https://example.com/page-with-404');
    // Add assertions for error handling
  });

  it('should handle server errors (500)', async () => {
    interceptor = new NetworkInterceptor(driver, {
      onRequest: async (request) => {
        if (request.url.includes('/api/error')) {
          return {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal Server Error' })
          };
        }
        return request;
      }
    });

    // Test server error handling
    await driver.get('https://example.com/page-with-error');
    // Add assertions for error handling
  });
});
```

##### Playwright
```typescript
test.describe('Network Error Handling', () => {
  test('should handle 404 Not Found errors', async ({ page }) => {
    await page.route('**/api/nonexistent', route => {
      return route.fulfill({
        status: 404,
        json: { error: 'Not Found' }
      });
    });

    await page.goto('https://example.com/page-with-404');
    // Add assertions for error handling
  });

  test('should handle server errors (500)', async ({ page }) => {
    await page.route('**/api/error', route => {
      return route.fulfill({
        status: 500,
        json: { error: 'Internal Server Error' }
      });
    });

    await page.goto('https://example.com/page-with-error');
    // Add assertions for error handling
  });
});
```

#### Testing Network Timeouts

##### Selenium (Using NetworkInterceptor)
```typescript
it('should handle request timeouts', async function() {
  // Set a short timeout for this test
  this.timeout(10000);
  
  interceptor = new NetworkInterceptor(driver, {
    onRequest: async (request) => {
      if (request.url.includes('/api/slow')) {
        // Simulate a slow response that will timeout
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
      return request;
    }
  });

  // Set a page load timeout
  await driver.manage().setTimeouts({ pageLoad: 5000 });
  
  // This should timeout
  try {
    await driver.get('https://example.com/slow-page');
    throw new Error('Expected timeout error was not thrown');
  } catch (error) {
    // Verify the correct error was thrown
    expect(error.name).to.equal('TimeoutError');
  }
});
```

##### Playwright
```typescript
test('should handle request timeouts', async ({ page }) => {
  // Set up a route that will never respond
  await page.route('**/api/slow', route => {
    // Don't call route.continue() or route.fulfill() to simulate a timeout
  });

  // Set a timeout for the page load
  page.setDefaultTimeout(5000);
  
  // This should timeout
  await expect(page.goto('https://example.com/slow-page'))
    .rejects.toThrow('Timeout');
});
```

#### Testing Malformed Responses

##### Selenium (Using NetworkInterceptor)
```typescript
it('should handle malformed JSON responses', async () => {
  interceptor = new NetworkInterceptor(driver, {
    onRequest: async (request) => {
      if (request.url.includes('/api/malformed')) {
        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: 'not a valid json' // Malformed JSON
        };
      }
      return request;
    }
  });

  // Test how your application handles malformed JSON
  await driver.get('https://example.com/page-with-malformed-json');
  // Add assertions for error handling
});
```

##### Playwright
```typescript
test('should handle malformed JSON responses', async ({ page }) => {
  await page.route('**/api/malformed', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'not a valid json' // Malformed JSON
    });
  });

  await page.goto('https://example.com/page-with-malformed-json');
  // Add assertions for error handling
});
```

#### Testing CORS and Preflight Requests

##### Selenium (Using NetworkInterceptor)
```typescript
it('should handle CORS preflight requests', async () => {
  interceptor = new NetworkInterceptor(driver, {
    onRequest: async (request) => {
      if (request.method === 'OPTIONS' && 
          request.url.includes('/api/cors-endpoint')) {
        return {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        };
      }
      return request;
    }
  });

  // Test CORS functionality
  await driver.get('https://example.com/page-with-cors');
  // Add assertions for CORS handling
});
```

##### Playwright
```typescript
test('should handle CORS preflight requests', async ({ page }) => {
  // Handle preflight OPTIONS request
  await page.route('**/api/cors-endpoint', async (route, request) => {
    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://example.com/page-with-cors');
  // Add assertions for CORS handling
});
```

### Best Practices for Network Interception

1. **Be Specific with URL Patterns**:
   - Use specific URL patterns to avoid unintended request matching
   - Example: `**/api/v1/users/*` instead of just `**/api/*`

2. **Clean Up After Tests**:
   - Reset request interception after each test
   - Clear any global mocks or stubs

3. **Test Error Cases**:
   - Test 4xx and 5xx responses
   - Test network timeouts and failures
   - Test with malformed responses

4. **Verify Request Details**:
   - Check request headers, method, and body
   - Verify authentication tokens and cookies
   - Validate query parameters

5. **Performance Testing**:
   - Simulate slow networks to test loading states
   - Test with different network conditions (offline, 2G, 3G, etc.)

6. **Security Testing**:
   - Test with malformed input
   - Verify sensitive data is not exposed
   - Test CORS and security headers

7. **Documentation**:
   - Document all API mocks and their expected behavior
   - Include response schemas for complex APIs

8. **Avoid Over-Mocking**:
   - Only mock what's necessary for the test
   - Consider using real API calls for integration tests

9. **Test Edge Cases**:
   - Empty responses
   - Large payloads
   - Special characters in responses
   - Pagination and rate limiting

10. **Maintainability**:
    - Create reusable mock helpers
    - Centralize API response templates
    - Use environment variables to toggle mocks

### Example: Comprehensive API Testing Suite

```typescript
// tests/api.spec.ts
import { test, expect } from '@playwright/test';

// Reusable mock helpers
const mockApiResponses = {
  success: (data = {}) => ({
    status: 200,
    json: { success: true, ...data }
  }),
  
  error: (message = 'An error occurred', status = 400) => ({
    status,
    json: { success: false, error: message }
  }),
  
  notFound: () => ({
    status: 404,
    json: { success: false, error: 'Not Found' }
  })
};

test.describe('API Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Default mocks for all tests
    await page.route('**/api/config', route => 
      route.fulfill(mockApiResponses.success({ version: '1.0.0' }))
    );
  });
  
  test('should handle successful API response', async ({ page }) => {
    // Mock specific endpoint
    await page.route('**/api/users/123', route => 
      route.fulfill(mockApiResponses.success({ id: 123, name: 'Test User' }))
    );
    
    await page.goto('https://example.com/user/123');
    
    // Verify UI shows user data
    await expect(page.locator('.user-name')).toHaveText('Test User');
  });
  
  test('should handle API errors', async ({ page }) => {
    // Mock error response
    await page.route('**/api/users/999', route => 
      route.fulfill(mockApiResponses.notFound())
    );
    
    await page.goto('https://example.com/user/999');
    
    // Verify error message is shown
    await expect(page.locator('.error-message')).toContainText('Not Found');
  });
  
  test('should test loading state', async ({ page }) => {
    // Mock slow response
    await page.route('**/api/slow', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill(mockApiResponses.success({ data: 'delayed' }));
    });
    
    await page.goto('https://example.com/slow-loading');
    
    // Verify loading state
    await expect(page.locator('.loading-spinner')).toBeVisible();
    
    // Wait for loading to complete
    await expect(page.locator('.loading-spinner')).not.toBeVisible();
    await expect(page.locator('.content')).toBeVisible();
  });
  
  test('should test form submission', async ({ page }) => {
    // Mock form submission
    await page.route('**/api/submit', async route => {
      // Verify request payload
      const request = route.request();
      const data = request.postDataJSON();
      
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('email');
      
      // Mock successful submission
      await route.fulfill({
        status: 201,
        headers: { 'Location': '/api/submissions/123' },
        json: { success: true, id: 123 }
      });
    });
    
    await page.goto('https://example.com/contact');
    
    // Fill and submit form
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Verify success message
    await expect(page.locator('.success-message')).toContainText('Thank you!');
  });
  
  test('should test authentication', async ({ page }) => {
    // Mock login endpoint
    await page.route('**/api/login', async route => {
      const data = route.request().postDataJSON();
      
      if (data.username === 'admin' && data.password === 'password') {
        return route.fulfill({
          status: 200,
          json: { 
            success: true, 
            token: 'test-token',
            user: { id: 1, username: 'admin', role: 'admin' }
          }
        });
      }
      
      return route.fulfill({
        status: 401,
        json: { success: false, error: 'Invalid credentials' }
      });
    });
    
    // Test successful login
    await page.goto('https://example.com/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('.user-role')).toContainText('admin');
    
    // Test failed login
    await page.click('button.logout');
    await page.fill('#username', 'wrong');
    await page.fill('#password', 'wrong');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  });
});
```

## Frames and iframes

### Working with Frames

#### Selenium
```typescript
// Modern approach with WebDriverWait
await new WebDriverWait(driver, 10)
  .until(ExpectedConditions.frameToBeAvailableAndSwitchToIt('frame-name'));

// Switch to frame by index (0-based)
await driver.switchTo().frame(0);

// Switch to frame by name or ID
await driver.switchTo().frame('frame-name');

// Switch to frame by WebElement
const frameElement = await driver.findElement(By.css('iframe'));
await driver.switchTo().frame(frameElement);

// Switch back to main content
await driver.switchTo().defaultContent();

// Switch to parent frame
await driver.switchTo().parentFrame();

// Error handling example
try {
  await driver.wait(until.ableToSwitchToFrame('frame-name'), 5000);
  // Frame found, interact with it
  await driver.findElement(By.id('element-in-frame')).click();
} catch (e) {
  console.error('Frame not found within timeout');
  // Handle the error appropriately
}
```

#### Playwright
```typescript
// Recommended approach: frameLocator for better error messages and scoping
const frame = page.frameLocator('iframe[title="Login"]');
await frame.getByRole('textbox', { name: 'Username' }).fill('user');

// Alternative: Get frame by URL pattern
const frameByUrl = page.frame({ url: /.*login\.html/ });
if (frameByUrl) {
  await frameByUrl.click('button');
}

// Access frame by name or ID
const frameByName = page.frame('frame-name');

// Access elements in nested frames (chaining frame locators)
const nestedFrame = page.frameLocator('iframe.outer')
  .frameLocator('.nested-iframe');
await nestedFrame.getByText('Submit').click();

// Wait for frame to be attached and ready
const dynamicFrame = page.frameLocator('iframe.dynamic');
await dynamicFrame.locator('#content').waitFor({ state: 'visible' });
```

### Working with Multiple Frames

#### Selenium
```typescript
// Get all frames on the page
const frames = await driver.findElements(By.tagName('iframe'));

// Switch between frames
await driver.switchTo().frame('frame1');
// Do something in frame1
await driver.switchTo().defaultContent();

await driver.switchTo().frame('frame2');
// Do something in frame2
```

#### Playwright
```typescript
// Get all frames
for (const frame of page.frames()) {
  console.log(frame.url());
}

// Work with multiple frames
const frame1 = page.frameLocator('#frame1');
await frame1.locator('button').click();

const frame2 = page.frameLocator('#frame2');
await frame2.locator('input').fill('value');
```

### Waiting for Frames

#### Selenium
```typescript
// Wait for frame to be available
await driver.wait(
  until.ableToSwitchToFrame('frame-name'),
  10000,
  'Frame not found'
);
```

#### Playwright
```typescript
// Wait for frame to be attached
const frame = page.waitForFrame({
  url: /.*login\.html/
});

// Or wait for frame load
await page.locator('iframe').waitFor();
const frame = page.frameLocator('iframe');
await frame.locator('#content').waitFor();
```

### Frame Content Access

#### Selenium
```typescript
// Get frame content
await driver.switchTo().frame('frame-name');
const text = await driver.findElement(By.css('h1')).getText();
await driver.switchTo().defaultContent();
```

#### Playwright
```typescript
// Get frame content
const frame = page.frameLocator('iframe');
const text = await frame.locator('h1').textContent();

// Or evaluate in frame context
const result = await frame.evaluate(() => {
  return document.querySelector('h1')?.textContent;
});
```

### Best Practices

1. **Always use frame locators** in Playwright instead of switching context
2. **Prefer frame locators** over frame objects for better error messages
3. **Use descriptive selectors** for frames when possible
4. **Handle frame timeouts** appropriately
5. **Avoid deep nesting** of frame switches in Selenium

```typescript
// Good practice in Playwright
const frame = page.frameLocator('iframe[title="Login"]');
await frame.getByRole('textbox', { name: 'Username' }).fill('user');

// Avoid in Selenium (deep nesting)
// await driver.switchTo().frame('outer').switchTo().frame('inner');
```

### Common Pitfalls

1. **Forgot to switch back** to default content in Selenium
2. **Race conditions** when frames load asynchronously
3. **Stale element references** after frame navigation
4. **Incorrect frame selection** when multiple frames match
5. **Missing wait** for frame to be available

```typescript
// Handle frame loading safely in Playwright
await page.locator('iframe').waitFor();
const frame = page.frameLocator('iframe');
await frame.locator('button').click();

// Handle frame loading safely in Selenium
try {
  await driver.wait(until.ableToSwitchToFrame('frame-name'), 10000);
  // Work with frame
} finally {
  await driver.switchTo().defaultContent();
}
```

## Cookies and Storage

### Managing Cookies

#### Selenium
```typescript
// Get all cookies
const cookies = await driver.manage().getCookies();

// Get a specific cookie
const cookie = await driver.manage().getCookie('session_id');

// Add a single cookie
await driver.manage().addCookie({
  name: 'test_cookie',
  value: '12345',
  domain: 'example.com',
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'Lax',
  expiry: Math.floor(Date.now() / 1000) + 86400 // 1 day from now
});

// Set multiple cookies
const cookieArray = [
  { name: 'preferences', value: 'dark_theme', domain: 'example.com' },
  { name: 'tracking', value: 'enabled', domain: 'example.com' }
];
for (const cookie of cookieArray) {
  await driver.manage().addCookie(cookie);
}

// Delete a cookie by name
await driver.manage().deleteCookie('test_cookie');

// Delete all cookies
await driver.manage().deleteAllCookies();

// Verify cookie is set
const isCookiePresent = (await driver.manage().getCookie('test_cookie')) !== null;
```

#### Playwright (2024/2025 Enhanced Features)
```typescript
// Get all cookies
const cookies = await context.cookies();

// Get cookies for a specific URL
const cookies = await context.cookies('https://example.com');

// Enhanced cookie management with partitionKey (2024+)
const partitionedCookies = await context.cookies({
  name: 'session_id',
  partitionKey: 'https://example.com'
});

// Add a single cookie with all options including partitionKey
await context.addCookies([{
  name: 'session',
  value: 'encrypted-token-123',
  domain: 'example.com',
  path: '/',
  expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  httpOnly: true,
  secure: true,
  sameSite: 'Lax',
  partitionKey: 'https://example.com' // 2024+ feature for partitioned cookies
}]);

// Set multiple cookies at once
await context.addCookies([
  {
    name: 'preferences',
    value: JSON.stringify({ theme: 'dark', fontSize: 'large' }),
    domain: 'example.com'
  },
  {
    name: 'analytics',
    value: 'enabled',
    domain: 'example.com',
    sameSite: 'None',
    secure: true
  }
]);

// Delete cookies with filters (2024+ enhancement)
await context.clearCookies({
  name: 'session',
  domain: 'example.com',
  path: '/'
});

// Delete cookies by domain only
await context.clearCookies({ domain: 'example.com' });

// Delete all cookies
await context.clearCookies();

// Clear cookies with partition key filter
await context.clearCookies({
  partitionKey: 'https://example.com'
});

// Verify cookie exists
const hasCookie = (await context.cookies()).some(c => c.name === 'session');
```

### Local Storage and Session Storage

#### Selenium
```typescript
// Local Storage - Get all items
const localStorage = await driver.executeScript('return Object.assign({}, window.localStorage);');

// Local Storage - Set item
await driver.executeScript('window.localStorage.setItem("theme", "dark");');

// Local Storage - Get item
const theme = await driver.executeScript('return window.localStorage.getItem("theme");');

// Local Storage - Remove item
await driver.executeScript('window.localStorage.removeItem("theme");');

// Local Storage - Clear all
await driver.executeScript('window.localStorage.clear();');

// Session Storage - Similar to Local Storage
await driver.executeScript('window.sessionStorage.setItem("sessionKey", "tempValue");');
const sessionValue = await driver.executeScript('return window.sessionStorage.getItem("sessionKey");');

// Helper function for complex operations
async function getLocalStorageSize(driver) {
  return await driver.executeScript('return window.localStorage.length;');
}
```

#### Playwright
```typescript
// Local Storage - Get all items
const localStorage = await page.evaluate(() => {
  const items = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    items[key] = localStorage.getItem(key);
  }
  return items;
});

// Local Storage - Set item
await page.evaluate(() => {
  localStorage.setItem('userSettings', JSON.stringify({
    theme: 'dark',
    notifications: true,
    fontSize: 'medium'
  }));
});

// Local Storage - Get item
const settings = await page.evaluate(() => {
  return JSON.parse(localStorage.getItem('userSettings') || '{}');
});

// Session Storage - Similar to Local Storage
await page.evaluate(() => {
  sessionStorage.setItem('sessionData', JSON.stringify({
    lastActive: new Date().toISOString(),
    tabId: 'tab-123'
  }));
});

// Clear specific storage item
await page.evaluate(() => {
  localStorage.removeItem('obsoleteData');
});

// Using storageState for authentication
const storageStatePath = 'auth-state.json';

// Save state after login
await page.goto('https://example.com/login');
await page.fill('#username', 'testuser');
await page.fill('#password', 'password123');
await page.click('button[type="submit"]');
await page.waitForURL('**/dashboard');
await context.storageState({ path: storageStatePath });

// Reuse state in another test
const newContext = await browser.newContext({
  storageState: storageStatePath
});
const newPage = await newContext.newPage();
await newPage.goto('https://example.com/dashboard');
// Already authenticated
```

### IndexedDB

#### Selenium
```typescript
// Helper function for IndexedDB operations
class IndexedDBHelper {
  static async executeDBOperation(driver, operation) {
    return await driver.executeScript(`
      return (async () => {
        const { dbName, storeName, version = 1, operation: op, data } = arguments[0];
        
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(dbName, version);
          
          request.onerror = (event) => reject('IndexedDB error: ' + event.target.error);
          
          request.onsuccess = (event) => {
            const db = event.target.result;
            
            // Close the database when done
            const closeDB = () => db.close();
            
            try {
              if (op === 'get') {
                const transaction = db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const getRequest = store.get(data.key);
                
                getRequest.onsuccess = () => {
                  resolve(getRequest.result);
                  closeDB();
                };
                getRequest.onerror = (e) => {
                  reject(e.target.error);
                  closeDB();
                };
                
              } else if (op === 'add') {
                const transaction = db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const addRequest = store.add(data.value, data.key);
                
                addRequest.onsuccess = () => {
                  resolve();
                  closeDB();
                };
                addRequest.onerror = (e) => {
                  reject(e.target.error);
                  closeDB();
                };
                
              } else if (op === 'delete') {
                const transaction = db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const deleteRequest = store.delete(data.key);
                
                deleteRequest.onsuccess = () => {
                  resolve();
                  closeDB();
                };
                deleteRequest.onerror = (e) => {
                  reject(e.target.error);
                  closeDB();
                };
              }
              
            } catch (error) {
              closeDB();
              reject(error);
            }
          };
          
          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          };
        });
      })();
    `, operation);
  }
  
  static async get(driver, dbName, storeName, key) {
    return this.executeDBOperation(driver, {
      dbName,
      storeName,
      operation: 'get',
      data: { key }
    });
  }
  
  static async add(driver, dbName, storeName, key, value) {
    return this.executeDBOperation(driver, {
      dbName,
      storeName,
      operation: 'add',
      data: { key, value }
    });
  }
  
  static async delete(driver, dbName, storeName, key) {
    return this.executeDBOperation(driver, {
      dbName,
      storeName,
      operation: 'delete',
      data: { key }
    });
  }
}

// Usage examples
const DB_NAME = 'my-app-db';
const STORE_NAME = 'user-data';

// Add data to IndexedDB
await IndexedDBHelper.add(
  driver,
  DB_NAME,
  STORE_NAME,
  'user-123',
  { name: 'John Doe', preferences: { theme: 'dark' } }
);

// Get data from IndexedDB
const userData = await IndexedDBHelper.get(driver, DB_NAME, STORE_NAME, 'user-123');
console.log('User data:', userData);

// Delete data from IndexedDB
await IndexedDBHelper.delete(driver, DB_NAME, STORE_NAME, 'user-123');
```

#### Playwright
```typescript
// Helper class for IndexedDB operations
class IndexedDBHelper {
  static async executeDBOperation(page, operation) {
    return await page.evaluate(async (op) => {
      const { dbName, storeName, version = 1, operation: opType, data } = op;
      
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        
        request.onerror = (event) => reject('IndexedDB error: ' + event.target.error);
        
        request.onsuccess = (event) => {
          const db = event.target.result;
          
          // Close the database when done
          const closeDB = () => db.close();
          
          try {
            if (opType === 'getAll') {
              const transaction = db.transaction([storeName], 'readonly');
              const store = transaction.objectStore(storeName);
              const getAllRequest = store.getAll();
              
              getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
                closeDB();
              };
              
            } else if (opType === 'get') {
              const transaction = db.transaction([storeName], 'readonly');
              const store = transaction.objectStore(storeName);
              const getRequest = store.get(data.key);
              
              getRequest.onsuccess = () => {
                resolve(getRequest.result);
                closeDB();
              };
              
            } else if (opType === 'add') {
              const transaction = db.transaction([storeName], 'readwrite');
              const store = transaction.objectStore(storeName);
              const addRequest = store.add(data.value, data.key);
              
              addRequest.onsuccess = () => {
                resolve();
                closeDB();
              };
              
            } else if (opType === 'put') {
              const transaction = db.transaction([storeName], 'readwrite');
              const store = transaction.objectStore(storeName);
              const putRequest = store.put(data.value, data.key);
              
              putRequest.onsuccess = () => {
                resolve();
                closeDB();
              };
              
            } else if (opType === 'delete') {
              const transaction = db.transaction([storeName], 'readwrite');
              const store = transaction.objectStore(storeName);
              const deleteRequest = store.delete(data.key);
              
              deleteRequest.onsuccess = () => {
                resolve();
                closeDB();
              };
            }
            
          } catch (error) {
            closeDB();
            reject(error);
          }
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };
      });
    }, operation);
  }
  
  static async getAll(page, dbName, storeName) {
    return this.executeDBOperation(page, {
      dbName,
      storeName,
      operation: 'getAll'
    });
  }
  
  static async get(page, dbName, storeName, key) {
    return this.executeDBOperation(page, {
      dbName,
      storeName,
      operation: 'get',
      data: { key }
    });
  }
  
  static async add(page, dbName, storeName, key, value) {
    return this.executeDBOperation(page, {
      dbName,
      storeName,
      operation: 'add',
      data: { key, value }
    });
  }
  
  static async put(page, dbName, storeName, key, value) {
    return this.executeDBOperation(page, {
      dbName,
      storeName,
      operation: 'put',
      data: { key, value }
    });
  }
  
  static async delete(page, dbName, storeName, key) {
    return this.executeDBOperation(page, {
      dbName,
      storeName,
      operation: 'delete',
      data: { key }
    });
  }
}

// Usage examples
const DB_NAME = 'my-app-db';
const STORE_NAME = 'user-data';

// Add data to IndexedDB
await IndexedDBHelper.add(
  page,
  DB_NAME,
  STORE_NAME,
  'user-123',
  { name: 'John Doe', preferences: { theme: 'dark' } }
);

// Update data in IndexedDB
await IndexedDBHelper.put(
  page,
  DB_NAME,
  STORE_NAME,
  'user-123',
  { name: 'John Doe', preferences: { theme: 'dark', fontSize: 'large' } }
);

// Get data from IndexedDB
const userData = await IndexedDBHelper.get(page, DB_NAME, STORE_NAME, 'user-123');
console.log('User data:', userData);

// Get all data from store
const allData = await IndexedDBHelper.getAll(page, DB_NAME, STORE_NAME);
console.log('All data:', allData);

// Delete data from IndexedDB
await IndexedDBHelper.delete(page, DB_NAME, STORE_NAME, 'user-123');
```

### Best Practices

1. **Isolate Tests**: Always clear storage between tests to prevent test pollution
2. **Use Storage State**: In Playwright, save and restore storage state for authenticated tests
3. **Handle Asynchronous Operations**: Use proper async/await patterns for storage operations
4. **Validate Storage**: Add assertions to verify storage state when needed
5. **Clean Up**: Always clean up test data after tests complete

```typescript
// Example test setup and teardown
beforeEach(async () => {
  // Clear all storage before each test
  await context.clearCookies();
  await context.clearPermissions();
  await context.storageState().then(state => {
    // Clear local and session storage
    state.origins.forEach(origin => {
      origin.localStorage = [];
      origin.sessionStorage = [];
    });
  });
});

afterAll(async () => {
  // Additional cleanup if needed
  await context.close();
});
```

## WebSockets

WebSocket testing is crucial for applications that rely on real-time communication. Modern web applications often use WebSockets for features like live updates, chat, and real-time collaboration. This section covers how to test WebSocket functionality in both Selenium and Playwright, including monitoring connections, testing reconnection logic, and mocking WebSocket servers.

### Key WebSocket Testing Scenarios

1. **Connection Management**: Verify WebSocket connections are established and closed correctly
2. **Message Testing**: Test sending and receiving messages
3. **Reconnection**: Ensure the application handles connection drops and reconnects
4. **Error Handling**: Verify proper error handling for malformed messages or connection issues
5. **Performance**: Monitor message latency and connection stability

### Type Definitions

For better type safety in TypeScript, you can use these type definitions:

```typescript
interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface WebSocketFrame {
  payload: string;
  timestamp: number;
}

interface WebSocketConnection {
  url: string;
  isClosed: () => boolean;
  close: () => Promise<void>;
  send: (data: string) => Promise<void>;
  // Playwright specific
  waitForEvent?: (event: string, options?: { timeout?: number }) => Promise<WebSocketFrame>;
  // Selenium specific (when using custom implementation)
  addEventListener?: (event: string, handler: (data: any) => void) => void;
}
```

### Monitoring WebSocket Connections

#### Selenium
Selenium doesn't have built-in WebSocket support. You'll need to use a proxy or inject JavaScript to monitor WebSocket traffic. Here's a more robust implementation with better error handling:

```typescript
/**
 * WebSocket testing with Selenium using BrowserMob Proxy
 * Note: This requires BrowserMob Proxy to be running
 */
import { Builder, WebDriver } from 'selenium-webdriver';
import * as proxy from 'browsermob-proxy-client';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

class WebSocketTester {
  private driver: WebDriver;
  private proxyClient: any;
  private harFile: string = `./ws-har-${Date.now()}.har`;

  constructor(private proxyHost: string = 'localhost', 
              private proxyPort: number = 8080) {}

  async setup() {
    try {
      // Initialize proxy client
      this.proxyClient = proxy.client(this.proxyHost, this.proxyPort);
      await this.proxyClient.createHar();
      
      // Configure proxy settings for WebDriver
      const proxyConfig = {
        proxyType: 'manual',
        httpProxy: `${this.proxyHost}:${this.proxyPort}`,
        sslProxy: `${this.proxyHost}:${this.proxyPort}`,
        noProxy: 'localhost,127.0.0.1' // Exclude localhost from proxying
      };

      // Initialize WebDriver with proxy
      this.driver = await new Builder()
        .forBrowser('chrome')
        .setProxy(proxyConfig)
        .build();

      return this.driver;
    } catch (error) {
      console.error('Failed to setup WebSocket tester:', error);
      await this.cleanup();
      throw error;
    }
  }

  async captureWebSocketTraffic() {
    if (!this.proxyClient) {
      throw new Error('Proxy client not initialized. Call setup() first.');
    }
    
    try {
      // Get HAR data
      const har = await this.proxyClient.getHar();
      
      // Save HAR to file for debugging
      await streamPipeline(
        JSON.stringify(har, null, 2),
        createWriteStream(this.harFile)
      );
      
      // Filter WebSocket entries
      return har.log.entries.filter(entry => 
        entry._webSocketMessages?.length > 0 ||
        entry.request.url.startsWith('ws://') ||
        entry.request.url.startsWith('wss://')
      );
    } catch (error) {
      console.error('Failed to capture WebSocket traffic:', error);
      throw error;
    }
  }

  async assertWebSocketMessage(expectedType: string, timeout: number = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const wsEntries = await this.captureWebSocketTraffic();
      
      const hasMessage = wsEntries.some(entry => 
        entry._webSocketMessages?.some(msg => {
          try {
            const data = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
            return data?.type === expectedType;
          } catch (e) {
            return false;
          }
        })
      );
      
      if (hasMessage) return true;
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error(`Timed out waiting for WebSocket message: ${expectedType}`);
  }

  async cleanup() {
    const cleanupTasks = [];
    
    if (this.driver) {
      cleanupTasks.push(this.driver.quit().catch(console.error));
    }
    
    if (this.proxyClient) {
      cleanupTasks.push(
        this.proxyClient.closeProxies()
          .then(() => this.proxyClient.close())
          .catch(console.error)
      );
    }
    
    await Promise.all(cleanupTasks);
  }
}

// Usage Example
async function testWebSocket() {
  const wsTester = new WebSocketTester();
  
  try {
    const driver = await wsTester.setup();
    
    // Navigate to your app
    await driver.get('https://your-app.com');
    
    // Trigger WebSocket connection
    await driver.findElement({ id: 'connect-button' }).click();
    
    // Wait for specific WebSocket message
    await wsTester.assertWebSocketMessage('connection_established');
    
    // Test sending a message
    await driver.executeScript(`
      window.ws.send(JSON.stringify({ type: 'get_updates' }));
    `);
    
    // Wait for response
    await wsTester.assertWebSocketMessage('update_received');
    
  } finally {
    await wsTester.cleanup();
  }
}
```

#### Playwright
Playwright has excellent built-in WebSocket support, making it much easier to test real-time applications. Here's a comprehensive example with TypeScript types and error handling:

```typescript
import { test, expect, Page, Browser, chromium, WebSocket } from '@playwright/test';

class WebSocketHelper {
  private wsConnection: WebSocket | null = null;
  private messages: Array<{type: string; data: any}> = [];
  private messageHandlers: Map<string, Array<(data: any) => void>> = new Map();

  constructor(private page: Page) {
    // Set up message handling
    this.page.on('websocket', ws => {
      console.log(`WebSocket opened: ${ws.url()}`);
      
      this.wsConnection = ws;
      
      ws.on('framereceived', (frameData) => {
        try {
          const message = JSON.parse(frameData.payload.toString());
          this.messages.push(message);
          
          // Notify specific handlers
          const handlers = this.messageHandlers.get(message.type) || [];
          handlers.forEach(handler => handler(message));
          
          // Notify global handlers
          const globalHandlers = this.messageHandlers.get('*') || [];
          globalHandlers.forEach(handler => handler(message));
          
          // Store last message for easy access in page context
          this.page.evaluate(`
            window.lastWsMessage = ${JSON.stringify(message)};
          `).catch(console.error);
          
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket closed');
        this.wsConnection = null;
      });
      
      ws.on('socketerror', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  /**
   * Wait for a WebSocket connection to be established
   * @param urlPattern Optional URL pattern to match
   * @param timeout Timeout in milliseconds
   */
  async waitForConnection(urlPattern?: string | RegExp, timeout = 10000): Promise<WebSocket> {
    if (this.wsConnection) return this.wsConnection;
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timed out waiting for WebSocket connection${urlPattern ? ` matching ${urlPattern}` : ''}`));
      }, timeout);
      
      const handler = (ws: WebSocket) => {
        if (!urlPattern || 
            (typeof urlPattern === 'string' && ws.url().includes(urlPattern)) ||
            (urlPattern instanceof RegExp && urlPattern.test(ws.url()))) {
          clearTimeout(timeoutId);
          this.page.off('websocket', handler);
          resolve(ws);
        }
      };
      
      this.page.on('websocket', handler);
    });
  }

  /**
   * Send a message through the WebSocket connection
   */
  async send(message: any): Promise<void> {
    if (!this.wsConnection) {
      throw new Error('No active WebSocket connection');
    }
    
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    await this.wsConnection.send(messageStr);
  }

  /**
   * Wait for a specific message type
   */
  async waitForMessage(messageType: string, timeout = 10000): Promise<any> {
    // Check if message already received
    const existingMessage = this.messages.find(m => m.type === messageType);
    if (existingMessage) return existingMessage;
    
    // Wait for new message
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Timed out waiting for message: ${messageType}`));
      }, timeout);
      
      const handler = (message: any) => {
        if (message.type === messageType) {
          clearTimeout(timeoutId);
          this.off(messageType, handler);
          resolve(message);
        }
      };
      
      this.on(messageType, handler);
    });
  }

  /**
   * Add a message handler
   */
  on(messageType: string, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  /**
   * Remove a message handler
   */
  off(messageType: string, handler: (data: any) => void): void {
    const handlers = this.messageHandlers.get(messageType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Get all received messages (optionally filtered by type)
   */
  getMessages(type?: string): Array<any> {
    return type 
      ? this.messages.filter(m => m.type === type)
      : [...this.messages];
  }
}

// Test Example
const TEST_WS_URL = 'ws://your-websocket-endpoint';

test('should handle WebSocket communication', async ({ page }) => {
  const wsHelper = new WebSocketHelper(page);
  
  // Navigate to the page that will open WebSocket connection
  await page.goto('https://your-app.com');
  
  // Wait for WebSocket connection
  const ws = await wsHelper.waitForConnection(TEST_WS_URL);
  expect(ws).toBeTruthy();
  
  // Test sending a message
  await wsHelper.send({ type: 'subscribe', channel: 'updates' });
  
  // Wait for subscription confirmation
  const subAck = await wsHelper.waitForMessage('subscription_confirmed');
  expect(subAck.status).toBe('subscribed');
  
  // Test receiving updates
  await page.click('#refresh-data');
  const update = await wsHelper.waitForMessage('data_updated');
  
  expect(update).toHaveProperty('timestamp');
  expect(update.data).toBeDefined();
  
  // Test error handling
  await wsHelper.send({ type: 'invalid_command' });
  const error = await wsHelper.waitForMessage('error');
  expect(error).toHaveProperty('message');
  
  // Verify all messages were received
  const allMessages = wsHelper.getMessages();
  expect(allMessages.length).toBeGreaterThanOrEqual(3);
});
```

### Testing WebSocket Reconnection

Robust WebSocket reconnection logic is critical for real-time applications. Here's how to test it in both frameworks:

#### Selenium with WebDriver BiDi (Modern Approach)
```typescript
/**
 * Tests WebSocket reconnection with exponential backoff
 */
async function testWebSocketReconnection(driver: WebDriver) {
  // Enable WebSocket logging and reconnection logic
  await driver.executeScript(`
    // Store WebSocket instance and reconnection state
    window.ws = null;
    window.reconnectAttempts = 0;
    window.reconnectEvents = [];
    window.maxReconnectAttempts = 5;
    window.reconnectDelay = 1000; // Initial delay in ms
    
    function connectWebSocket() {
      const ws = new WebSocket('wss://your-websocket-endpoint');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        window.reconnectEvents.push({ 
          type: 'connected', 
          timestamp: Date.now(),
          attempt: window.reconnectAttempts
        });
        
        // Reset reconnect attempts on successful connection
        window.reconnectAttempts = 0;
      };
      
      ws.onclose = (event) => {
        const eventData = { 
          type: 'disconnected', 
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: Date.now(),
          attempt: window.reconnectAttempts
        };
        
        console.log('WebSocket closed:', eventData);
        window.reconnectEvents.push(eventData);
        
        if (window.reconnectAttempts < window.maxReconnectAttempts) {
          // Exponential backoff: 1s, 2s, 4s, 8s, 16s
          const delay = Math.min(
            window.reconnectDelay * Math.pow(2, window.reconnectAttempts),
            30000 // Max 30s delay
          );
          
          window.reconnectAttempts++;
          console.log(`Reconnecting in ${delay}ms (attempt ${window.reconnectAttempts})`);
          
          setTimeout(() => {
            if (window.ws?.readyState !== WebSocket.OPEN) {
              window.ws = connectWebSocket();
            }
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        window.reconnectEvents.push({
          type: 'error',
          error: error.message || 'Unknown WebSocket error',
          timestamp: Date.now(),
          attempt: window.reconnectAttempts
        });
      };
      
      return ws;
    }
    
    // Initial connection
    window.ws = connectWebSocket();
  `);
  
  // Helper function to get reconnection events
  const getReconnectEvents = async () => {
    return await driver.executeScript<Array<{
      type: string;
      timestamp: number;
      attempt: number;
      code?: number;
      reason?: string;
      wasClean?: boolean;
    }>>('return window.reconnectEvents');
  };
  
  // Test 1: Verify initial connection
  await driver.wait(
    async () => {
      const events = await getReconnectEvents();
      return events.some(e => e.type === 'connected' && e.attempt === 0);
    },
    10000,
    'Initial WebSocket connection failed'
  );
  
  // Test 2: Simulate network failure and verify reconnection
  await driver.executeScript('window.ws.close(1000, "Test closure")');
  
  // Wait for reconnection
  await driver.wait(
    async () => {
      const events = await getReconnectEvents();
      const reconnects = events.filter(e => e.type === 'connected' && e.attempt > 0);
      return reconnects.length > 0;
    },
    30000, // Allow time for exponential backoff
    'WebSocket did not reconnect after closure'
  );
  
  // Test 3: Verify reconnection events
  const events = await getReconnectEvents();
  const connectionEvents = events.filter(e => e.type === 'connected');
  const disconnectEvents = events.filter(e => e.type === 'disconnected');
  
  expect(connectionEvents.length).toBeGreaterThanOrEqual(2);
  expect(disconnectEvents.length).toBeGreaterThanOrEqual(1);
  
  // Verify backoff timing (within reasonable bounds)
  const reconnects = events.filter(e => e.type === 'connected' && e.attempt > 0);
  for (let i = 1; i < reconnects.length; i++) {
    const prev = reconnects[i - 1];
    const curr = reconnects[i];
    const timeBetween = curr.timestamp - prev.timestamp;
    
    // Verify delay increased (with some tolerance)
    const expectedDelay = Math.min(1000 * Math.pow(2, i - 1), 30000);
    expect(timeBetween).toBeGreaterThanOrEqual(expectedDelay * 0.8); // 20% tolerance
    expect(timeBetween).toBeLessThan(expectedDelay * 1.5);
  }
  
  // Cleanup
  await driver.executeScript('if (window.ws) window.ws.close(1000, "Test complete")');
}
```

#### Playwright with Network Conditions
```typescript
import { test, expect } from '@playwright/test';

/**
 * Tests WebSocket reconnection with network conditions
 */
test('should handle WebSocket reconnection', async ({ page, browser }) => {
  // Track reconnection events
  const reconnectionEvents: Array<{
    type: 'connected' | 'disconnected' | 'error';
    timestamp: number;
    url?: string;
    error?: string;
  }> = [];
  
  // Listen for WebSocket events
  page.on('websocket', ws => {
    const url = ws.url();
    console.log(`WebSocket event: ${url}`);
    
    ws.on('close', () => {
      reconnectionEvents.push({
        type: 'disconnected',
        timestamp: Date.now(),
        url
      });
    });
    
    ws.on('framesent', frame => {
      if (frame.payload.includes('ping')) {
        reconnectionEvents.push({
          type: 'connected',
          timestamp: Date.now(),
          url
        });
      }
    });
    
    ws.on('socketerror', error => {
      reconnectionEvents.push({
        type: 'error',
        timestamp: Date.now(),
        url,
        error: error.message
      });
    });
  });
  
  // Navigate to the test page
  await page.goto('https://your-app.com/websocket-test');
  
  // Wait for initial connection
  const wsPromise = page.waitForEvent('websocket');
  await page.click('#connect-button');
  const ws = await wsPromise;
  
  // Test 1: Verify initial connection
  await expect.poll(() => 
    reconnectionEvents.some(e => e.type === 'connected')
  ).toBeTruthy();
  
  // Test 2: Simulate network offline
  const context = browser.contexts()[0];
  await context.setOffline(true);
  
  // Wait for disconnection
  await expect.poll(() => 
    reconnectionEvents.some(e => e.type === 'disconnected')
  ).toBeTruthy();
  
  // Test 3: Simulate network restore
  await context.setOffline(false);
  
  // Wait for reconnection
  await expect(async () => {
    const reconnects = reconnectionEvents
      .filter(e => e.type === 'connected')
      .length;
    expect(reconnects).toBeGreaterThanOrEqual(2);
  }).toPass({ timeout: 30000 });
  
  // Test 4: Verify reconnection backoff
  const connections = reconnectionEvents
    .filter(e => e.type === 'connected')
    .map(e => e.timestamp);
  
  // Calculate time between reconnections
  const reconnectionDelays = [];
  for (let i = 1; i < connections.length; i++) {
    reconnectionDelays.push(connections[i] - connections[i - 1]);
  }
  
  // Verify increasing delays (with tolerance)
  for (let i = 1; i < reconnectionDelays.length; i++) {
    expect(reconnectionDelays[i]).toBeGreaterThan(reconnectionDelays[i - 1] * 0.8);
  }
  
  // Test 5: Verify error handling
  const errors = reconnectionEvents.filter(e => e.type === 'error');
  if (errors.length > 0) {
    console.log('WebSocket errors during test:', errors);
  }
  
  // Test 6: Clean shutdown
  await page.evaluate(() => {
    if (window.ws) {
      window.ws.close(1000, 'Test complete');
    }
  });
  
  // Verify clean closure
  await expect.poll(() => 
    reconnectionEvents.some(e => 
      e.type === 'disconnected' && 
      reconnectionEvents.indexOf(e) > reconnectionEvents.length - 3
    )
  ).toBeTruthy();
});
```

### Error Handling and Edge Cases

When testing WebSocket reconnections, consider these scenarios:

1. **Network Flakiness**:
   - Intermittent packet loss
   - High latency
   - DNS resolution failures

2. **Server-Side Issues**:
   - Server restart during connection
   - Invalid WebSocket subprotocols
   - Authentication timeouts

3. **Client-Side Issues**:
   - Tab backgrounding
   - Device sleep/wake cycles
   - App state changes during disconnection

4. **Edge Cases**:
   - Maximum frame size exceeded
   - Malformed messages
   - Protocol violations
   - Simultaneous reconnection attempts

### Best Practices for WebSocket Testing

1. **Use Real Network Conditions**:
   ```typescript
   // Playwright example
   const context = await browser.newContext({
     offline: false,
     // Simulate 3G network
     ...devices['iPhone 12'],
     geolocation: { longitude: 12.492507, latitude: 41.889938 },
     permissions: ['geolocation']
   });
   ```

2. **Implement Circuit Breaker Pattern**:
   ```typescript
   // In your application code
   class WebSocketService {
     private reconnectAttempts = 0;
     private maxReconnectAttempts = 5;
     private isConnected = false;
     private ws: WebSocket | null = null;
     
     async connect() {
       if (this.isConnected || this.reconnectAttempts >= this.maxReconnectAttempts) {
         return;
       }
       
       try {
         this.ws = new WebSocket('wss://your-endpoint');
         
         this.ws.onopen = () => {
           this.isConnected = true;
           this.reconnectAttempts = 0;
           // Handle connection established
         };
         
         this.ws.onclose = () => {
           this.isConnected = false;
           this.reconnectAttempts++;
           
           if (this.reconnectAttempts < this.maxReconnectAttempts) {
             const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
             setTimeout(() => this.connect(), delay);
           } else {
             // Circuit is open, require user action
             this.showReconnectUI();
           }
         };
         
       } catch (error) {
         console.error('WebSocket connection failed:', error);
         this.handleConnectionError(error);
       }
     }
   }
   ```

3. **Monitor Connection Quality**:
   ```typescript
   // Track message round-trip time
   const pingTimes: number[] = [];
   
   function sendPing() {
     const start = Date.now();
     ws.send(JSON.stringify({ type: 'ping', id: Date.now() }));
     
     // Handle pong
     const onPong = (data: any) => {
       if (data.type === 'pong' && data.id === start) {
         const rtt = Date.now() - start;
         pingTimes.push(rtt);
         
         // Keep last 10 samples
         if (pingTimes.length > 10) pingTimes.shift();
         
         // Calculate average RTT
         const avgRtt = pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length;
         console.log(`Average RTT: ${avgRtt.toFixed(2)}ms`);
         
         // Schedule next ping
         setTimeout(sendPing, Math.max(1000, avgRtt * 2));
       }
     };
     
     ws.on('message', onPong);
   }
   ```

4. **Test Across Browsers**:
   - Chrome/Chromium: Good WebSocket support
   - Firefox: Slightly different WebSocket implementation
   - Safari: Known issues with WebSocket buffering
   - Mobile Browsers: Varied behavior with background tabs

5. **Load Testing**:
   - Test with multiple concurrent connections
   - Monitor memory usage during long-running connections
   - Verify message ordering guarantees

## Advanced WebSocket Server Mocking

### Mocking WebSocket Server in Selenium

For comprehensive WebSocket testing in Selenium, we'll create a robust mock server with request/response handling, authentication, and message validation.

```typescript
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';

/**
 * A mock WebSocket server for testing WebSocket clients
 */
class MockWebSocketServer extends EventEmitter {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private messageHistory: Array<{clientId: string, message: any, timestamp: number}> = [];
  private port: number;
  private messageHandlers: Map<string, (ws: WebSocket, data: any, clientId: string) => void> = new Map();

  constructor(port: number = 8080) {
    super();
    this.port = port;
    this.setupDefaultHandlers();
  }

  private setupDefaultHandlers() {
    // Handle ping/pong for connection health checks
    this.onMessage('ping', (ws) => {
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
    });

    // Handle authentication
    this.onMessage('auth', (ws, data) => {
      if (data.token === 'valid-token') {
        ws.send(JSON.stringify({
          type: 'auth_success',
          userId: 'user-123',
          sessionId: `sess-${uuidv4()}`,
          timestamp: Date.now()
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'auth_error',
          error: 'Invalid token',
          code: 'AUTH_ERROR',
          timestamp: Date.now()
        }));
      }
    });
  }

  /**
   * Register a handler for a specific message type
   */
  onMessage(type: string, handler: (ws: WebSocket, data: any, clientId: string) => void) {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Start the mock server
   */
  start(): Promise<void> {
    return new Promise((resolve) => {
      this.wss = new WebSocketServer({ port: this.port }, () => {
        console.log(`Mock WebSocket server running on ws://localhost:${this.port}`);
        resolve();
      });

      this.wss.on('connection', (ws: WebSocket) => {
        const clientId = uuidv4();
        this.clients.set(clientId, ws);
        this.emit('client_connected', { clientId });

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connected',
          clientId,
          timestamp: Date.now()
        }));

        ws.on('message', (data: string) => {
          try {
            const message = JSON.parse(data);
            const timestamp = Date.now();
            
            // Add to message history
            this.messageHistory.push({
              clientId,
              message,
              timestamp
            });

            this.emit('message', { clientId, message, timestamp });
            
            // Find and execute handler for this message type
            const handler = this.messageHandlers.get(message.type);
            if (handler) {
              handler(ws, message, clientId);
            } else {
              // Default echo behavior
              ws.send(JSON.stringify({
                type: 'echo',
                original: message,
                timestamp
              }));
            }
          } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
              type: 'error',
              error: 'Invalid message format',
              code: 'INVALID_MESSAGE',
              timestamp: Date.now()
            }));
          }
        });

        ws.on('close', () => {
          this.clients.delete(clientId);
          this.emit('client_disconnected', { clientId });
        });
      });
    });
  }

  /**
   * Send a message to all connected clients
   */
  broadcast(message: any) {
    const data = typeof message === 'string' ? message : JSON.stringify(message);
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  /**
   * Send a message to a specific client
   */
  sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  /**
   * Get all messages of a specific type
   */
  getMessagesByType(type: string) {
    return this.messageHistory.filter(entry => entry.message.type === type);
  }

  /**
   * Stop the server
   */
  async stop() {
    // Close all client connections
    for (const [clientId, client] of this.clients.entries()) {
      if (client.readyState === WebSocket.OPEN) {
        client.close(1000, 'Server shutdown');
      }
    }
    
    // Close the server
    return new Promise<void>((resolve, reject) => {
      this.wss.close(error => {
        if (error) {
          reject(error);
        } else {
          this.emit('closed');
          resolve();
        }
      });
    });
  }
}

// Example usage in tests
describe('WebSocket Client Tests', () => {
  let mockServer: MockWebSocketServer;
  let driver: WebDriver;

  beforeAll(async () => {
    // Start mock WebSocket server
    mockServer = new MockWebSocketServer(8080);
    await mockServer.start();
    
    // Set up Selenium WebDriver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build();
  });

  afterAll(async () => {
    // Clean up
    await driver.quit();
    await mockServer.stop();
  });

  test('should connect to WebSocket and authenticate', async () => {
    // Set up test-specific message handler
    let authRequest: any = null;
    mockServer.onMessage('auth', (ws, data, clientId) => {
      authRequest = { data, clientId };
      ws.send(JSON.stringify({
        type: 'auth_success',
        userId: 'test-user',
        sessionId: 'test-session',
        timestamp: Date.now()
      }));
    });

    // Load test page and initialize WebSocket
    await driver.get('http://localhost:3000/ws-test');
    await driver.executeScript(`
      window.ws = new WebSocket('ws://localhost:8080');
      
      // Store received messages
      window.receivedMessages = [];
      
      window.ws.onmessage = (event) => {
        window.receivedMessages.push(JSON.parse(event.data));
      };
      
      // Wait for connection to open
      return new Promise((resolve) => {
        window.ws.onopen = () => {
          // Send authentication
          window.ws.send(JSON.stringify({
            type: 'auth',
            token: 'test-token',
            userId: 'test-user'
          }));
          resolve(true);
        };
      });
    `);

    // Wait for authentication to complete
    await driver.wait(
      async () => {
        const messages = await driver.executeScript('return window.receivedMessages');
        return messages.some((m: any) => m.type === 'auth_success');
      },
      5000,
      'Authentication did not complete in time'
    );

    // Verify the auth request was received correctly
    expect(authRequest).toBeTruthy();
    expect(authRequest.data).toMatchObject({
      type: 'auth',
      token: 'test-token',
      userId: 'test-user'
    });
  });

  test('should handle server-initiated messages', async () => {
    // Send a message from the server
    const testMessage = {
      type: 'server_notification',
      message: 'Scheduled maintenance',
      severity: 'warning',
      timestamp: Date.now()
    };
    
    mockServer.broadcast(testMessage);
    
    // Verify the client received the message
    const received = await driver.wait(
      async () => {
        const messages = await driver.executeScript('return window.receivedMessages');
        return messages.find((m: any) => 
          m.type === 'server_notification' && 
          m.message === testMessage.message
        );
      },
      5000,
      'Did not receive server notification'
    );
    
    expect(received).toMatchObject({
      type: 'server_notification',
      message: 'Scheduled maintenance',
      severity: 'warning'
    });
  });
});
```

### Advanced WebSocket Testing with Playwright

Playwright provides powerful built-in capabilities for WebSocket testing, including request/response mocking and network conditions.

```typescript
import { test, expect, Page } from '@playwright/test';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

/**
 * A WebSocket test context that can be used across tests
 */
class WebSocketTestContext {
  private wss: WebSocketServer;
  private port: number;
  private messages: Array<{type: string, data: any}> = [];
  private connections: Map<string, WebSocket> = new Map();
  private messageHandlers: Map<string, (data: any, ws: WebSocket) => void> = new Map();
  
  constructor(port: number = 8080) {
    this.port = port;
    this.setupDefaultHandlers();
  }
  
  private setupDefaultHandlers() {
    this.onMessage('ping', (_, ws) => {
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
    });
  }
  
  onMessage(type: string, handler: (data: any, ws: WebSocket) => void) {
    this.messageHandlers.set(type, handler);
  }
  
  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.wss = new WebSocketServer({ port: this.port }, () => {
        console.log(`Test WebSocket server running on ws://localhost:${this.port}`);
        resolve();
      });
      
      this.wss.on('connection', (ws) => {
        const clientId = uuidv4();
        this.connections.set(clientId, ws);
        
        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connected',
          clientId,
          timestamp: Date.now()
        }));
        
        ws.on('message', (data: string) => {
          try {
            const message = JSON.parse(data);
            this.messages.push(message);
            
            // Execute handler if registered
            const handler = this.messageHandlers.get(message.type);
            if (handler) {
              handler(message, ws);
            }
          } catch (error) {
            console.error('Error processing message:', error);
          }
        });
        
        ws.on('close', () => {
          this.connections.delete(clientId);
        });
      });
    });
  }
  
  async stop(): Promise<void> {
    // Close all client connections
    for (const ws of this.connections.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Test complete');
      }
    }
    
    // Close the server
    return new Promise((resolve, reject) => {
      this.wss.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
  
  getMessagesByType(type: string) {
    return this.messages.filter(m => m.type === type);
  }
  
  sendToAll(message: any) {
    const data = typeof message === 'string' ? message : JSON.stringify(message);
    for (const ws of this.connections.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    }
  }
}

// Use the test context in Playwright tests
test.describe('WebSocket Tests', () => {
  let wsContext: WebSocketTestContext;
  
  test.beforeAll(async () => {
    wsContext = new WebSocketTestContext(8080);
    await wsContext.start();
    
    // Set up test-specific message handlers
    wsContext.onMessage('auth', (data, ws) => {
      if (data.token === 'valid-token') {
        ws.send(JSON.stringify({
          type: 'auth_success',
          userId: data.userId,
          sessionId: `sess-${uuidv4()}`,
          timestamp: Date.now()
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'auth_error',
          error: 'Invalid token',
          code: 'AUTH_ERROR'
        }));
      }
    });
  });
  
  test.afterAll(async () => {
    await wsContext.stop();
  });
  
  test('should connect to WebSocket and authenticate', async ({ page }) => {
    // Track WebSocket messages in the page
    const messages: any[] = [];
    page.on('websocket', ws => {
      ws.on('framesent', frame => {
        try {
          messages.push(JSON.parse(frame.payload.toString()));
        } catch (e) {
          // Ignore non-JSON messages
        }
      });
    });
    
    // Navigate to the test page
    await page.goto('http://localhost:3000/ws-test');
    
    // Wait for WebSocket connection
    const wsPromise = page.waitForEvent('websocket');
    await page.click('#connect-button');
    const ws = await wsPromise;
    
    // Wait for authentication message
    await expect.poll(() => 
      messages.some(m => m.type === 'auth')
    ).toBeTruthy();
    
    // Verify authentication was successful
    const authMessage = messages.find(m => m.type === 'auth');
    expect(authMessage).toMatchObject({
      type: 'auth',
      token: 'valid-token',
      userId: 'test-user'
    });
    
    // Send a server-initiated message
    wsContext.sendToAll({
      type: 'server_notification',
      message: 'Server is restarting soon',
      severity: 'warning',
      timestamp: Date.now()
    });
    
    // Verify the client handles the server message
    const notificationHandled = await page.evaluate(() => {
      return new Promise((resolve) => {
        const checkNotification = () => {
          const notification = document.querySelector('.notification');
          if (notification && notification.textContent.includes('Server is restarting soon')) {
            resolve(true);
          } else {
            setTimeout(checkNotification, 100);
          }
        };
        checkNotification();
      });
    });
    
    expect(notificationHandled).toBeTruthy();
  });
  
  test('should handle connection drops', async ({ page, browser }) => {
    // Navigate to the test page and connect
    await page.goto('http://localhost:3000/ws-test');
    await page.click('#connect-button');
    
    // Wait for connection to be established
    await page.waitForSelector('.connection-status.connected');
    
    // Simulate network offline
    const context = browser.contexts()[0];
    await context.setOffline(true);
    
    // Verify disconnection is detected
    await page.waitForSelector('.connection-status.disconnected');
    
    // Restore network
    await context.setOffline(false);
    
    // Verify reconnection
    await page.waitForSelector('.connection-status.connected', { timeout: 10000 });
    
    // Verify reconnection in the server logs
    const reconnectMessages = wsContext.getMessagesByType('reconnect');
    expect(reconnectMessages.length).toBeGreaterThan(0);
  });
});
```

### Best Practices for WebSocket Server Mocking

1. **Isolate Test Environments**
   - Use unique ports for each test file to avoid conflicts
   - Create a new WebSocket server instance for each test suite
   - Ensure proper cleanup after tests complete

2. **Handle Authentication**
   - Support token-based authentication
   - Validate authentication headers or initial handshake
   - Simulate authentication failures and edge cases

3. **Message Validation**
   - Validate message structure and content
   - Handle malformed messages gracefully
   - Support different message formats (JSON, binary, text)

4. **Connection Management**
   - Track connected clients
   - Handle connection timeouts
   - Support clean shutdown procedures

5. **Testing Scenarios**
   - Normal operation (happy path)
   - Network interruptions
   - Server restarts
   - High message volume
   - Large message sizes
   - Invalid messages
   - Reconnection scenarios

6. **Performance Considerations**
   - Limit message history to prevent memory leaks
   - Use efficient data structures for message storage
   - Implement rate limiting if needed

7. **Debugging Support**
   - Log important events
   - Provide test utilities for inspecting WebSocket traffic
   - Support message filtering and searching

```typescript
// Example test for WebSocket reconnection
test('should reconnect when connection is lost', async ({ page }) => {
  // Set up WebSocket with reconnection logic
  await page.evaluate(() => {
    window.connectionAttempts = 0;
    
    function connect() {
      const ws = new WebSocket('wss://your-websocket-url');
      
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        window.connectionAttempts++;
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected, reconnecting...');
        setTimeout(connect, 1000);
      };
      
      return ws;
    }
    
    window.ws = connect();
  });

  // Simulate network failure
  await page.evaluate(() => window.ws.close());
  
  // Wait for reconnection
  await page.waitForFunction(
    () => window.connectionAttempts > 1,
    null,
    { timeout: 10000 }
  );
  
  // Verify reconnection
  const attempts = await page.evaluate(() => window.connectionAttempts);
  expect(attempts).toBeGreaterThan(1);
});
```

## Authentication Methods

Testing authentication flows is crucial for web applications. This section covers various authentication methods including OAuth, JWT, and basic auth.

### Basic Authentication

#### Selenium
```typescript
// Using URL-based basic auth
const username = 'user';
const password = 'pass';
const authUrl = `https://${username}:${password}@example.com`;
await driver.get(authUrl);

// Or using a proxy
const http = require('http');
const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 10,
});

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
options.addArguments('--proxy-server=http://proxy.example.com:8080');

const driver = await new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Set basic auth header
const credentials = Buffer.from(`${username}:${password}`).toString('base64');
await driver.executeScript(`
  const headers = new Headers();
  headers.append('Authorization', 'Basic ${credentials}');
  return fetch('https://api.example.com/data', { headers });
`);
```

#### Playwright
```typescript
// Using browser context with HTTP credentials
const context = await browser.newContext({
  httpCredentials: {
    username: 'user',
    password: 'pass',
  },
});

const page = await context.newPage();
await page.goto('https://example.com/secure');

// Or set headers directly
await page.setExtraHTTPHeaders({
  'Authorization': `Basic ${Buffer.from('user:pass').toString('base64')}`
});

// Or intercept and modify requests
await page.route('**/api/**', route => {
  const headers = {
    ...route.request().headers(),
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  };
  route.continue({ headers });
});
```

### OAuth 2.0 Authentication

#### Selenium
```typescript
// Test OAuth flow - manual login
await driver.get('https://oauth-provider.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=read');

// Fill in login form
await driver.findElement(By.id('username')).sendKeys('testuser');
await driver.findElement(By.id('password')).sendKeys('testpass');
await driver.findElement(By.id('login-button')).click();

// Handle consent screen if shown
await driver.wait(until.elementLocated(By.id('approve')), 5000).click();

// Extract authorization code from redirect URL
const redirectUrl = await driver.getCurrentUrl();
const url = new URL(redirectUrl);
const authCode = url.searchParams.get('code');

// Exchange code for token (in test environment, might use a test token directly)
const tokenResponse = await fetch('https://oauth-provider.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: 'YOUR_REDIRECT_URI',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET'
  })
});

const { access_token } = await tokenResponse.json();

// Use token in subsequent requests
await driver.executeScript(`
  localStorage.setItem('auth_token', '${access_token}');
`);
```

#### Playwright
```typescript
// Option 1: Use storage state (recommended for testing)
async function authenticate() {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to OAuth provider
  await page.goto('https://oauth-provider.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=token&scope=read');
  
  // Fill in login form
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'testpass');
  await page.click('#login-button');
  
  // Handle consent if needed
  await page.waitForSelector('#approve', { state: 'visible' });
  await page.click('#approve');
  
  // Wait for redirect and extract token from URL
  await page.waitForURL('**/callback**');
  const token = new URL(page.url()).hash.split('&').find(p => p.startsWith('access_token=')).split('=')[1];
  
  // Save storage state to file
  await context.storageState({ path: 'auth-state.json' });
  await context.close();
  
  return token;
}

// In your test
const context = await browser.newContext({ storageState: 'auth-state.json' });
const page = await context.newPage();

// Option 2: Mock OAuth flow
await page.route('**/oauth2/authorize**', route => {
  // Bypass actual OAuth and return a test token
  const url = new URL(route.request().url());
  const redirectUri = url.searchParams.get('redirect_uri');
  const state = url.searchParams.get('state');
  
  // Redirect back with test token
  page.goto(`${redirectUri}#access_token=test_token&token_type=bearer&state=${state}`);
});

// Use the authenticated page
await page.goto('https://yourapp.com/dashboard');
```

### JWT Authentication

#### Selenium
```typescript
// Set JWT in localStorage
const jwtToken = 'your.jwt.token';
await driver.executeScript(`
  localStorage.setItem('jwt', '${jwtToken}');
`);

// Or set Authorization header for API requests
await driver.executeAsyncScript((jwt, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.example.com/data', true);
  xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
  xhr.onload = () => callback(xhr.responseText);
  xhr.send();
}, jwtToken);
```

#### Playwright
```typescript
// Set JWT in localStorage
await page.evaluate((token) => {
  localStorage.setItem('jwt', token);
}, 'your.jwt.token');

// Or intercept and modify requests
await page.route('**/api/**', route => {
  const headers = {
    ...route.request().headers(),
    'Authorization': 'Bearer your.jwt.token'
  };
  route.continue({ headers });
});

// Or use request context
const apiContext = await request.newContext({
  baseURL: 'https://api.example.com',
  extraHTTPHeaders: {
    'Authorization': 'Bearer your.jwt.token',
  },
});

const response = await apiContext.get('/user');
const user = await response.json();
```

### Multi-factor Authentication (MFA)

#### Selenium
```typescript
// Handle TOTP-based MFA
const speakeasy = require('speakeasy');

// After entering username/password
await driver.findElement(By.id('username')).sendKeys('testuser');
await driver.findElement(By.id('password')).sendKeys('testpass');
await driver.findElement(By.id('login')).click();

// Generate TOTP token
const secret = 'YOUR_TOTP_SECRET'; // In real tests, use a test secret
const token = speakeasy.totp({
  secret: secret,
  encoding: 'base32'
});

// Enter the token
await driver.wait(until.elementLocated(By.id('totp-code')), 5000)
  .sendKeys(token);
await driver.findElement(By.id('verify')).click();
```

#### Playwright
```typescript
// Handle TOTP-based MFA with Playwright
const speakeasy = require('speakeasy');

test('login with MFA', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://yourapp.com/login');
  
  // Enter credentials
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'testpass');
  await page.click('#login');
  
  // Generate TOTP token
  const secret = 'YOUR_TOTP_SECRET'; // Use test secret
  const token = speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
  
  // Enter the token
  await page.waitForSelector('#totp-code');
  await page.fill('#totp-code', token);
  await page.click('#verify');
  
  // Verify successful login
  await expect(page).toHaveURL('**/dashboard');
});

// Or mock the MFA verification
await page.route('**/verify-totp', route => {
  // Always return success for tests
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, token: 'test-jwt-token' })
  });
});
```

### Best Practices for Authentication Testing

1. **Use Test Accounts**: Create dedicated test accounts with known credentials
2. **Environment Variables**: Store sensitive data in environment variables
3. **Mock Authentication**: For faster tests, consider mocking authentication when possible
4. **Test Token Expiration**: Verify token refresh flows work correctly
5. **Test Error Cases**: Test invalid credentials, expired tokens, etc.
6. **Isolate Tests**: Ensure authentication state doesn't leak between tests
7. **Use Storage State**: In Playwright, save and reuse authentication state
8. **Rate Limiting**: Be aware of rate limiting in test environments

```typescript
// Example: Reusing authenticated state in Playwright
const { test } = require('@playwright/test');

test.describe('Authenticated tests', () => {
  let authenticatedPage;
  
  test.beforeAll(async ({ browser }) => {
    // Create a new context with saved auth state
    const context = await browser.newContext({
      storageState: 'auth-state.json',
    });
    authenticatedPage = await context.newPage();
  });
  
  test('should access protected resource', async () => {
    await authenticatedPage.goto('https://yourapp.com/dashboard');
    // Test authenticated features
  });
  
  test.afterAll(async () => {
    await authenticatedPage.close();
  });
});
```

## Visual Testing

Visual testing ensures your application's UI appears correctly to users. This section covers visual regression testing, element screenshots, and full-page screenshots in both Selenium and Playwright.

### Taking Screenshots

#### Selenium
```typescript
// Take a screenshot of the entire page
const fs = require('fs').promises;
const screenshot = await driver.takeScreenshot();
await fs.writeFile('screenshot.png', screenshot, 'base64');

// Take a screenshot of a specific element
const element = await driver.findElement(By.id('element-id'));
const elementScreenshot = await element.takeScreenshot(true); // true for base64
await fs.writeFile('element.png', elementScreenshot, 'base64');

// Set viewport size for consistent screenshots
await driver.manage().window().setRect({
  width: 1280,
  height: 800,
  x: 0,
  y: 0
});
```

#### Playwright
```typescript
// Take a screenshot of the entire page
await page.screenshot({ path: 'screenshot.png' });

// Take a screenshot of a specific element
await page.locator('#element-id').screenshot({ path: 'element.png' });

// Take a full page screenshot (including content not in viewport)
await page.screenshot({ 
  path: 'fullpage.png',
  fullPage: true 
});

// Take a screenshot with specific viewport
await page.setViewportSize({ width: 1280, height: 800 });
await page.screenshot({ path: 'viewport.png' });
```

### Visual Regression Testing

#### Selenium with WebdriverIO and wdio-image-comparison
```typescript
// Install: npm install --save-dev wdio-image-comparison-service

// In wdio.conf.js
exports.config = {
  // ...
  services: ['image-comparison'],
  // ...
};

// In your test
const checkElement = await $('#element');

// Save or compare element screenshot
await checkElement.saveElement(
  checkElement,
  'elementName',
  {
    savePerInstance: true,
    blockOut: [{
      top: 10,
      left: 10,
      width: 100,
      height: 100
    }]
  }
);

// Compare with baseline
const result = await browser.checkElement(
  checkElement,
  'elementName',
  {
    blockOut: [{
      top: 10,
      left: 10,
      width: 100,
      height: 100
    }]
  }
);

expect(result.misMatchPercentage).toBeLessThan(0.1); // Allow 0.1% difference
```

#### Playwright with @playwright/test
```typescript
// Install: npm install -D @playwright/test

// In your test
import { test, expect } from '@playwright/test';

test('should match the saved screenshot', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Take screenshot and compare with baseline
  expect(await page.screenshot({
    fullPage: true,
    mask: [page.locator('.dynamic-content')] // Ignore dynamic content
  })).toMatchSnapshot('homepage.png');
  
  // For specific elements
  const button = page.locator('button.primary');
  expect(await button.screenshot()).toMatchSnapshot('primary-button.png');
});

// Configure visual comparison in playwright.config.js
const config = {
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // 1% pixel difference allowed
      threshold: 0.2,         // 0.2 threshold for pixel matching
      animations: 'disabled'  // Disable animations for stable screenshots
    }
  }
};

export default config;
```

### Handling Dynamic Content

#### Selenium
```typescript
// Hide dynamic elements before taking screenshot
await driver.executeScript(`
  document.querySelectorAll('.dynamic-content').forEach(el => {
    el.style.visibility = 'hidden';
  });
`);

// Take screenshot
const screenshot = await driver.takeScreenshot();

// Restore elements
driver.executeScript(`
  document.querySelectorAll('.dynamic-content').forEach(el => {
    el.style.visibility = 'visible';
  });
`);
```

#### Playwright
```typescript
// Hide dynamic elements before taking screenshot
await page.evaluate(() => {
  document.querySelectorAll('.dynamic-content').forEach(el => {
    el.style.visibility = 'hidden';
  });
});

// Take screenshot with masked areas
await page.screenshot({
  path: 'screenshot.png',
  mask: [
    page.locator('.dynamic-content'),
    page.locator('.ads')
  ]
});

// Or use the built-in masking for visual comparisons
expect(await page.screenshot({
  mask: [page.locator('.dynamic-content')]
})).toMatchSnapshot('page-without-dynamic.png');
```

### Full-Page Visual Testing

#### Selenium
```typescript
// Full page screenshot with Selenium (requires scrolling)
async function takeFullPageScreenshot(driver, filePath) {
  // Get total height of the page
  const totalHeight = await driver.executeScript(
    'return Math.max(document.body.scrollHeight, ' +
    'document.body.offsetHeight, document.documentElement.clientHeight, ' +
    'document.documentElement.scrollHeight, document.documentElement.offsetHeight);'
  );

  // Get viewport height
  const viewportHeight = await driver.executeScript(
    'return window.innerHeight;'
  );

  // Take multiple screenshots and stitch them
  const screenshots = [];
  
  for (let y = 0; y < totalHeight; y += viewportHeight) {
    await driver.executeScript(`window.scrollTo(0, ${y})`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for scroll
    
    const screenshot = await driver.takeScreenshot();
    screenshots.push({
      image: screenshot,
      y: y
    });
  }

  // Stitch screenshots (you'd need a library like sharp or jimp)
  // This is a simplified example
  const stitchedImage = await stitchScreenshots(screenshots, viewportHeight);
  await require('fs').promises.writeFile(filePath, stitchedImage);
}
```

#### Playwright
```typescript
// Full page screenshot is built-in with Playwright
await page.screenshot({
  path: 'fullpage.png',
  fullPage: true,
  animations: 'disabled', // Disable animations for stable screenshots
  scale: 'css' // or 'device' for device scale factor
});

// With custom options
await page.screenshot({
  path: 'custom.png',
  fullPage: true,
  mask: [page.locator('.dynamic-content')],
  animations: 'disabled',
  caret: 'hide', // Hide text cursor
  stylePath: 'path/to/overrides.css' // Apply custom styles
});
```

### Visual Testing Best Practices

1. **Use a Baseline**: Store baseline images in version control
2. **Handle Dynamic Content**: Mask or ignore dynamic elements (timestamps, animations, etc.)
3. **Be Careful with Fonts**: Ensure consistent font rendering across environments
4. **Use Appropriate Thresholds**: Allow for minor, imperceptible differences
5. **Test Responsive Designs**: Test at different viewport sizes
6. **Run Tests in CI**: Integrate visual tests into your CI/CD pipeline
7. **Use Multiple Browsers**: Test across different browsers and platforms
8. **Maintain Test Data**: Clean up test data and screenshots

```typescript
// Example: Visual testing in CI with Playwright
const { test, expect } = require('@playwright/test');

// Run visual tests only in CI
const shouldRunVisualTests = process.env.CI === 'true';

const testFn = shouldRunVisualTests ? test : test.skip;

testFn('visual regression test', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Take screenshot and compare with baseline
  expect(await page.screenshot({
    fullPage: true,
    animations: 'disabled',
    mask: [
      page.locator('.dynamic-content'),
      page.locator('.ads')
    ]
  })).toMatchSnapshot('homepage.png', {
    maxDiffPixelRatio: 0.01, // 1% pixel difference allowed
    threshold: 0.2,          // 0.2 threshold for pixel matching
    maxDiffPixels: 100       // Allow up to 100 different pixels
  });
});

// Update baseline screenshots
// PLAYWRIGHT_UPDATE_SNAPSHOTS=1 npx playwright test
```

## Accessibility Testing

Accessibility testing ensures your application is usable by people with disabilities. This section covers automated accessibility testing techniques in both Selenium and Playwright.

### Automated Accessibility Testing

#### Selenium with axe-core
```typescript
// Install: npm install axe-core-webdriverio
const { AxeBuilder } = require('axe-core-webdriverio');
const { By } = require('selenium-webdriver');

// Run accessibility scan
const builder = new AxeBuilder(driver)
  .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
  .exclude('.exclude-this-element');

// Analyze the page
const results = await builder.analyze();

// Process results
console.log('Accessibility Violations:', results.violations.length);
results.violations.forEach(violation => {
  console.log(`\n${violation.help} (${violation.id})`);
  console.log('Impact:', violation.impact);
  console.log('Help URL:', violation.helpUrl);
  violation.nodes.forEach(node => {
    console.log('Element:', node.html);
  });
});

// Or use a simpler approach with axe-core directly
const axeSource = require('axe-core').source;
await driver.executeScript(axeSource);
const a11yResults = await driver.executeAsyncScript(callback => {
  // @ts-ignore - axe is injected at runtime
  axe.run(document, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']
    },
    resultTypes: ['violations']
  }, callback);
});
```

#### Playwright with @axe-core/playwright
```typescript
// Install: npm install @axe-core/playwright
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Configure and run accessibility scan
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
    .exclude('.exclude-this-element')
    .analyze();

  // Assert no critical issues
  expect(accessibilityScanResults.violations).toEqual([]);
  
  // Or handle violations
  if (accessibilityScanResults.violations.length > 0) {
    console.log('Accessibility issues found:');
    console.log(JSON.stringify(accessibilityScanResults.violations, null, 2));
  }
});

// Test with specific rules disabled
test('should pass accessibility with custom rules', async ({ page }) => {
  await page.goto('https://example.com');
  
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast']) // Disable specific rules
    .options({
      rules: {
        'landmark-one-main': { enabled: true },
        'page-has-heading-one': { enabled: true }
      }
    })
    .analyze();
    
  expect(results.violations).toEqual([]);
});
```

### Testing Keyboard Navigation

#### Selenium
```typescript
// Test tab order
const elements = await driver.findElements(By.css('button, [href], input, select, textarea, [tabindex]'));
const tabOrder = [];

for (const element of elements) {
  const tagName = await element.getTagName();
  const text = await element.getText();
  const type = await element.getAttribute('type');
  const role = await element.getAttribute('role');
  tabOrder.push({ tagName, text, type, role });
}

// Verify logical tab order
const interactiveElements = tabOrder.filter(el => 
  !el.tabindex || parseInt(el.tabindex) >= 0
);

// Check for positive tabindex (anti-pattern)
const positiveTabIndex = tabOrder.some(el => 
  el.tabindex && parseInt(el.tabindex) > 0
);

expect(positiveTabIndex).toBe(false);

// Test keyboard navigation
const body = await driver.findElement(By.tagName('body'));
await body.sendKeys(Key.TAB);

// Check focus is on first interactive element
const activeElement = await driver.switchTo().activeElement();
const firstInteractive = interactiveElements[0];
const activeTag = await activeElement.getTagName();
const activeText = await activeElement.getText();

expect(activeTag).toBe(firstInteractive.tagName);
expect(activeText).toContain(firstInteractive.text);
```

#### Playwright
```typescript
// Test keyboard navigation
test('should have logical tab order', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Get all focusable elements
  const focusableElements = await page.$$eval(
    'button, [href], input, select, textarea, [tabindex]',
    elements => elements.map(el => ({
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim() || '',
      type: el.getAttribute('type'),
      tabindex: el.getAttribute('tabindex'),
      role: el.getAttribute('role')
    }))
  );
  
  // Filter out elements with tabindex="-1"
  const tabbableElements = focusableElements.filter(el => 
    el.tabindex !== '-1' && !el.tabindex
  );
  
  // Check for positive tabindex (anti-pattern)
  const hasPositiveTabIndex = focusableElements.some(el => 
    el.tabindex && parseInt(el.tabindex) > 0
  );
  
  expect(hasPositiveTabIndex).toBe(false);
  
  // Test tab order
  await page.keyboard.press('Tab');
  
  // Get the currently focused element
  const focusedHandle = await page.evaluateHandle(() => document.activeElement);
  const focusedElement = await page.evaluate(el => ({
    tag: el.tagName.toLowerCase(),
    text: el.textContent?.trim() || '',
    type: el.getAttribute('type')
  }), focusedHandle);
  
  // Verify first focusable element is focused
  expect(focusedElement.tag).toBe(tabbableElements[0].tag);
  expect(focusedElement.text).toContain(tabbableElements[0].text);
  
  // Test skipping to main content
  await page.keyboard.press('Tab');
  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toBeFocused();
  
  // Test skip link functionality
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});
```

### ARIA Attributes and Roles

#### Selenium
```typescript
// Test ARIA attributes
const button = await driver.findElement(By.css('button[aria-expanded]'));
const isExpanded = await button.getAttribute('aria-expanded');

expect(isExpanded).toBe('false');

// Click the button to expand
await button.click();
const updatedExpanded = await button.getAttribute('aria-expanded');
expect(updatedExpanded).toBe('true');

// Test ARIA roles
const modal = await driver.findElement(By.css('[role="dialog"]'));
const modalLabel = await modal.getAttribute('aria-label') || 
                  await modal.getAttribute('aria-labelledby');

expect(modalLabel).toBeTruthy();

// Test ARIA live regions
await driver.executeScript(`
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.id = 'live-region';
  document.body.appendChild(liveRegion);
`);

// Update live region
await driver.executeScript(`
  document.getElementById('live-region').textContent = 'New content loaded';
`);

// Verify screen reader would announce the update
const liveRegion = await driver.findElement(By.id('live-region'));
const liveContent = await liveRegion.getText();
expect(liveContent).toBe('New content loaded');
```

#### Playwright
```typescript
// Test ARIA attributes and roles
test('should have proper ARIA attributes', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Test button with aria-expanded
  const button = page.locator('button[aria-expanded]');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  
  // Test modal dialog
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toHaveAttribute('aria-label', /./); // Non-empty label
  
  // Test ARIA live regions
  await page.evaluate(() => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  });
  
  // Update live region
  await page.evaluate(() => {
    document.getElementById('live-region').textContent = 'New content loaded';
  });
  
  // Verify live region update
  const liveRegion = page.locator('#live-region');
  await expect(liveRegion).toHaveText('New content loaded');
  
  // Test landmark roles
  const landmarks = await page.$$eval(
    'header, main, nav, aside, footer, [role="banner"], [role="navigation"]',
    elements => elements.length
  );
  
  expect(landmarks).toBeGreaterThan(0);
});
```

### Color Contrast and Visual Accessibility

#### Selenium
```typescript
// Install: npm install color-contrast-checker
const { ColorContrastChecker } = require('color-contrast-checker');
const ccc = new ColorControssChecker();

// Get element's computed styles
const element = await driver.findElement(By.css('.important-text'));
const bgColor = await element.getCssValue('background-color');
const textColor = await element.getCssValue('color');

// Check contrast ratio (WCAG AA requires 4.5:1 for normal text)
const contrastRatio = ccc.getContrastRatio(
  ccc.hexToRgb(textColor),
  ccc.hexToRgb(bgColor)
);

const isAACompliant = ccc.isLevelAA(contrastRatio, 14); // 14px font size
expect(isAACompliant).toBe(true);
```

#### Playwright
```typescript
// Test color contrast with Playwright
test('should have sufficient color contrast', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Check contrast of all text elements
  const elements = await page.$$('p, h1, h2, h3, h4, h5, h6, a, button, [role="button"]');
  
  for (const element of elements) {
    const text = await element.textContent();
    if (!text || text.trim() === '') continue;
    
    const contrast = await page.evaluate(el => {
      const style = window.getComputedStyle(el);
      const textColor = style.color;
      let bgColor = style.backgroundColor;
      
      // If background is transparent, get parent's background
      if (bgColor === 'rgba(0, 0, 0, 0)') {
        let parent = el.parentElement;
        while (parent && bgColor === 'rgba(0, 0, 0, 0)') {
          const parentStyle = window.getComputedStyle(parent);
          bgColor = parentStyle.backgroundColor;
          parent = parent.parentElement;
        }
      }
      
      // Simple contrast check (for demonstration)
      // In a real test, use a proper color contrast library
      return { textColor, bgColor };
    }, element);
    
    console.log(`Element with text "${text.substring(0, 30)}..." has colors:`, contrast);
  }
  
  // Or use axe-core for comprehensive contrast checking
  const results = await new AxeBuilder({ page })
    .withTags(['cat.color'])
    .analyze();
    
  const contrastIssues = results.violations.filter(
    violation => violation.id === 'color-contrast'
  );
  
  expect(contrastIssues).toEqual([]);
});
```

### Screen Reader Testing

#### Selenium with ChromeVox
```typescript
// Note: ChromeVox is a Chrome extension for screen reader testing
// This is a simplified example - real testing would require ChromeVox to be installed

// Configure Chrome to load ChromeVox
const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();
options.addExtensions('path/to/chromevox.crx');

const driver = await new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Navigate and interact with the page
await driver.get('https://example.com');

// Simulate screen reader commands (simplified example)
// In a real test, you would use a tool like ChromeVox's API
const actions = driver.actions();
await actions.keyDown(Key.CONTROL)
  .keyDown(Key.ALT)
  .sendKeys('h') // ChromeVox read from here command
  .keyUp(Key.ALT)
  .keyUp(Key.CONTROL)
  .perform();

// Verify screen reader output (this would need a custom implementation)
const readerOutput = await driver.executeScript(
  'return window.chrome.extension.getViews()[0].chromeVoxState.currentRange.toString()'
);

expect(readerOutput).toContain('expected content');
```

#### Playwright with VoiceOver (macOS)
```typescript
// Note: This is a conceptual example - actual implementation would vary
// based on your testing environment and needs

test('should be navigable with screen reader', async ({ page }) => {
  // This is a simplified example - in practice, you would need:
  // 1. A way to run VoiceOver programmatically
  // 2. A way to capture VoiceOver output
  // 3. A way to send VoiceOver commands
  
  // Start VoiceOver (macOS specific)
  const { execSync } = require('child_process');
  execSync('osascript -e "tell application \"VoiceOver\" to activate"');
  
  await page.goto('https://example.com');
  
  // Navigate through the page with VoiceOver commands
  // This is a conceptual example - actual implementation would vary
  await page.keyboard.press('Control+Option+RightArrow'); // Move to next item
  
  // You would need a way to capture VoiceOver output here
  // This typically requires additional tooling or services
  
  // Clean up
  execSync('osascript -e "tell application \"VoiceOver\" to quit"');
});

// Alternative: Use a service like Deque's axe DevTools for more comprehensive testing
import { AxeBuilder } from '@axe-core/playwright';

test('should pass accessibility scan', async ({ page }) => {
  await page.goto('https://example.com');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
    .analyze();
    
  expect(results.violations).toEqual([]);
  
  // Log any issues found
  if (results.violations.length > 0) {
    console.log('Accessibility issues found:', results.violations);
  }
});
```

### Best Practices for Accessibility Testing

1. **Automate What You Can**: Use tools like axe-core for automated accessibility testing
2. **Manual Testing**: Supplement with manual testing using screen readers and keyboard navigation
3. **Test Early and Often**: Integrate accessibility testing into your CI/CD pipeline
4. **Focus on Critical Issues First**: Address high-impact issues before minor ones
5. **Test with Real Users**: Include people with disabilities in your testing process
6. **Follow WCAG Guidelines**: Use WCAG 2.1 AA as a baseline
7. **Test Across Browsers and Devices**: Accessibility can vary across platforms
8. **Document Accessibility Features**: Keep track of accessibility features and known issues
9. **Use Semantic HTML**: Proper HTML structure is the foundation of accessibility
10. **Test Interactive Elements**: Ensure all interactive elements are keyboard accessible

```typescript
// Example: Comprehensive accessibility test suite
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should pass accessibility scan', async ({ page }) => {
    await page.goto('https://example.com');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.temporary-banner') // Exclude temporary content
      .analyze();
      
    expect(results.violations).toEqual([]);
  });
  
  test('should be fully keyboard navigable', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test tab order
    const focusableElements = await page.$$eval(
      'button, [href], input, select, textarea, [tabindex]',
      elements => elements.map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim() || '',
        tabindex: el.getAttribute('tabindex')
      }))
    );
    
    // Check for positive tabindex (anti-pattern)
    const hasPositiveTabIndex = focusableElements.some(el => 
      el.tabindex && parseInt(el.tabindex) > 0
    );
    
    expect(hasPositiveTabIndex).toBe(false);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const firstFocusable = focusableElements[0];
    const activeElement = await page.evaluate(() => 
      document.activeElement?.tagName.toLowerCase()
    );
    
    expect(activeElement).toBe(firstFocusable.tag);
  });
  
  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test images have alt text
    const images = await page.$$('img');
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Allow empty alt for decorative images
      const isDecorative = await img.evaluate(el => {
        const style = window.getComputedStyle(el);
        return el.getAttribute('role') === 'presentation' ||
               el.getAttribute('aria-hidden') === 'true' ||
               style.display === 'none' ||
               style.visibility === 'hidden';
      });
      
      if (!isDecorative) {
        expect(alt).toBeTruthy();
      }
    }
    
    // Test form controls have labels
    const formControls = await page.$$('input, select, textarea');
    for (const control of formControls) {
      const id = await control.getAttribute('id');
      const labelledBy = await control.getAttribute('aria-labelledby');
      const label = await control.getAttribute('aria-label');
      const title = await control.getAttribute('title');
      
      // At least one method of labeling should be present
      const hasLabel = id || labelledBy || label || title;
      expect(hasLabel).toBeTruthy();
    }
  });
});
```

## Performance Metrics

Performance testing is crucial for ensuring your web application meets performance expectations. This section covers how to collect and analyze performance metrics in both Selenium and Playwright.

### Collecting Performance Metrics

#### Selenium with Chrome DevTools Protocol (CDP)
```typescript
// Enable performance logging
const { Builder, logging } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configure Chrome options
const options = new chrome.Options();
options.setPerfLoggingPrefs({
  enableNetwork: true,
  enablePage: true,
  enableTimeline: true
});

// Create driver with performance logging
const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Get performance logs
const logs = await driver.manage().logs().get('performance');

// Parse and analyze performance logs
const metrics = [];
for (const entry of logs) {
  const message = JSON.parse(entry.message).message;
  if (message.method === 'Page.loadEventFired') {
    metrics.push({
      type: 'loadEvent',
      timestamp: message.params.timestamp
    });
  } else if (message.method === 'Network.responseReceived') {
    const { response } = message.params;
    metrics.push({
      type: 'response',
      url: response.url,
      status: response.status,
      mimeType: response.mimeType,
      timestamp: message.params.timestamp
    });
  }
}

// Calculate page load time
const navigationStart = logs.find(entry => 
  JSON.parse(entry.message).message.method === 'Page.navigationStarted'
);
const loadEvent = logs.find(entry =>
  JSON.parse(entry.message).message.method === 'Page.loadEventFired'
);

if (navigationStart && loadEvent) {
  const navStart = JSON.parse(navigationStart.message).message.params.timestamp;
  const loadEnd = JSON.parse(loadEvent.message).message.params.timestamp;
  const loadTime = (loadEnd - navStart) / 1000; // Convert to seconds
  console.log(`Page load time: ${loadTime.toFixed(2)}s`);
}
```

#### Playwright with Built-in Performance Metrics
```typescript
import { test, expect } from '@playwright/test';

test('should measure performance metrics', async ({ page }) => {
  // Start measuring performance
  await page.goto('about:blank');
  
  // Get metrics before navigation
  const startMetrics = await page.metrics();
  
  // Navigate to the page
  await page.goto('https://example.com');
  
  // Get metrics after navigation
  const endMetrics = await page.metrics();
  
  // Calculate navigation time
  const navigationTime = endMetrics.Timestamp - startMetrics.Timestamp;
  console.log(`Navigation time: ${(navigationTime / 1000).toFixed(2)}s`);
  
  // Get Web Vitals
  const webVitals = await page.evaluate(() => {
    // This requires the web-vitals library to be loaded on the page
    return new Promise(resolve => {
      // @ts-ignore - web-vitals is loaded on the page
      window.webVitals.getCLS(console.log);
      // @ts-ignore
      window.webVitals.getFID(console.log);
      // @ts-ignore
      window.webVitals.getLCP(console.log);
      // @ts-ignore
      window.webVitals.getFCP(console.log);
      // @ts-ignore
      window.webVitals.getTTFB(console.log);
      
      // Or collect all metrics
      // @ts-ignore
      window.webVitals.getMetrics(metrics => {
        resolve(metrics);
      });
    });
  });
  
  console.log('Web Vitals:', webVitals);
  
  // Get performance timing API data
  const timing = await page.evaluate(() => {
    const timing = performance.timing;
    return {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.requestStart,
      download: timing.responseEnd - timing.responseStart,
      domLoading: timing.domLoading,
      domInteractive: timing.domInteractive,
      domComplete: timing.domComplete,
      loadEventEnd: timing.loadEventEnd,
      total: timing.loadEventEnd - timing.navigationStart
    };
  });
  
  console.log('Navigation Timing:', timing);
});
```

### Lighthouse Integration

#### Selenium with Lighthouse
```typescript
// Install: npm install lighthouse chrome-launcher
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url, options = {}) {
  // Launch Chrome
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu']
  });
  
  // Run Lighthouse
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json', 
    logLevel: 'info',
    ...options
  });
  
  // Close Chrome
  await chrome.kill();
  
  return result;
}

// Run Lighthouse test
const { lhr } = await runLighthouse('https://example.com', {
  onlyCategories: ['performance'],
  throttling: {
    rttMs: 40,
    throughputKbps: 10 * 1024,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0
  }
});

// Access performance metrics
const metrics = {
  firstContentfulPaint: lhr.audits['first-contentful-paint'].displayValue,
  speedIndex: lhr.audits['speed-index'].displayValue,
  largestContentfulPaint: lhr.audits['largest-contentful-paint'].displayValue,
  timeToInteractive: lhr.audits['interactive'].displayValue,
  totalBlockingTime: lhr.audits['total-blocking-time'].displayValue,
  cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].displayValue
};

console.log('Lighthouse Metrics:', metrics);
```

#### Playwright with Lighthouse
```typescript
// Install: npm install @playwright/test @playwright/test-reporter lighthouse
import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test('should pass lighthouse audit', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Run Lighthouse audit
  await playAudit({
    page,
    thresholds: {
      performance: 80,
      accessibility: 90,
      'best-practices': 85,
      seo: 80,
      pwa: 50
    },
    port: 9222, // Chrome debugging port
    reports: {
      formats: {
        html: true,
        json: true
      },
      name: 'lighthouse-report',
      directory: 'lighthouse-reports'
    },
    disableLogs: false
  });
});
```

### Network Throttling and CPU Throttling

#### Selenium
```typescript
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Set network conditions
const options = new chrome.Options();
options.setNetworkConditions({
  offline: false,
  download_throughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
  upload_throughput: 750 * 1024 / 8, // 750 Kbps
  latency: 40 // 40ms
});

// Set CPU throttling
options.setUserPreferences({
  'performance': {
    'cpu': {
      'throttling': {
        'rate': 4 // 4x slowdown
      }
    }
  }
});

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';

test('should test with network throttling', async ({ browser }) => {
  // Create a new context with network conditions
  const context = await browser.newContext({
    // Emulate network conditions
    offline: false,
    // Slow 3G
    serviceWorkers: 'block',
    ...browser.devices['iPhone 12'],
    // Network conditions
    networkConditions: {
      download: 1.6 * 1000 * 1024 / 8, // 1.6 Mbps
      upload: 750 * 1024 / 8, // 750 Kbps
      latency: 150 // 150ms
    }
  });
  
  // Enable CPU throttling (4x slowdown)
  const client = await context.newCDPSession(await context.newPage());
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  
  const page = await context.newPage();
  await page.goto('https://example.com');
  
  // Test with throttled conditions
  // ...
});
```

### Memory Usage and Heap Snapshots

#### Selenium
```typescript
// Take heap snapshot
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
options.setLoggingPrefs({ performance: 'ALL' });

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Take heap snapshot
const snapshot1 = await driver.executeScript('return window.performance.memory.usedJSHeapSize');

// Perform actions
await driver.get('https://example.com');

// Take another snapshot
const snapshot2 = await driver.executeScript('return window.performance.memory.usedJSHeapSize');

console.log(`Memory used: ${(snapshot2 - snapshot1) / (1024 * 1024)} MB`);
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';

test('should measure memory usage', async ({ page }) => {
  // Get initial memory usage
  const client = await page.context().newCDPSession(page);
  await client.send('HeapProfiler.enable');
  
  // Take heap snapshot
  const { profile: snapshot1 } = await client.send('HeapProfiler.takeHeapSnapshot', {
    reportProgress: false
  });
  
  // Perform actions
  await page.goto('https://example.com');
  
  // Take another snapshot
  const { profile: snapshot2 } = await client.send('HeapProfiler.takeHeapSnapshot', {
    reportProgress: false
  });
  
  // Calculate memory difference
  const memoryUsed = (snapshot2.snapshot.meta.nodeCount - snapshot1.snapshot.meta.nodeCount) * 40; // Approx. 40 bytes per node
  console.log(`Memory used: ${(memoryUsed / (1024 * 1024)).toFixed(2)} MB`);
  
  // Get detailed memory metrics
  const metrics = await page.metrics();
  console.log('Memory metrics:', {
    jsHeapUsedSize: (metrics.JSHeapUsedSize / (1024 * 1024)).toFixed(2) + ' MB',
    jsHeapTotalSize: (metrics.JSHeapTotalSize / (1024 * 1024)).toFixed(2) + ' MB',
    nodes: metrics.Nodes,
    documents: metrics.Documents,
    listeners: metrics.JSEventListeners
  });
});
```

### Performance Best Practices

1. **Set Realistic Baselines**: Establish performance budgets and thresholds
2. **Test in Production-like Environments**: Use staging or production environments for accurate results
3. **Monitor Over Time**: Track performance metrics over multiple test runs
4. **Test Critical User Journeys**: Focus on the most important user flows
5. **Use Realistic Network Conditions**: Test with throttled network and CPU
6. **Monitor Memory Leaks**: Check for increasing memory usage over time
7. **Leverage Browser Caching**: Verify caching headers and service workers
8. **Optimize Critical Rendering Path**: Measure and optimize above-the-fold content
9. **Use Web Vitals**: Focus on user-centric metrics (LCP, FID, CLS)
10. **Automate Performance Testing**: Integrate performance tests into CI/CD

```typescript
// Example: Comprehensive performance test
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should meet performance budget', async ({ page, browser }) => {
    // Set up network conditions
    const context = await browser.newContext({
      ...browser.devices['Desktop Chrome'],
      networkConditions: {
        download: 5 * 1000 * 1024 / 8, // 5 Mbps
        upload: 2.5 * 1000 * 1024 / 8, // 2.5 Mbps
        latency: 20 // 20ms
      }
    });
    
    // Enable CPU throttling (2x slowdown)
    const client = await context.newCDPSession(await context.newPage());
    await client.send('Emulation.setCPUThrottlingRate', { rate: 2 });
    
    // Navigate and measure
    await page.goto('https://example.com');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => ({
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      firstPaint: performance.getEntriesByName('first-paint')[0].startTime,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0].startTime,
      largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint').pop()?.startTime || 0,
      cumulativeLayoutShift: performance.getEntriesByName('layout-shift')
        .reduce((sum, entry) => sum + entry.value, 0)
    }));
    
    // Assert performance budgets
    expect(metrics.loadTime).toBeLessThan(3000); // 3 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(2000); // 2 seconds
    expect(metrics.largestContentfulPaint).toBeLessThan(2500); // 2.5 seconds
    expect(metrics.cumulativeLayoutShift).toBeLessThan(0.1); // CLS < 0.1
    
    // Log results
    console.log('Performance Metrics:', {
      'Load Time': `${metrics.loadTime}ms`,
      'DOM Content Loaded': `${metrics.domContentLoaded}ms`,
      'First Paint': `${metrics.firstPaint}ms`,
      'First Contentful Paint': `${metrics.firstContentfulPaint}ms`,
      'Largest Contentful Paint': `${metrics.largestContentfulPaint}ms`,
      'Cumulative Layout Shift': metrics.cumulativeLayoutShift.toFixed(3)
    });
  });
  
  test('should not have memory leaks', async ({ page }) => {
    // Test for memory leaks by performing actions multiple times
    const client = await page.context().newCDPSession(page);
    await client.send('HeapProfiler.enable');
    
    // Initial memory usage
    const initialMetrics = await page.metrics();
    
    // Perform actions that might cause memory leaks
    for (let i = 0; i < 10; i++) {
      await page.goto('https://example.com');
      await page.click('a');
      await page.goBack();
    }
    
    // Force garbage collection
    await client.send('HeapProfiler.collectGarbage');
    
    // Get final memory usage
    const finalMetrics = await page.metrics();
    const memoryIncrease = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
    
    console.log(`Memory increase: ${(memoryIncrease / (1024 * 1024)).toFixed(2)} MB`);
    
    // Assert no significant memory increase
    expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // Less than 5MB increase
  });
});
```

## Browser Console Logs

Monitoring and verifying browser console logs is essential for catching JavaScript errors, warnings, and other important messages during test execution. This section covers how to work with console logs in both Selenium and Playwright.

### Basic Console Log Collection

#### Selenium
```typescript
const { Builder, logging } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configure Chrome to capture browser logs
const options = new chrome.Options();
options.setLoggingPrefs({ browser: 'ALL' });

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Navigate to the page
await driver.get('https://example.com');

// Get browser logs
const logs = await driver.manage().logs().get('browser');

// Process logs
for (const entry of logs) {
  console.log(`[${new Date(entry.timestamp).toISOString()}] ${entry.level.name}: ${entry.message}`);
  
  // Example: Fail test on JavaScript errors
  if (entry.level.name === 'SEVERE') {
    console.error('JavaScript error detected:', entry.message);
  }
}
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';

test('should not have console errors', async ({ page }) => {
  // Array to store console messages
  const consoleMessages: { type: string; text: string }[] = [];
  
  // Listen to console events
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  // Navigate to the page
  await page.goto('https://example.com');
  
  // Example: Assert no errors in console
  const errors = consoleMessages.filter(msg => 
    msg.type === 'error' || 
    msg.type === 'warning' ||
    msg.text.includes('Failed to load resource')
  );
  
  expect(errors).toHaveLength(0);
});
```

### Filtering and Validating Specific Log Messages

#### Selenium
```typescript
// Get logs after specific action
await driver.findElement({ id: 'submit-button' }).click();

// Get and filter logs
const logs = await driver.manage().logs().get('browser');
const errorLogs = logs.filter(entry => 
  entry.level.name === 'SEVERE' && 
  entry.message.includes('API Error')
);

expect(errorLogs).toHaveLength(0);

// Check for specific log message
const hasSpecificLog = logs.some(entry => 
  entry.message.includes('Application initialized')
);

expect(hasSpecificLog).toBeTruthy();
```

#### Playwright
```typescript
test('should log specific messages', async ({ page }) => {
  const messages: string[] = [];
  
  page.on('console', msg => {
    messages.push(msg.text());
  });
  
  await page.goto('https://example.com');
  
  // Check for specific log message
  expect(messages.some(msg => 
    msg.includes('Application started')
  )).toBeTruthy();
  
  // Check for absence of error messages
  const errors = await page.evaluate(() => {
    return window.console.error.calls.map(call => 
      call.args.join(' ')
    );
  });
  
  expect(errors).toHaveLength(0);
});
```

### Advanced Console Log Handling

#### Selenium with Custom Logging
```typescript
class ConsoleMonitor {
  private logs: any[] = [];
  private driver: any;
  
  constructor(driver: any) {
    this.driver = driver;
  }
  
  async startMonitoring() {
    // Clear existing logs
    await this.driver.manage().logs().get('browser');
    this.logs = [];
  }
  
  async captureLogs() {
    const newLogs = await this.driver.manage().logs().get('browser');
    this.logs = [...this.logs, ...newLogs];
    return newLogs;
  }
  
  getErrors() {
    return this.logs.filter(entry => entry.level.name === 'SEVERE');
  }
  
  getWarnings() {
    return this.logs.filter(entry => entry.level.name === 'WARNING');
  }
  
  containsMessage(message: string) {
    return this.logs.some(entry => 
      entry.message.includes(message)
    );
  }
}

// Usage
const monitor = new ConsoleMonitor(driver);
await monitor.startMonitoring();
await driver.get('https://example.com');
await monitor.captureLogs();

// Assert no errors
const errors = monitor.getErrors();
expect(errors).toHaveLength(0);
```

#### Playwright with Custom Console Handler
```typescript
class ConsoleCollector {
  private messages: { type: string; text: string; location: any }[] = [];
  
  constructor(page: any) {
    page.on('console', msg => {
      this.messages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });
  }
  
  getMessages(type?: string) {
    return type 
      ? this.messages.filter(m => m.type === type)
      : this.messages;
  }
  
  hasMessageContaining(text: string) {
    return this.messages.some(m => m.text.includes(text));
  }
  
  clear() {
    this.messages = [];
  }
}

// Usage in test
test('should handle console messages', async ({ page }) => {
  const consoleCollector = new ConsoleCollector(page);
  
  await page.goto('https://example.com');
  
  // Check for specific message
  expect(consoleCollector.hasMessageContaining('Initialized')).toBeTruthy();
  
  // Get all errors
  const errors = consoleCollector.getMessages('error');
  expect(errors).toHaveLength(0);
});
```

### Testing Console Methods

#### Selenium
```typescript
// Override console methods to capture logs
await driver.executeScript(`
  window.consoleErrors = [];
  const originalError = console.error;
  console.error = function() {
    window.consoleErrors.push(Array.from(arguments).join(' '));
    originalError.apply(console, arguments);
  };
`);

// Perform actions that might log errors
await driver.findElement({ id: 'submit' }).click();

// Check captured errors
const consoleErrors = await driver.executeScript('return window.consoleErrors');
expect(consoleErrors).toHaveLength(0);
```

#### Playwright
```typescript
test('should test console methods', async ({ page }) => {
  // Listen to console events
  const messages: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      messages.push(msg.text());
    }
  });
  
  // Mock console.error
  await page.evaluate(() => {
    window.originalConsoleError = console.error;
    console.error = function() {
      window.originalConsoleError.apply(console, arguments);
      throw new Error('Console error detected: ' + Array.from(arguments).join(' '));
    };
  });
  
  // This will throw if console.error is called
  await expect(page.goto('https://example.com')).resolves.toBeTruthy();
  
  // Alternative: Check collected messages
  expect(messages).toHaveLength(0);
});
```

### Best Practices for Console Log Testing

1. **Fail Fast on Errors**: Configure your test framework to fail tests when unhandled exceptions occur in the browser console.

2. **Categorize Logs**: Separate logs by type (errors, warnings, logs) for better reporting.

3. **Include Context**: When logging test failures, include the console logs to help with debugging.

4. **Use Mocks**: For expected console messages, consider using mocks to avoid test flakiness.

5. **Clean State**: Clear logs between test cases to prevent cross-test contamination.

6. **Performance Impact**: Be mindful that capturing all console logs can impact test performance. Only capture what you need.

7. **CI Integration**: Configure your CI pipeline to capture and store console logs for failed tests.

8. **Selective Assertions**: Only assert on console messages that are part of your application's contract.

9. **Error Patterns**: Use pattern matching to identify and handle expected error messages.

10. **Documentation**: Document the expected console behavior in your test cases to make them more maintainable.

### Example: Comprehensive Console Test Suite

```typescript
// test/console.spec.ts
import { test, expect } from '@playwright/test';

class ConsoleTestContext {
  private page: any;
  private logs: { type: string; text: string }[] = [];
  
  constructor(page: any) {
    this.page = page;
    
    // Capture all console messages
    page.on('console', msg => {
      this.logs.push({
        type: msg.type(),
        text: msg.text()
      });
    });
  }
  
  async assertNoErrors() {
    const errors = this.logs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      throw new Error(`Found ${errors.length} console errors: ${
        errors.map(e => e.text).join('\n')
      }`);
    }
  }
  
  async assertNoWarnings() {
    const warnings = this.logs.filter(log => log.type === 'warning');
    if (warnings.length > 0) {
      console.warn('Console warnings:', warnings);
      // Uncomment to fail on warnings
      // throw new Error(`Found ${warnings.length} console warnings`);
    }
  }
  
  async assertMessageExists(message: string, type?: string) {
    const matches = this.logs.filter(log => 
      (!type || log.type === type) && 
      log.text.includes(message)
    );
    
    expect(matches.length).toBeGreaterThan(0);
    return matches;
  }
  
  clearLogs() {
    this.logs = [];
  }
}

test.describe('Console Logs', () => {
  let consoleContext: ConsoleTestContext;
  
  test.beforeEach(async ({ page }) => {
    consoleContext = new ConsoleTestContext(page);
    await page.goto('https://example.com');
  });
  
  test('should not have console errors', async () => {
    await consoleContext.assertNoErrors();
  });
  
  test('should log initialization message', async () => {
    await consoleContext.assertMessageExists('Application initialized');
  });
  
  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/data', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    // Trigger API call
    await page.click('#load-data');
    
    // Check for error handling
    await consoleContext.assertMessageExists('Failed to load data');
    await consoleContext.assertNoErrors();
  });
});
```

## Geolocation

Testing geolocation features is essential for location-based applications. This section covers how to mock and test geolocation functionality in both Selenium and Playwright.

### Setting Geolocation

#### Selenium
```typescript
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configure Chrome options
const options = new chrome.Options();
options.setUserPreferences({
  'profile.default_content_setting_values.geolocation': 1 // Allow geolocation
});

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

try {
  // Set geolocation using CDP (Chrome DevTools Protocol)
  const cdpConnection = await driver.createCDPConnection('page');
  await cdpConnection.execute('Emulation.setGeolocationOverride', {
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 100
  });

  // Navigate to a page that requests geolocation
  await driver.get('https://example.com/geolocation');
  
  // Handle the geolocation permission prompt
  await driver.wait(until.alertIsPresent());
  const alert = await driver.switchTo().alert();
  await alert.accept();
  
  // Verify location is set
  const locationText = await driver.findElement(By.id('location')).getText();
  expect(locationText).toContain('40.7128');
  expect(locationText).toContain('-74.0060');
} finally {
  await driver.quit();
}
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';

test('should set geolocation', async ({ browser }) => {
  // Create a new context with geolocation overrides
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 100
    },
    // Optional: Set timezone and locale
    timezoneId: 'America/New_York',
    locale: 'en-US'
  });
  
  const page = await context.newPage();
  
  // Navigate to a page that uses geolocation
  await page.goto('https://example.com/geolocation');
  
  // Verify location is set
  const locationText = await page.textContent('#location');
  expect(locationText).toContain('40.7128');
  expect(locationText).toContain('-74.0060');
  
  // Or get the current geolocation
  const geolocation = await page.evaluate(async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      });
    });
  });
  
  expect(geolocation).toEqual({
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: expect.any(Number)
  });
});
```

### Testing Permission Prompts

#### Selenium
```typescript
// Configure Chrome to automatically allow geolocation
const options = new chrome.Options();
options.addArguments('--disable-notifications');
options.setUserPreferences({
  'profile.default_content_setting_values.geolocation': 1,
  'profile.default_content_setting_values.notifications': 1
});

// Or to automatically deny:
// options.setUserPreferences({
//   'profile.default_content_setting_values.geolocation': 2
// });

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
```

#### Playwright
```typescript
test('should handle geolocation permission', async ({ browser }) => {
  // Test allowing geolocation
  const allowContext = await browser.newContext({
    permissions: ['geolocation']
  });
  
  const allowPage = await allowContext.newPage();
  await allowPage.goto('https://example.com/geolocation');
  
  // Test denying geolocation
  const denyContext = await browser.newContext({
    permissions: []
  });
  
  const denyPage = await denyContext.newPage();
  await denyPage.goto('https://example.com/geolocation');
  
  // Verify behavior when permission is denied
  const errorMessage = await denyPage.evaluate(() => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve('success'),
        (error) => resolve(error.message)
      );
    });
  });
  
  expect(errorMessage).toContain('permission');
});
```

### Simulating Movement

#### Selenium
```typescript
// Update geolocation during test
await cdpConnection.execute('Emulation.setGeolocationOverride', {
  latitude: 51.5074,
  longitude: -0.1278,
  accuracy: 100
});

// Wait for the page to update with new location
await driver.wait(until.elementTextContains(
  driver.findElement(By.id('location')),
  '51.5074'
));
```

#### Playwright
```typescript
test('should simulate movement', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 100
    }
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com/geolocation');
  
  // Initial location
  let locationText = await page.textContent('#location');
  expect(locationText).toContain('40.7128');
  
  // Update location
  await context.setGeolocation({
    latitude: 51.5074,
    longitude: -0.1278,
    accuracy: 50
  });
  
  // Wait for location update
  await page.waitForFunction(() => {
    const location = document.getElementById('location')?.textContent;
    return location?.includes('51.5074');
  });
  
  // Verify new location
  locationText = await page.textContent('#location');
  expect(locationText).toContain('51.5074');
});
```

### Testing Accuracy and Timestamp

#### Selenium
```typescript
// Set geolocation with specific accuracy and timestamp
const now = Date.now();
await cdpConnection.execute('Emulation.setGeolocationOverride', {
  latitude: 34.0522,
  longitude: -118.2437,
  accuracy: 50,
  timestamp: now
});

// Get the current position and verify timestamp
const position = await driver.executeAsyncScript((callback) => {
  navigator.geolocation.getCurrentPosition(
    (pos) => callback({
      coords: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      },
      timestamp: pos.timestamp
    })
  );
});

expect(position.coords.accuracy).toBeLessThanOrEqual(50);
expect(position.timestamp).toBeGreaterThanOrEqual(now);
```

#### Playwright
```typescript
test('should test accuracy and timestamp', async ({ browser }) => {
  const now = Date.now();
  
  const context = await browser.newContext({
    permissions: ['geolocation'],
    geolocation: {
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 25,
      timestamp: now
    }
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com/geolocation');
  
  const position = await page.evaluate(() => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            altitudeAccuracy: pos.coords.altitudeAccuracy,
            heading: pos.coords.heading,
            speed: pos.coords.speed
          },
          timestamp: pos.timestamp
        })
      );
    });
  });
  
  // Verify position data
  expect(position).toEqual({
    coords: {
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 25,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    },
    timestamp: expect.any(Number)
  });
  
  // Verify timestamp is recent
  expect(position.timestamp).toBeGreaterThanOrEqual(now);
  expect(position.timestamp).toBeLessThanOrEqual(Date.now());
});
```

### Testing Watch Position

#### Selenium
```typescript
// Set up position watcher
const positionUpdates = [];
await driver.executeScript(`
  window.positionUpdates = [];
  navigator.geolocation.watchPosition(
    (pos) => {
      window.positionUpdates.push({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: pos.timestamp
      });
    },
    (err) => console.error('Geolocation error:', err)
  );
`);

// Update position
await cdpConnection.execute('Emulation.setGeolocationOverride', {
  latitude: 37.7749,
  longitude: -122.4194,
  accuracy: 50
});

// Wait for position update
await driver.wait(async () => {
  const updates = await driver.executeScript('return window.positionUpdates');
  return updates.length > 0;
}, 5000, 'Position update not received');

// Get position updates
const updates = await driver.executeScript('return window.positionUpdates');
expect(updates[0].latitude).toBeCloseTo(37.7749);
```

#### Playwright
```typescript
test('should watch position changes', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation']
  });
  
  const page = await context.newPage();
  
  // Set up position watcher
  await page.evaluate(() => {
    window['positionUpdates'] = [];
    return new Promise((resolve) => {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          window['positionUpdates'].push({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
          if (window['positionUpdates'].length === 2) {
            navigator.geolocation.clearWatch(watchId);
            resolve();
          }
        },
        (error) => console.error('Geolocation error:', error)
      );
    });
  });
  
  // Initial position
  await context.setGeolocation({
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 50
  });
  
  // Update position
  await context.setGeolocation({
    latitude: 34.0522,
    longitude: -118.2437,
    accuracy: 25
  });
  
  // Wait for updates
  await page.waitForFunction(() => window['positionUpdates']?.length >= 2);
  
  // Get updates
  const updates = await page.evaluate('window.positionUpdates');
  
  // Verify updates
  expect(updates).toHaveLength(2);
  expect(updates[0].latitude).toBeCloseTo(37.7749);
  expect(updates[1].latitude).toBeCloseTo(34.0522);
  expect(updates[1].accuracy).toBe(25);
});
```

### Best Practices for Geolocation Testing

1. **Test Multiple Locations**: Verify your application works with various coordinates around the world.

2. **Test Edge Cases**:
   - Null/undefined coordinates
   - Zero coordinates (0, 0)
   - Extreme values (near poles, international date line)
   - High accuracy vs low accuracy positions

3. **Test Permission Flows**:
   - First-time permission request
   - Permission denied
   - Permission granted after denied
   - Permission revoked during session

4. **Test Offline Behavior**:
   - How does your app behave when geolocation is unavailable?
   - Does it fall back to IP-based location?

5. **Performance Testing**:
   - How does your app handle rapid position updates?
   - What's the impact on battery life for continuous tracking?

6. **Mock Movement**:
   - Test smooth transitions between locations
   - Test sudden jumps in position
   - Test altitude changes if relevant

7. **Error Handling**:
   - Test timeout scenarios
   - Test when permission is denied
   - Test when geolocation is not supported

8. **Security Considerations**:
   - Verify location data is handled securely
   - Test for potential location spoofing
   - Ensure proper user consent is obtained

9. **Cross-Browser Testing**:
   - Different browsers may handle geolocation slightly differently
   - Test on both desktop and mobile browsers

10. **CI/CD Integration**:
    - Make sure geolocation tests work in CI environments
    - Consider using service mocks for faster tests when possible

### Example: Comprehensive Geolocation Test Suite

```typescript
// tests/geolocation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Geolocation', () => {
  test.beforeEach(async ({ browser }) => {
    // Common setup for all tests
  });

  test('should get current position', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 50
      }
    });
    
    const page = await context.newPage();
    await page.goto('https://example.com/geolocation');
    
    const locationText = await page.textContent('#location');
    expect(locationText).toContain('40.7128');
    expect(locationText).toContain('-74.0060');
  });

  test('should handle permission denied', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: [] // No geolocation permission
    });
    
    const page = await context.newPage();
    await page.goto('https://example.com/geolocation');
    
    const errorMessage = await page.evaluate(() => {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve('success'),
          (error) => resolve(error.message)
        );
      });
    });
    
    expect(errorMessage).toContain('permission');
  });

  test('should update position', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['geolocation'],
      geolocation: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 100
      }
    });
    
    const page = await context.newPage();
    await page.goto('https://example.com/geolocation');
    
    // Initial position
    let locationText = await page.textContent('#location');
    expect(locationText).toContain('37.7749');
    
    // Update position
    await context.setGeolocation({
      latitude: 34.0522,
      longitude: -118.2437,
      accuracy: 50
    });
    
    // Wait for update
    await page.waitForFunction(() => {
      const location = document.getElementById('location')?.textContent;
      return location?.includes('34.0522');
    });
    
    // Verify update
    locationText = await page.textContent('#location');
    expect(locationText).toContain('34.0522');
  });

  test('should handle watchPosition', async ({ browser }) => {
    const context = await browser.newContext({
      permissions: ['geolocation']
    });
    
    const page = await context.newPage();
    
    // Set up position watcher
    const watchPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        const positions: any[] = [];
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            positions.push({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
            
            if (positions.length === 2) {
              navigator.geolocation.clearWatch(watchId);
              resolve(positions);
            }
          },
          (error) => console.error('Geolocation error:', error)
        );
      });
    });
    
    // Initial position
    await context.setGeolocation({
      latitude: 51.5074,
      longitude: -0.1278,
      accuracy: 100
    });
    
    // Update position
    await context.setGeolocation({
      latitude: 48.8566,
      longitude: 2.3522,
      accuracy: 50
    });
    
    // Get position updates
    const positions = await watchPromise;
    
    // Verify updates
    expect(positions).toHaveLength(2);
    expect(positions[0].latitude).toBeCloseTo(51.5074);
    expect(positions[1].latitude).toBeCloseTo(48.8566);
    expect(positions[1].accuracy).toBe(50);
  });
});
```

## Offline Mode

Testing offline functionality is crucial for Progressive Web Apps (PWAs) and applications that need to work without an internet connection. This section covers how to simulate offline mode and test offline behavior in both Selenium and Playwright.

### Basic Offline Simulation

#### Selenium
```typescript
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configure Chrome options
const options = new chrome.Options();
const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

try {
  // Enable offline mode using CDP
  const cdpConnection = await driver.createCDPConnection('page');
  await cdpConnection.execute('Network.enable');
  await cdpConnection.execute('Network.emulateNetworkConditions', {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0
  });

  // Navigate to a page
  await driver.get('https://example.com');
  
  // Check if offline behavior is working
  const offlineStatus = await driver.findElement(By.id('offline-status'));
  await driver.wait(until.elementTextContains(offlineStatus, 'offline'), 5000);
  
  // Back online
  await cdpConnection.execute('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1
  });
  
  await driver.wait(until.elementTextContains(offlineStatus, 'online'), 5000);
} finally {
  await driver.quit();
}
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';

test('should work offline', async ({ browser }) => {
  // Create a new context with offline mode enabled
  const context = await browser.newContext({
    offline: true
  });
  
  const page = await context.newPage();
  
  // Verify offline status
  const isOffline = await page.evaluate(() => window.navigator.onLine);
  expect(isOffline).toBe(false);
  
  // Listen for offline/online events
  await page.evaluate(() => {
    window['connectionStatus'] = [];
    window.addEventListener('online', () => window['connectionStatus'].push('online'));
    window.addEventListener('offline', () => window['connectionStatus'].push('offline'));
  });
  
  // Try to navigate (should show offline UI)
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
  
  // Check if offline UI is shown
  const offlineContent = await page.textContent('.offline-message');
  expect(offlineContent).toContain('You are currently offline');
  
  // Go back online
  await context.setOffline(false);
  
  // Wait for online event
  await page.waitForFunction(() => window.navigator.onLine);
  
  // Check if online UI is shown
  await page.waitForSelector('.online-content', { state: 'visible' });
  
  // Verify events were triggered
  const events = await page.evaluate('window.connectionStatus');
  expect(events).toContain('offline');
  expect(events).toContain('online');
});
```

### Testing Service Worker Offline Support

#### Selenium
```typescript
// First, register a service worker
await driver.executeScript(`
  if ('serviceWorker' in navigator) {
    window.registration = await navigator.serviceWorker.register('/sw.js');
  }
`);

// Wait for service worker to be active
await driver.wait(async () => {
  const reg = await driver.executeScript('return window.registration');
  return reg?.active?.state === 'activated';
}, 10000, 'Service worker not activated');

// Go offline
const cdpConnection = await driver.createCDPConnection('page');
await cdpConnection.execute('Network.emulateNetworkConditions', {
  offline: true,
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0
});

// Test offline behavior
await driver.get('https://example.com/offline-page');
const content = await driver.findElement(By.tagName('body')).getText();
expect(content).toContain('Cached content');
```

#### Playwright
```typescript
test('should work offline with service worker', async ({ browser }) => {
  const context = await browser.newContext({
    offline: true
  });
  
  const page = await context.newPage();
  
  // Register service worker
  await page.goto('https://example.com');
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/sw.js');
    await new Promise(resolve => {
      if (navigator.serviceWorker.controller) {
        return resolve(true);
      }
      navigator.serviceWorker.oncontrollerchange = () => resolve(true);
    });
  });
  
  // Test offline navigation
  await page.goto('https://example.com/offline-page');
  
  // Check if cached content is shown
  const content = await page.textContent('body');
  expect(content).toContain('Cached content');
  
  // Verify service worker is handling the request
  const isControlled = await page.evaluate(() => 
    !!navigator.serviceWorker.controller
  );
  expect(isControlled).toBe(true);
});
```

### Testing Cache API

#### Selenium
```typescript
// Setup cache before going offline
await driver.executeScript(`
  // Open a cache and add some resources
  async function setupCache() {
    const cache = await caches.open('test-cache');
    await cache.addAll([
      '/styles/main.css',
      '/js/app.js',
      '/offline.html'
    ]);
    return await caches.has('test-cache');
  }
  return setupCache();
`);

// Go offline and test cache access
await cdpConnection.execute('Network.emulateNetworkConditions', {
  offline: true,
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0
});

// Test if cached resources are available
const hasCachedFile = await driver.executeScript(`
  return caches.match('/offline.html')
    .then(response => !!response);
`);

expect(hasCachedFile).toBe(true);
```

#### Playwright
```typescript
test('should access cached resources when offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Setup cache
  await page.goto('https://example.com');
  await page.evaluate(async () => {
    const cache = await caches.open('test-cache');
    await cache.addAll([
      '/styles/main.css',
      '/js/app.js',
      '/offline.html'
    ]);
  });
  
  // Go offline
  await context.setOffline(true);
  
  // Test cache access
  const hasCachedFile = await page.evaluate(async () => {
    const response = await caches.match('/offline.html');
    return !!response;
  });
  
  expect(hasCachedFile).toBe(true);
  
  // Test navigation to cached page
  await page.goto('https://example.com/offline.html');
  const content = await page.textContent('body');
  expect(content).toContain('Offline content');
});
```

### Testing IndexedDB in Offline Mode

#### Selenium
```typescript
// Setup IndexedDB before going offline
await driver.executeScript(`
  return new Promise((resolve) => {
    const request = indexedDB.open('testDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('items')) {
        db.createObjectStore('items', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction('items', 'readwrite');
      const store = tx.objectStore('items');
      store.put({ id: 1, name: 'Test Item' });
      tx.oncomplete = () => resolve(true);
    };
    
    request.onerror = () => resolve(false);
  });
`);

// Go offline and test IndexedDB access
await cdpConnection.execute('Network.emulateNetworkConditions', {
  offline: true,
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0
});

const item = await driver.executeScript(`
  return new Promise((resolve) => {
    const request = indexedDB.open('testDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction('items', 'readonly');
      const store = tx.objectStore('items');
      const getRequest = store.get(1);
      
      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () => resolve(null);
    };
    
    request.onerror = () => resolve(null);
  });
`);

expect(item).toEqual({ id: 1, name: 'Test Item' });
```

#### Playwright
```typescript
test('should access IndexedDB when offline', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Setup IndexedDB
  await page.goto('https://example.com');
  await page.evaluate(async () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('testDB', 1);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id' });
        }
      };
      
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction('items', 'readwrite');
        const store = tx.objectStore('items');
        store.put({ id: 1, name: 'Test Item' });
        tx.oncomplete = () => resolve(true);
      };
      
      request.onerror = () => resolve(false);
    });
  });
  
  // Go offline
  await context.setOffline(true);
  
  // Test IndexedDB access
  const item = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('testDB', 1);
      
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction('items', 'readonly');
        const store = tx.objectStore('items');
        const getRequest = store.get(1);
        
        getRequest.onsuccess = () => resolve(getRequest.result);
        getRequest.onerror = () => resolve(null);
      };
      
      request.onerror = () => resolve(null);
    });
  });
  
  expect(item).toEqual({ id: 1, name: 'Test Item' });
  
  // Test adding data while offline
  const addResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('testDB', 1);
      
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction('items', 'readwrite');
        const store = tx.objectStore('items');
        const addRequest = store.put({ id: 2, name: 'Offline Item' });
        
        addRequest.onsuccess = () => resolve(true);
        addRequest.onerror = () => resolve(false);
      };
      
      request.onerror = () => resolve(false);
    });
  });
  
  expect(addResult).toBe(true);
});
```

### Testing Offline Form Submission

#### Selenium
```typescript
// Go offline before testing form submission
await cdpConnection.execute('Network.emulateNetworkConditions', {
  offline: true,
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0
});

// Fill out form
await driver.findElement(By.id('name')).sendKeys('Test User');
await driver.findElement(By.id('email')).sendKeys('test@example.com');
await driver.findElement(By.id('message')).sendKeys('This is a test message');

// Submit form
await driver.findElement(By.css('button[type="submit"]')).click();

// Check if form data is stored for later sync
const formData = await driver.executeScript(`
  return JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
`);

expect(formData).toContainEqual({
  name: 'Test User',
  email: 'test@example.com',
  message: 'This is a test message'
});

// Go back online and test sync
await cdpConnection.execute('Network.emulateNetworkConditions', {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1
});

// Trigger sync
await driver.executeScript(`
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SYNC' });
  }
`);

// Verify submission was processed
await driver.wait(async () => {
  const formData = await driver.executeScript(`
    return JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
  `);
  return formData.length === 0;
}, 10000, 'Form data was not synced');
```

#### Playwright
```typescript
test('should queue form submissions when offline', async ({ browser }) => {
  const context = await browser.newContext({
    offline: true
  });
  
  const page = await context.newPage();
  await page.goto('https://example.com/contact');
  
  // Fill out form
  await page.fill('#name', 'Test User');
  await page.fill('#email', 'test@example.com');
  await page.fill('#message', 'This is a test message');
  
  // Submit form
  await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/submit-form') && 
      response.status() === 200
    ).catch(() => {}), // Ignore network errors
    page.click('button[type="submit"]')
  ]);
  
  // Check if form data is stored for later sync
  const formData = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
  });
  
  expect(formData).toContainEqual({
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message'
  });
  
  // Go back online
  await context.setOffline(false);
  
  // Listen for sync event
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.addEventListener('message', function handler(event) {
          if (event.data && event.data.type === 'SYNC_COMPLETE') {
            navigator.serviceWorker.removeEventListener('message', handler);
            resolve();
          }
        });
        
        navigator.serviceWorker.controller.postMessage({ type: 'SYNC' });
      } else {
        resolve();
      }
    });
  });
  
  // Verify submission was processed
  const pendingSubmissions = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
  });
  
  expect(pendingSubmissions).toHaveLength(0);
  
  // Verify submission was received by the server
  const submissions = await page.evaluate(async () => {
    const response = await fetch('/api/submissions');
    return response.json();
  });
  
  expect(submissions).toContainEqual({
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message'
  });
});
```

### Best Practices for Offline Testing

1. **Test Both States**: Always test your application in both online and offline modes.

2. **Test Transitions**: Test the transition between online and offline states while the app is running.

3. **Service Worker Registration**: Ensure your tests wait for the service worker to be properly registered and activated.

4. **Cache Validation**: Verify that the correct resources are cached and available offline.

5. **Data Synchronization**: Test that data is properly queued when offline and synced when back online.

6. **Error Handling**: Verify that your application handles offline scenarios gracefully with appropriate user feedback.

7. **Storage Limits**: Test behavior when storage quotas are reached.

8. **Cross-Browser Testing**: Different browsers may handle offline behavior slightly differently.

9. **Performance**: Monitor the performance impact of offline features, especially on lower-end devices.

10. **Security**: Ensure sensitive data is handled securely, especially when stored locally.

### Example: Comprehensive Offline Test Suite

```typescript
// tests/offline.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Offline Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start online for each test
    await page.context().setOffline(false);
    await page.goto('https://example.com');
  });

  test('should detect offline state', async ({ page }) => {
    await page.context().setOffline(true);
    
    const isOffline = await page.evaluate(() => window.navigator.onLine);
    expect(isOffline).toBe(false);
    
    // Test offline event
    const offlineEvent = page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('offline', () => resolve('offline'), { once: true });
      });
    });
    
    await page.context().setOffline(true);
    expect(await offlineEvent).toBe('offline');
  });

  test('should serve cached content when offline', async ({ page }) => {
    // Visit page to cache content
    await page.goto('/important-page');
    
    // Go offline and revisit
    await page.context().setOffline(true);
    await page.reload();
    
    // Verify content is still available
    const content = await page.textContent('main');
    expect(content).toContain('Important Content');
  });

  test('should queue form submissions when offline', async ({ page, context }) => {
    await context.setOffline(true);
    
    await page.goto('/contact');
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Verify submission is queued
    const pendingSubmissions = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
    });
    
    expect(pendingSubmissions).toHaveLength(1);
    
    // Go online and verify sync
    await context.setOffline(false);
    
    // Wait for sync to complete
    await page.waitForFunction(() => {
      const subs = JSON.parse(localStorage.getItem('pendingFormSubmissions') || '[]');
      return subs.length === 0;
    });
    
    // Verify submission was processed
    const submissions = await page.evaluate(async () => {
      const response = await fetch('/api/submissions');
      return response.json();
    });
    
    expect(submissions).toContainEqual({
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  test('should handle failed sync attempts', async ({ page, context }) => {
    // Mock server to fail requests
    await page.route('/api/submit', route => route.abort());
    
    await context.setOffline(true);
    await page.goto('/contact');
    
    // Submit form while offline
    await page.fill('#name', 'Test User');
    await page.click('button[type="submit"]');
    
    // Go online with failing server
    await context.setOffline(false);
    
    // Trigger sync with retry mechanism
    await page.evaluate(async () => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.addEventListener('message', function handler(event) {
            if (event.data && event.data.type === 'SYNC_RETRY') {
              navigator.serviceWorker.removeEventListener('message', handler);
              resolve(event.data.retryCount);
            }
          });
          
          navigator.serviceWorker.controller.postMessage({ type: 'SYNC' });
        } else {
          resolve(0);
        }
      });
    });
    
    // Verify retry mechanism worked
    const retryCount = await page.evaluate(() => {
      return localStorage.getItem('syncRetryCount');
    });
    
    expect(parseInt(retryCount || '0')).toBeGreaterThan(0);
    
    // Verify user is notified of sync failure
    const errorMessage = await page.textContent('.sync-error');
    expect(errorMessage).toContain('Unable to sync data');
  });
});
```

## File Upload/Download

File handling is a critical part of web application testing. This section covers how to handle file uploads and downloads in both Selenium and Playwright, including various scenarios and best practices.

### Basic File Upload

#### Selenium
```typescript
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

// Configure Chrome options
const options = new chrome.Options();
const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

try {
  // Navigate to the upload page
  await driver.get('https://example.com/upload');
  
  // Get the absolute path to the file
  const filePath = path.join(__dirname, 'test-files', 'example.txt');
  
  // Find the file input element and send the file path
  const fileInput = await driver.findElement(By.css('input[type="file"]'));
  await fileInput.sendKeys(filePath);
  
  // Submit the form
  await driver.findElement(By.css('button[type="submit"]')).click();
  
  // Verify upload success
  const successMessage = await driver.findElement(By.id('upload-success'));
  expect(await successMessage.getText()).toContain('File uploaded successfully');
} finally {
  await driver.quit();
}
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';
import path from 'path';

test('should upload a file', async ({ page }) => {
  // Navigate to the upload page
  await page.goto('https://example.com/upload');
  
  // Get the absolute path to the file
  const filePath = path.join(__dirname, 'test-files', 'example.txt');
  
  // Upload the file
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('text=Choose File');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(filePath);
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Verify upload success
  await expect(page.locator('#upload-success')).toContainText('File uploaded successfully');
  
  // Verify file details
  const fileName = await page.textContent('.file-name');
  const fileSize = await page.textContent('.file-size');
  
  expect(fileName).toBe('example.txt');
  expect(parseInt(fileSize)).toBeGreaterThan(0);
});
```

### Multiple File Upload

#### Selenium
```typescript
// ... (previous setup code)

// Get absolute paths to multiple files
const file1 = path.join(__dirname, 'test-files', 'file1.txt');
const file2 = path.join(__dirname, 'test-files', 'file2.jpg');
const file3 = path.join(__dirname, 'test-files', 'document.pdf');

// Upload multiple files
const fileInput = await driver.findElement(By.css('input[type="file"][multiple]'));
await fileInput.sendKeys(`${file1}\n${file2}\n${file3}`);

// Verify file count
const fileCount = await driver.executeScript(
  'return document.querySelector("input[type=\"file\"]").files.length'
);
expect(fileCount).toBe(3);
```

#### Playwright
```typescript
test('should upload multiple files', async ({ page }) => {
  await page.goto('https://example.com/upload-multiple');
  
  // Get absolute paths to multiple files
  const file1 = path.join(__dirname, 'test-files', 'file1.txt');
  const file2 = path.join(__dirname, 'test-files', 'file2.jpg');
  const file3 = path.join(__dirname, 'test-files', 'document.pdf');
  
  // Upload multiple files
  await page.setInputFiles('input[type="file"]', [file1, file2, file3]);
  
  // Verify file count
  const fileCount = await page.evaluate(() => {
    const input = document.querySelector('input[type="file"]');
    return input ? input.files.length : 0;
  });
  
  expect(fileCount).toBe(3);
  
  // Verify file names
  const fileNames = await page.$$eval('.file-item .name', elements => 
    elements.map(el => el.textContent)
  );
  
  expect(fileNames).toContain('file1.txt');
  expect(fileNames).toContain('file2.jpg');
  expect(fileNames).toContain('document.pdf');
});
```

### File Download

#### Selenium
```typescript
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

// Configure Chrome to download files to a specific directory
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const prefs = new Map();
prefs.set('download.default_directory', downloadDir);
prefs.set('download.prompt_for_download', false);
prefs.set('download.directory_upgrade', true);
prefs.set('safebrowsing.enabled', true);

const options = new chrome.Options();
options.setUserPreferences(Object.fromEntries(prefs));
options.addArguments('--safebrowsing-disable-download-protection');

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

try {
  // Navigate to the download page
  await driver.get('https://example.com/download');
  
  // Click the download link
  const downloadLink = await driver.findElement(By.linkText('Download Report'));
  const downloadHref = await downloadLink.getAttribute('href');
  const fileName = path.basename(downloadHref);
  const filePath = path.join(downloadDir, fileName);
  
  // Delete file if it already exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  // Click to download
  await downloadLink.click();
  
  // Wait for download to complete (with timeout)
  const maxWaitTime = 30000; // 30 seconds
  const startTime = Date.now();
  let fileExists = false;
  
  while ((Date.now() - startTime) < maxWaitTime) {
    if (fs.existsSync(filePath)) {
      fileExists = true;
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Verify download
  expect(fileExists).toBe(true);
  expect(fs.statSync(filePath).size).toBeGreaterThan(0);
  
  // Verify file content if needed
  const fileContent = fs.readFileSync(filePath, 'utf8');
  expect(fileContent).toContain('Expected content');
  
} finally {
  await driver.quit();
}
```

#### Playwright
```typescript
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('should download a file', async ({ page, browser }) => {
  // Set up download path
  const downloadDir = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  // Create a new context with download options
  const context = await browser.newContext({
    acceptDownloads: true,
    downloadPath: downloadDir
  });
  
  const newPage = await context.newPage();
  
  try {
    // Navigate to the download page
    await newPage.goto('https://example.com/download');
    
    // Start waiting for download before clicking
    const downloadPromise = newPage.waitForEvent('download');
    await newPage.click('text=Download Report');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Get the suggested filename
    const suggestedFilename = download.suggestedFilename();
    const filePath = path.join(downloadDir, suggestedFilename);
    
    // Wait for download to complete
    await download.saveAs(filePath);
    
    // Verify download
    expect(fs.existsSync(filePath)).toBe(true);
    
    // Get file info
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
    
    // Verify file content if needed
    const fileContent = fs.readFileSync(filePath, 'utf8');
    expect(fileContent).toContain('Expected content');
    
  } finally {
    await context.close();
  }
});
```

### Handling File Upload Dialogs

#### Selenium
```typescript
// For handling native dialogs, you typically need to use a library like AutoIT or Robot
// or configure the browser to auto-accept file dialogs

// Example using Chrome's auto-open-file-dialog capability
const options = new chrome.Options();
options.setUserPreferences({
  'profile.default_content_settings.popups': 0,
  'download.prompt_for_download': false,
  'safebrowsing.enabled': true
});

// Then use sendKeys as shown in the basic example
```

#### Playwright
```typescript
test('should handle file upload dialog', async ({ page }) => {
  await page.goto('https://example.com/upload-dialog');
  
  // Set up file chooser handling
  await page.setContent(`
    <input type="file" id="file-upload" style="display: none;" />
    <button onclick="document.getElementById('file-upload').click()">Choose File</button>
  `);
  
  // Set up file chooser handler
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('button')
  ]);
  
  // Handle the file chooser
  await fileChooser.setFiles([
    path.join(__dirname, 'test-files', 'example.txt')
  ]);
  
  // Verify the file was selected
  const fileName = await page.$eval('#file-upload', (el: HTMLInputElement) => 
    el.files?.length ? el.files[0].name : ''
  );
  
  expect(fileName).toBe('example.txt');
});
```

### Testing File Upload Validation

#### Selenium
```typescript
// Test file type validation
const invalidFile = path.join(__dirname, 'test-files', 'invalid.exe');

// Try to upload an invalid file type
const fileInput = await driver.findElement(By.css('input[type="file"]'));
await fileInput.sendKeys(invalidFile);

// Verify error message
const errorMessage = await driver.findElement(By.css('.error-message'));
expect(await errorMessage.getText()).toContain('Invalid file type');

// Test file size validation
const largeFile = path.join(__dirname, 'test-files', 'large-file.jpg');
await fileInput.sendKeys(largeFile);

// Verify size validation error
const sizeError = await driver.findElement(By.css('.size-error'));
expect(await sizeError.getText()).toContain('File is too large');
```

#### Playwright
```typescript
test('should validate file uploads', async ({ page }) => {
  await page.goto('https://example.com/upload-validate');
  
  // Test file type validation
  const invalidFile = path.join(__dirname, 'test-files', 'invalid.exe');
  await page.setInputFiles('input[type="file"]', invalidFile);
  
  await expect(page.locator('.error-message')).toContainText('Invalid file type');
  
  // Test file size validation
  const largeFile = path.join(__dirname, 'test-files', 'large-file.jpg');
  await page.setInputFiles('input[type="file"]', largeFile);
  
  await expect(page.locator('.size-error')).toContainText('File is too large');
  
  // Test valid file
  const validFile = path.join(__dirname, 'test-files', 'valid.pdf');
  await page.setInputFiles('input[type="file"]', validFile);
  
  await expect(page.locator('.file-name')).toContainText('valid.pdf');
  await expect(page.locator('.error-message')).not.toBeVisible();
});
```

### Drag and Drop File Upload

#### Selenium
```typescript
// Using JavaScript to simulate drag and drop
const filePath = path.join(__dirname, 'test-files', 'drag-me.txt');
const fileInput = await driver.findElement(By.css('.drop-zone'));

// Create a data transfer object
const fileList = `
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(new File(['test'], 'drag-me.txt', { type: 'text/plain' }));
  return dataTransfer.files;
`;

// Set the files property of the input
await driver.executeScript(`
  const input = arguments[0];
  const files = ${fileList};
  input.files = files;
  
  // Dispatch the drop event
  const event = new Event('drop', { bubbles: true });
  event.dataTransfer = { files };
  input.dispatchEvent(event);
`, fileInput);

// Verify file was added
const fileName = await driver.findElement(By.css('.file-name'));
expect(await fileName.getText()).toBe('drag-me.txt');
```

#### Playwright
```typescript
test('should handle drag and drop file upload', async ({ page }) => {
  await page.goto('https://example.com/drag-drop-upload');
  
  // Create a buffer with the file content
  const buffer = Buffer.from('test file content');
  
  // Set up the DataTransfer and File
  const dataTransfer = await page.evaluateHandle((data) => {
    const dt = new DataTransfer();
    const file = new File([data], 'drag-me.txt', { type: 'text/plain' });
    dt.items.add(file);
    return dt;
  }, buffer);
  
  // Dispatch the drop event
  await page.dispatchEvent('.drop-zone', 'drop', { dataTransfer });
  
  // Verify file was added
  await expect(page.locator('.file-name')).toContainText('drag-me.txt');
  
  // Alternative approach using the file chooser
  const filePath = path.join(__dirname, 'test-files', 'drag-me.txt');
  await page.dragAndDropFile('.drop-zone', filePath);
  
  await expect(page.locator('.file-name').nth(1)).toContainText('drag-me.txt');
});
```

### Best Practices for File Upload/Download Testing

1. **Test Different File Types**: Test with various file types (images, documents, archives) to ensure proper handling.

2. **Test File Sizes**: Include tests with very small and large files to verify size validations.

3. **Clean Up**: Always clean up downloaded files after tests to prevent disk space issues.

4. **Verify File Integrity**: When possible, verify the content of uploaded/downloaded files matches expected content.

5. **Handle Timeouts**: Implement proper timeouts for file operations that might take longer.

6. **Test Error Cases**: 
   - Invalid file types
   - Files that are too large
   - Corrupted files
   - Network interruptions during upload/download

7. **Security Testing**:
   - Test for path traversal vulnerabilities
   - Verify proper file type checking on the server
   - Test for malicious file uploads

8. **Performance Testing**:
   - Test with multiple concurrent uploads
   - Monitor memory usage with large files
   - Test upload resumption after network failure

9. **Cross-Browser Testing**: File handling can vary across browsers, so test on all target browsers.

10. **Accessibility**: Ensure file inputs have proper labels and error messages are accessible.

### Example: Comprehensive File Upload/Download Test Suite

```typescript
// tests/file-handling.spec.ts
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('File Handling', () => {
  const downloadDir = path.join(__dirname, 'downloads');
  const testFilesDir = path.join(__dirname, 'test-files');
  
  // Create test files if they don't exist
  test.beforeAll(async () => {
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
      
      // Create test files
      fs.writeFileSync(path.join(testFilesDir, 'small.txt'), 'This is a small text file');
      
      // Create a larger file (1MB)
      const largeContent = 'x'.repeat(1024 * 1024);
      fs.writeFileSync(path.join(testFilesDir, 'large.txt'), largeContent);
    }
    
    // Ensure download directory exists
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
  });
  
  test.afterEach(async () => {
    // Clean up downloaded files after each test
    const files = fs.readdirSync(downloadDir);
    for (const file of files) {
      fs.unlinkSync(path.join(downloadDir, file));
    }
  });
  
  test('should upload a single file', async ({ page }) => {
    await page.goto('https://example.com/upload');
    
    // Upload file
    const filePath = path.join(testFilesDir, 'small.txt');
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('.upload-success')).toBeVisible();
    await expect(page.locator('.file-name')).toContainText('small.txt');
  });
  
  test('should validate file type', async ({ page }) => {
    await page.goto('https://example.com/upload');
    
    // Create a file with invalid extension
    const invalidFile = path.join(testFilesDir, 'invalid.exe');
    fs.writeFileSync(invalidFile, 'malicious content');
    
    // Try to upload
    await page.setInputFiles('input[type="file"]', invalidFile);
    
    // Verify error
    await expect(page.locator('.error-message'))
      .toContainText('Only image and document files are allowed');
      
    // Clean up
    fs.unlinkSync(invalidFile);
  });
  
  test('should handle large file uploads', async ({ page }) => {
    await page.goto('https://example.com/upload');
    
    // Upload large file
    const largeFile = path.join(testFilesDir, 'large.txt');
    await page.setInputFiles('input[type="file"]', largeFile);
    
    // Verify upload progress
    await expect(page.locator('.progress-bar')).toBeVisible();
    
    // Wait for upload to complete
    await expect(page.locator('.upload-complete')).toBeVisible({ timeout: 60000 });
    
    // Verify file size
    const fileSize = await page.textContent('.file-size');
    expect(parseInt(fileSize)).toBeGreaterThan(1024 * 1024); // > 1MB
  });
  
  test('should download a file', async ({ page, browser }) => {
    // Create a new context with download options
    const context = await browser.newContext({
      acceptDownloads: true,
      downloadPath: downloadDir
    });
    
    const newPage = await context.newPage();
    
    try {
      await newPage.goto('https://example.com/download');
      
      // Start waiting for download
      const downloadPromise = newPage.waitForEvent('download');
      await newPage.click('text=Download Report');
      
      // Wait for download to start and save
      const download = await downloadPromise;
      const suggestedFilename = download.suggestedFilename();
      const filePath = path.join(downloadDir, suggestedFilename);
      await download.saveAs(filePath);
      
      // Verify download
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.statSync(filePath).size).toBeGreaterThan(0);
      
    } finally {
      await context.close();
    }
  });
  
  test('should handle drag and drop upload', async ({ page }) => {
    await page.goto('https://example.com/drag-drop-upload');
    
    // Create a test file
    const filePath = path.join(testFilesDir, 'drag-me.txt');
    fs.writeFileSync(filePath, 'Drag and drop test');
    
    // Simulate drag and drop
    await page.dragAndDropFile('.drop-zone', filePath);
    
    // Verify file was added
    await expect(page.locator('.file-name')).toContainText('drag-me.txt');
    
    // Verify file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    expect(fileContent).toBe('Drag and drop test');
  });
  
  test('should show upload progress', async ({ page }) => {
    await page.goto('https://example.com/upload');
    
    // Mock slow upload
    await page.route('**/upload', async (route) => {
      const headers = { 'Content-Type': 'application/json' };
      const response = { success: true };
      
      // Delay the response to simulate upload progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await route.fulfill({
        status: 200,
        headers,
        body: JSON.stringify(response)
      });
    });
    
    // Upload file
    const filePath = path.join(testFilesDir, 'small.txt');
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Verify progress updates
    await expect(page.locator('.progress-bar')).toBeVisible();
    
    // Wait for completion
    await expect(page.locator('.upload-complete')).toBeVisible({ timeout: 5000 });
  });
});
```
// Selenium
const fileInput = await driver.findElement(By.css('input[type="file"]'));
await fileInput.sendKeys('/path/to/file');

## Modern Playwright Features (2024/2025)

### Clock API and Time Manipulation

```typescript
// Clock API for time-based testing
test('should handle time-based functionality', async ({ page }) => {
  // Initialize clock at specific time
  await page.clock.install({ time: new Date('2024-01-01T10:00:00') });
  
  await page.goto('https://example.com');
  
  // Fast forward time by 30 minutes
  await page.clock.fastForward('30:00');
  
  // Verify time-based changes
  await expect(page.locator('.time-display')).toHaveText('10:30 AM');
  
  // Pause time at specific point
  await page.clock.pauseAt(new Date('2024-01-01T12:00:00'));
  
  // Resume normal time flow
  await page.clock.resume();
});

// Test with different time zones
test('should handle timezone changes', async ({ page }) => {
  await page.clock.install({ 
    time: new Date('2024-01-01T10:00:00'),
    timezone: 'America/New_York' 
  });
  
  await page.goto('https://example.com');
  await expect(page.locator('.timezone')).toHaveText('EST');
});
```

### Enhanced File Upload - Directory Support

```typescript
// Directory upload (2024+ feature)
test('should upload entire directory', async ({ page }) => {
  await page.goto('https://example.com/upload');
  
  // Upload directory for webkitdirectory input
  await page.locator('input[type="file"][webkitdirectory]').setInputFiles([
    {
      name: 'folder/file1.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('File 1 content')
    },
    {
      name: 'folder/subfolder/file2.txt', 
      mimeType: 'text/plain',
      buffer: Buffer.from('File 2 content')
    }
  ]);
  
  await page.click('#upload-button');
  await expect(page.locator('.upload-success')).toBeVisible();
});
```

### Aria Snapshots and Accessibility Improvements

```typescript
// Aria snapshot testing (2024+)
test('should match aria structure', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Generate aria snapshot with references
  const snapshot = await page.locator('.main-content').ariaSnapshot({
    ref: true // Generate reference IDs for elements
  });
  
  expect(snapshot).toMatchSnapshot('main-content-aria.txt');
  
  // Use aria snapshot for strict matching
  await expect(page.locator('.navigation')).toMatchAriaSnapshot(`
    - banner
      - link "Home"
      - link "About" /url
      - link "Contact" /children
        - text "Get in touch"
  `);
});
```

### New Locator Methods and Improvements

```typescript
// Enhanced locator capabilities (2024+)
test('should use new locator methods', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Describe locator for better debugging
  const button = page.locator('button.primary');
  console.log(button.describe()); // Outputs: "locator('button.primary')"
  
  // Check for specific CSS class
  await expect(page.locator('.card')).toContainClass('active');
  
  // Enhanced text matching with ignore case
  await expect(page).toHaveURL(/dashboard/i, { ignoreCase: true });
  
  // Wait for specific locator states
  await page.locator('#loading').waitFor({ state: 'hidden' });
  await page.locator('.content').waitFor({ state: 'visible' });
});
```

### API Testing Integration

```typescript
// API testing with Playwright (2024+)
test('should test API endpoints', async ({ request }) => {
  // Configure API context with redirects control
  const apiContext = await request.newContext({
    baseURL: 'https://api.example.com',
    maxRedirects: 5 // New 2024+ option
  });
  
  // Test API endpoints
  const response = await apiContext.get('/users');
  expect(response.status()).toBe(200);
  
  const users = await response.json();
  expect(users).toHaveLength(10);
  
  // Test with different HTTP methods
  const postResponse = await apiContext.post('/users', {
    data: { name: 'Test User', email: 'test@example.com' }
  });
  expect(postResponse.status()).toBe(201);
});
```

## Mobile Device Emulation and Touch Gestures

### Mobile Device Emulation

#### Selenium 4 - Mobile Emulation
```typescript
import { Builder } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';

// Chrome mobile emulation
const mobileEmulation = {
  deviceName: 'iPhone 12 Pro'
};

// Or custom mobile settings
const customMobile = {
  deviceMetrics: {
    width: 375,
    height: 812,
    pixelRatio: 3
  },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
};

const chromeOptions = new ChromeOptions()
  .setMobileEmulation(mobileEmulation)
  .addArguments('--disable-dev-shm-usage');

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions)
  .build();
```

#### Playwright - Mobile Device Emulation
```typescript
import { chromium, devices } from 'playwright';

// Use predefined device
const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['iPhone 12 Pro']
});
const page = await context.newPage();

// Custom mobile viewport
const customContext = await browser.newContext({
  viewport: { width: 375, height: 812 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: 'en-US',
  timezoneId: 'America/New_York'
});

// Test multiple devices
const devices = ['iPhone 12 Pro', 'Samsung Galaxy S21', 'iPad Pro'];
for (const deviceName of devices) {
  const context = await browser.newContext({
    ...devices[deviceName]
  });
  const page = await context.newPage();
  // Run tests for each device
}
```

### Touch Gestures and Mobile Interactions

#### Selenium 4 - Touch Actions
```typescript
import { Builder, By } from 'selenium-webdriver';
import { Actions } from 'selenium-webdriver';

// Basic touch actions (limited support)
const actions = new Actions(driver);
const element = await driver.findElement(By.id('touchable'));

// Tap (click equivalent)
await actions.click(element).perform();

// Long press (using mouse down/up)
await actions.mouseDown(element).pause(1000).mouseUp(element).perform();

// Drag and drop
const sourceElement = await driver.findElement(By.id('source'));
const targetElement = await driver.findElement(By.id('target'));
await actions.dragAndDrop(sourceElement, targetElement).perform();
```

#### Playwright - Advanced Touch Gestures
```typescript
// Tap gestures
test('should handle touch gestures', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Single tap
  await page.locator('#button').tap();
  
  // Double tap
  await page.locator('#button').dblclick();
  
  // Long press
  await page.locator('#button').tap({ timeout: 1000 });
  
  // Tap at specific coordinates
  await page.tap('#canvas', { position: { x: 100, y: 200 } });
});

// Swipe gestures
test('should handle swipe gestures', async ({ page }) => {
  await page.goto('https://example.com/swipe');
  
  // Swipe left
  await page.locator('.swipeable').swipeLeft();
  
  // Swipe right
  await page.locator('.swipeable').swipeRight();
  
  // Custom swipe with coordinates
  await page.touchscreen.swipe(
    { x: 300, y: 400 }, // start
    { x: 100, y: 400 }, // end
    { steps: 10 }       // smooth swipe
  );
});

// Pinch and zoom
test('should handle pinch and zoom', async ({ page }) => {
  await page.goto('https://example.com/map');
  
  // Pinch to zoom out
  await page.touchscreen.pinch(
    { x: 200, y: 200 }, // center
    0.5                 // scale factor
  );
  
  // Zoom in
  await page.touchscreen.pinch(
    { x: 200, y: 200 },
    2.0
  );
});

// Multi-touch gestures
test('should handle multi-touch', async ({ page }) => {
  await page.goto('https://example.com/multi-touch');
  
  // Two-finger scroll
  await page.touchscreen.scroll(
    { x: 200, y: 300 },
    { x: 200, y: 100 }
  );
  
  // Rotation gesture
  await page.touchscreen.rotate(
    { x: 200, y: 200 }, // center
    45                  // degrees
  );
});
```

## Dialog Handling (Alerts, Confirms, Prompts)

### Selenium 4 - Alert Handling
```typescript
import { Builder, By, until } from 'selenium-webdriver';

// Handle JavaScript alerts
test('should handle alerts', async () => {
  await driver.get('https://example.com');
  
  // Click button that triggers alert
  await driver.findElement(By.id('alert-button')).click();
  
  // Wait for alert to appear
  await driver.wait(until.alertIsPresent(), 5000);
  
  // Get alert text
  const alert = await driver.switchTo().alert();
  const alertText = await alert.getText();
  expect(alertText).toBe('Are you sure?');
  
  // Accept alert
  await alert.accept();
});

// Handle confirm dialog
test('should handle confirm dialog', async () => {
  await driver.get('https://example.com');
  
  await driver.findElement(By.id('confirm-button')).click();
  await driver.wait(until.alertIsPresent(), 5000);
  
  const alert = await driver.switchTo().alert();
  
  // Dismiss (cancel) the dialog
  await alert.dismiss();
  
  // Or accept it
  // await alert.accept();
});

// Handle prompt dialog
test('should handle prompt dialog', async () => {
  await driver.get('https://example.com');
  
  await driver.findElement(By.id('prompt-button')).click();
  await driver.wait(until.alertIsPresent(), 5000);
  
  const alert = await driver.switchTo().alert();
  
  // Enter text in prompt
  await alert.sendKeys('Test input');
  await alert.accept();
});
```

### Playwright - Dialog Handling
```typescript
// Handle all types of dialogs
test('should handle dialogs', async ({ page }) => {
  // Set up dialog handler before triggering
  page.on('dialog', async (dialog) => {
    console.log(`Dialog type: ${dialog.type()}`);
    console.log(`Dialog message: ${dialog.message()}`);
    console.log(`Dialog default value: ${dialog.defaultValue()}`);
    
    // Handle different dialog types
    if (dialog.type() === 'alert') {
      await dialog.accept();
    } else if (dialog.type() === 'confirm') {
      await dialog.accept(); // or dialog.dismiss()
    } else if (dialog.type() === 'prompt') {
      await dialog.accept('User input text');
    }
  });
  
  await page.goto('https://example.com');
  
  // Trigger different dialogs
  await page.click('#alert-button');
  await page.click('#confirm-button');
  await page.click('#prompt-button');
});

// Handle specific dialog types
test('should handle specific dialog types', async ({ page }) => {
  // Handle alerts
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') {
      expect(dialog.message()).toBe('Operation completed!');
      await dialog.accept();
    }
  });
  
  // Handle confirms with conditional logic
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'confirm') {
      if (dialog.message().includes('Delete')) {
        await dialog.accept(); // Confirm deletion
      } else {
        await dialog.dismiss(); // Cancel other actions
      }
    }
  });
  
  await page.goto('https://example.com');
  await page.click('#delete-button');
});
```

## Shadow DOM Handling

### Selenium 4 - Shadow DOM
```typescript
import { Builder, By } from 'selenium-webdriver';

// Access shadow DOM elements
test('should access shadow DOM', async () => {
  await driver.get('https://example.com');
  
  // Find shadow host element
  const shadowHost = await driver.findElement(By.css('.shadow-host'));
  
  // Get shadow root
  const shadowRoot = await driver.executeScript(
    'return arguments[0].shadowRoot',
    shadowHost
  );
  
  // Find element inside shadow DOM
  const shadowElement = await shadowRoot.findElement(By.css('.shadow-content'));
  await shadowElement.click();
  
  // Get text from shadow DOM element
  const shadowText = await shadowElement.getText();
  expect(shadowText).toBe('Shadow DOM content');
});

// Handle nested shadow DOM
test('should handle nested shadow DOM', async () => {
  await driver.get('https://example.com');
  
  const outerShadowHost = await driver.findElement(By.css('.outer-shadow'));
  const outerShadowRoot = await driver.executeScript(
    'return arguments[0].shadowRoot',
    outerShadowHost
  );
  
  const innerShadowHost = await outerShadowRoot.findElement(By.css('.inner-shadow'));
  const innerShadowRoot = await driver.executeScript(
    'return arguments[0].shadowRoot',
    innerShadowHost
  );
  
  const deepElement = await innerShadowRoot.findElement(By.css('.deep-content'));
  await deepElement.click();
});
```

### Playwright - Shadow DOM
```typescript
// Playwright handles shadow DOM automatically
test('should handle shadow DOM seamlessly', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Playwright automatically pierces shadow DOM
  await page.locator('.shadow-host .shadow-content').click();
  
  // Verify shadow DOM content
  await expect(page.locator('.shadow-host .shadow-content')).toHaveText('Shadow DOM content');
  
  // Handle multiple shadow DOM levels
  await page.locator('.outer-shadow .inner-shadow .deep-content').click();
});

// Explicit shadow DOM handling if needed
test('should handle shadow DOM explicitly', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Use CSS selector that pierces shadow DOM
  await page.locator('css=.shadow-host >> css=.shadow-content').click();
  
  // Use text selector that pierces shadow DOM
  await page.locator('text=Shadow DOM content').click();
  
  // Use XPath that pierces shadow DOM
  await page.locator('xpath=//div[@class="shadow-host"]//span[text()="Shadow content"]').click();
});
```

## Best Practices

### General Best Practices

1. **Use Page Object Model (POM)**
   - Encapsulate page-specific selectors and actions in dedicated classes
   - Improves test maintainability and reduces code duplication

2. **Implement Proper Waiting Strategies**
   - Prefer built-in waiting mechanisms over static waits
   - Use explicit waits for better test reliability

3. **Handle Test Data Effectively**
   - Use fixtures or factories for test data generation
   - Clean up test data after test execution

4. **Write Atomic and Independent Tests**
   - Each test should be able to run independently
   - Avoid test dependencies that can cause flakiness

5. **Implement Proper Error Handling**
   - Add meaningful error messages
   - Implement retry mechanisms for flaky tests

### Playwright-Specific Best Practices

1. **Leverage Playwright's Auto-Waiting**
   - Take advantage of built-in waiting for elements to be actionable
   - Use `waitForSelector` only when necessary

2. **Use Network Idle**
   - Utilize `waitForLoadState('networkidle')` for SPAs
   - Helps ensure all network requests are complete

3. **Optimize Browser Contexts**
   - Reuse browser contexts when possible
   - Isolate tests using separate contexts

4. **Use Test Fixtures**
   - Leverage Playwright's test fixtures for common setup/teardown
   - Share common test utilities through fixtures

5. **Parallel Test Execution**
   - Run tests in parallel for faster execution
   - Use worker isolation for stability

## Migration Tips

1. **Start Small**
   - Begin with simple test cases before moving to complex scenarios
   - Focus on high-value tests first

2. **Incremental Migration**
   - Migrate tests in small batches
   - Run both Selenium and Playwright tests in parallel during migration

3. **Leverage TypeScript**
   - Use TypeScript's type system to catch errors early
   - Create custom types for your page objects and test data

4. **Update CI/CD Pipelines**
   - Update your CI/CD configuration for Playwright
   - Consider using Playwright's built-in test runner

5. **Team Training**
   - Provide training for team members on Playwright's concepts
   - Document common patterns and best practices

## Conclusion

This specification has provided a comprehensive guide for migrating from Selenium WebDriver to Playwright in TypeScript. Key benefits of Playwright include:

- **Modern API**: More intuitive and developer-friendly syntax
- **Built-in Waiting**: Eliminates the need for explicit waits in most cases
- **Multi-browser Support**: Consistent API across Chromium, Firefox, and WebKit
- **Powerful Features**: Built-in network interception, file handling, and mobile emulation
- **Better Performance**: Faster test execution and more reliable selectors

By following the patterns and best practices outlined in this document, teams can successfully migrate their test automation suite to Playwright, resulting in more reliable, maintainable, and faster tests.

For more information, refer to the official documentation:
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Selenium to Playwright Migration Guide](https://playwright.dev/docs/migration-guide)
- [Playwright TypeScript API](https://playwright.dev/docs/api/class-playwright)

// Playwright
await page.setInputFiles('input[type="file"]', '/path/to/file');

// Download handling
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#download-btn')
]);
await download.saveAs('/path/to/save');
```

## Error Handling

```typescript
// Selenium
try {
  await driver.findElement(By.id('nonexistent'));
} catch (NoSuchElementError) {
  // Handle missing element
}

// Playwright
try {
  await page.locator('#nonexistent').click({ timeout: 5000 });
} catch (TimeoutError) {
  // Handle timeout
}

// Or use conditional actions
if (await page.locator('#optional').isVisible()) {
  await page.locator('#optional').click();
}
```

## Cleanup

```typescript
// Selenium
await driver.quit();

// Playwright
await page.close();
await context.close();
await browser.close();
```

## Migration Best Practices

### 1. Leverage Auto-Waiting
Replace explicit waits with Playwright's built-in auto-waiting:
```typescript
// Instead of
await driver.wait(until.elementIsClickable(element), 10000);
await element.click();

// Use
await page.locator('#element').click(); // Auto-waits for clickability
```

### 2. Use Modern Selectors
```typescript
// Instead of complex XPath
By.xpath('//button[contains(text(), "Submit")]')

// Use text selectors
page.locator('button:has-text("Submit")')
// or
page.locator('text=Submit')
```

### 3. Leverage Browser Context
```typescript
// Create isolated contexts for different test scenarios
const adminContext = await browser.newContext({ 
  storageState: 'admin-state.json' 
});
const userContext = await browser.newContext({ 
  storageState: 'user-state.json' 
});
```

### 4. Use Built-in Assertions
Replace external assertion libraries with Playwright's built-in expect:
```typescript
// More reliable with automatic retries
await expect(page.locator('#status')).toHaveText('Success');
```

### 5. Handle Multiple Elements
```typescript
// Selenium
const elements = await driver.findElements(By.css('.item'));
for (const element of elements) {
  await element.click();
}

// Playwright
await page.locator('.item').nth(0).click();
// or iterate
const count = await page.locator('.item').count();
for (let i = 0; i < count; i++) {
  await page.locator('.item').nth(i).click();
}
```

## Performance Considerations

1. **Parallel Execution**: Playwright supports running tests in parallel across multiple browser contexts
2. **Faster Execution**: Built-in waiting reduces unnecessary delays
3. **Network Control**: Mock external dependencies for faster, more reliable tests
4. **Browser Context Reuse**: Reuse contexts when possible to avoid setup overhead

## Compatibility Notes

- Playwright requires Node.js 14+ 
- Supports Chromium, Firefox, and WebKit
- Some Selenium-specific features (like Actions API) have different implementations
- Network interception is more powerful in Playwright
- Mobile emulation is built-in with Playwright