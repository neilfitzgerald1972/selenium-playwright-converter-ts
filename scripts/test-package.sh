#!/usr/bin/env bash

# Test Package Installation Script
# This script tests the npm package installation and CLI functionality
# before publishing to ensure everything works correctly

set -e

echo "🧪 Testing Package Installation..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Clean up any previous test artifacts
echo "📦 Cleaning up previous test artifacts..."
rm -f selenium-playwright-converter-ts-*.tgz

# Build the project
echo "🔨 Building the project..."
npm run build

# Create the package
echo "📦 Creating npm package..."
npm pack

# Get the package filename
PACKAGE_FILE=$(ls selenium-playwright-converter-ts-*.tgz | head -n 1)

if [ -z "$PACKAGE_FILE" ]; then
    echo -e "${RED}❌ Failed to create package file${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Package created: $PACKAGE_FILE${NC}"

# Install the package globally
echo "🌍 Installing package globally..."
npm install -g "./$PACKAGE_FILE"

# Test CLI commands
echo "🧪 Testing CLI commands..."

# Test version command
echo -n "Testing 'sel2pw --version'... "
if sel2pw --version > /dev/null 2>&1; then
    VERSION=$(sel2pw --version)
    echo -e "${GREEN}✓ Version: $VERSION${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    npm uninstall -g selenium-playwright-converter-ts
    exit 1
fi

# Test help command
echo -n "Testing 'sel2pw --help'... "
if sel2pw --help > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    npm uninstall -g selenium-playwright-converter-ts
    exit 1
fi

# Test alias command
echo -n "Testing 'selenium-to-playwright --help'... "
if selenium-to-playwright --help > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    npm uninstall -g selenium-playwright-converter-ts
    exit 1
fi

# Create a test file for conversion
TEST_DIR=$(mktemp -d)
TEST_FILE="$TEST_DIR/test-selenium.js"

cat > "$TEST_FILE" << 'EOF'
const { Builder, By } = require('selenium-webdriver');

async function test() {
    const driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://example.com');
    const element = await driver.findElement(By.id('test'));
    await element.click();
    await driver.quit();
}
EOF

# Test dry-run conversion
echo -n "Testing conversion with --dry-run... "
if sel2pw "$TEST_FILE" --dry-run > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    npm uninstall -g selenium-playwright-converter-ts
    rm -rf "$TEST_DIR"
    exit 1
fi

# Test actual conversion
echo -n "Testing actual file conversion... "
OUTPUT_FILE="$TEST_DIR/test-selenium-converted.js"
if sel2pw "$TEST_FILE" -o "$OUTPUT_FILE" > /dev/null 2>&1; then
    if [ -f "$OUTPUT_FILE" ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}❌ Output file not created${NC}"
        npm uninstall -g selenium-playwright-converter-ts
        rm -rf "$TEST_DIR"
        exit 1
    fi
else
    echo -e "${RED}❌ Conversion failed${NC}"
    npm uninstall -g selenium-playwright-converter-ts
    rm -rf "$TEST_DIR"
    exit 1
fi

# Verify converted content
echo -n "Verifying converted content... "
if grep -q "playwright" "$OUTPUT_FILE" && grep -q "page.goto" "$OUTPUT_FILE"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}❌ Converted content doesn't look right${NC}"
    cat "$OUTPUT_FILE"
    npm uninstall -g selenium-playwright-converter-ts
    rm -rf "$TEST_DIR"
    exit 1
fi

# Clean up
echo "🧹 Cleaning up..."
npm uninstall -g selenium-playwright-converter-ts
rm -rf "$TEST_DIR"
rm -f "$PACKAGE_FILE"

echo -e "${GREEN}✅ All package tests passed!${NC}"
echo -e "${YELLOW}📦 Package is ready for publishing${NC}"