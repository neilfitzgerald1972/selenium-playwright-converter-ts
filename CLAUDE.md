# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Development
- `npm run build` - Build the TypeScript project to dist/
- `npm run dev` - Run the CLI in development mode using ts-node
- `npm run clean` - Remove dist/ and coverage/ directories

### Testing
- `npm test` - Run all tests using Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode with coverage
- `npm run test:update` - Update Jest snapshots
- `npx jest tests/element-finding.test.ts` - Run a specific test file

### Code Quality
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking without emitting files
- `npm run format` - Format code with Prettier
- `npm run prettier` - Check code formatting with Prettier

### Usage
- `npm run start` - Run the built CLI tool
- `sel2pw` or `selenium-to-playwright` - CLI commands (after global install)

## Project Architecture

### Core Components

**src/converter.ts** - Main conversion engine (`SeleniumToPlaywrightConverter` class)
- Handles single file and directory conversion
- Applies conversion rules in priority order
- Calculates conversion statistics and complexity scores
- Validates Selenium code and generates warnings

**src/cli.ts** - Command-line interface using Commander.js
- Supports file and directory conversion modes
- Provides dry-run functionality for previewing changes
- Handles error reporting with custom error types
- Auto-detects file vs directory inputs

**src/types.ts** - TypeScript interfaces and types
- `ConversionRule` - Defines regex patterns, replacements, priorities, and categories
- `ConversionResult` - Results from single file conversion with applied rules tracking
- `ConversionStatistics` - Metrics about conversion complexity and rule interference
- `DirectoryConversionResult` - Results from directory conversion

### Conversion Rules System

**src/conversions/index.ts** - Central registry of all conversion rules
- Imports and combines rules from specialized modules
- Sorts rules by priority (highest first)
- Categories include: browser-init, element-finding, interactions, waits, etc.

**Conversion Categories (by priority):**
1. **selenium4-modern-conversions** (Priority 1000+) - Latest Selenium 4 features
2. **playwright-modern-conversions** (Priority 1000+) - Modern Playwright 2024+ features
3. **browser-init-conversions** (Priority 100-999) - WebDriver initialization → browser.launch()
4. **element-finding-conversions** (Priority 50-99) - By.* locators → page.locator()
5. **element-interaction-conversions** (Priority 50-99) - click, sendKeys → fill, click
6. **wait-conversions** (Priority 50-99) - Explicit waits → waitFor patterns
7. **navigation-conversions** (Priority 50-99) - driver.get() → page.goto()
8. **screenshot-conversions** (Priority 50-99) - takeScreenshot → screenshot
9. **advanced-interactions** (Priority 10-49) - Actions chains → complex gestures
10. **javascript-execution-conversions** (Priority 10-49) - executeScript → evaluate
11. **keyboard-conversions** (Priority 1-49) - sendKeys → keyboard actions
12. **mouse-conversions** (Priority 1-49) - Mouse actions → mouse events

### Key Design Patterns

**Rule Priority System**: Rules are executed in priority order (100-1000+) to ensure correct transformation sequence. Browser initialization rules run first, followed by element finding, then interactions.

**Pattern Matching**: Each conversion rule uses regex patterns to match Selenium code and string/function replacements to generate Playwright equivalents.

**Manual Review Flagging**: Rules can mark conversions as requiring manual review by including TODO comments in the output.

**Statistics Tracking**: The converter tracks complexity metrics, applied rules, and categorizes conversions for reporting.

### Rule Interference Problem & Solutions

**Problem**: Multiple conversion rules can match the same code pattern, leading to malformed output where rules interfere with each other.

**Common Interference Patterns:**

1. **Sequential Rule Application**
   ```typescript
   // Original Selenium code
   driver.manage().addCookie({ name: "test", value: "value" });
   
   // Step 1: Basic cookie rule applies
   await page.context().addCookies([{ name: "test", value: "value" }]);
   
   // Step 2: Enhanced cookie rule applies to Step 1 output
   // RESULT: Malformed syntax due to double transformation
   ```

2. **Broad Pattern Matching**
   ```typescript
   // Navigation rule pattern: /(\w+)\.goto\((['"])([^'"]+)\2\)/g
   // Incorrectly matches: newPage.goto() → page.goto() (wrong conversion)
   // Should only match: driver.goto() → page.goto()
   ```

3. **Context Insensitive Matching**
   ```typescript
   // Aria rule matches inside evaluate functions
   element.evaluate(el => el.getAttribute('aria-label'))
   // Should skip 'el' context but applies anyway
   ```

**Solution Strategies Implemented:**

1. **Priority-Based Execution**
   - High priority (1000+): Modern features applied first
   - Medium priority (100-999): Core conversions
   - Low priority (1-99): Basic transformations
   - Prevents basic rules from interfering with advanced patterns

2. **Skip Logic Patterns**
   ```typescript
   replacement: (match: string, element: string): string => {
     // Skip if element name suggests evaluate context
     if (element === 'el') {
       return match; // Don't apply transformation
     }
     // Apply normal transformation
     return transformedCode;
   }
   ```

3. **Pattern Specificity**
   ```typescript
   // BAD: Too broad, matches any word
   pattern: /(\w+)\.goto\((['"])([^'"]+)\2\)/g
   
   // GOOD: Specific to WebDriver objects
   pattern: /(driver|webDriver|browser|selenium)\.goto\((['"])([^'"]+)\2\)/g
   ```

4. **Negative Lookbehinds/Lookaheads**
   ```typescript
   // Exclude already-processed patterns
   pattern: /await (\w+)\.context\(\)\.addCookies\(\[([^\]]+)\]\);?(?!\s*\/\/.*partitionKey)/g
   ```

5. **Context-Aware Validation**
   ```typescript
   // Check for nested braces indicating prior transformation
   if (cookies.includes('{ {') || cookies.split('{').length > 2) {
     return match; // Skip to avoid malformed output
   }
   ```

**Current Mitigation Status:**
- ✅ Priority system implemented across all rule categories
- ✅ Skip logic added to high-conflict areas (aria, cookies, navigation)
- ✅ Pattern specificity improved for broad matchers
- ⚠️ Some enhanced features temporarily disabled due to interference
- ✅ Comprehensive test coverage detects interference issues

**Best Practices for Adding New Rules:**
1. Use specific patterns (avoid broad `\w+` matchers)
2. Add skip logic for known conflict scenarios  
3. Set appropriate priority levels
4. Test against existing conversion outputs
5. Consider negative lookbehinds for processed patterns

### Test Organization

Tests are organized by functionality in the tests/ directory:
- `browser-init.test.ts` - Browser initialization conversions
- `element-finding.test.ts` - Element locator conversions  
- `element-interaction.test.ts` - Click, fill, and interaction conversions
- `waits-conditions.test.ts` - Wait and condition conversions
- `advanced-interactions.test.ts` - Complex gesture conversions
- `keyboard-conversions.test.ts` - Keyboard input conversions
- `mouse-actions.test.ts` - Mouse action conversions

### Build Configuration

- **TypeScript**: ES modules with Node 18+ target
- **ESLint**: TypeScript rules with Prettier integration
- **Jest**: Test runner with ES module support via experimental flags
- **Husky**: Git hooks for pre-commit linting and formatting
- **Binary**: Generates `sel2pw` and `selenium-to-playwright` CLI commands

### Development Notes

- Uses ES modules (`"type": "module"` in package.json)
- Requires Node 18+ for modern JavaScript features
- Jest tests use experimental VM modules for ES module support
- CLI uses file:// imports and proper ESM module resolution
- Conversion rules are stateless and can be applied in any order within priority levels