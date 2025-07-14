# Contributing to Selenium to Playwright Converter

We're thrilled you're interested in contributing to the Selenium to Playwright Converter! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/selenium-playwright-converter-ts.git
   cd selenium-playwright-converter-ts
   ```
3. **Set up the development environment**:
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/YOUR-FEATURE-NAME
   ```

## Development Workflow

1. **Code Style**
   - Use 2 spaces for indentation
   - Use single quotes for strings
   - Follow the existing code style
   - Run `npm run format` before committing

2. **TypeScript**
   - Add proper type annotations
   - Avoid using `any` type
   - Enable strict type checking

3. **Testing**
   - Write tests for new features
   - Ensure all tests pass
   - Update tests when fixing bugs
   ```bash
   # Run tests
   npm test
   
   # Run tests in watch mode
   npm run test:watch
   ```

4. **Linting**
   - Run linter before committing
   - Fix all linting errors
   ```bash
   npm run lint
   ```

## Submitting Changes

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   
   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for test changes
   - `chore:` for maintenance tasks

2. **Push your changes**
   ```bash
   git push origin YOUR-BRANCH-NAME
   ```

3. **Create a Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Follow the PR template
   - Ensure all CI checks pass

## Code Review Process

1. A maintainer will review your PR
2. Address any feedback
3. Once approved, your changes will be merged

## Reporting Issues

When creating an issue, please include:
- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Any relevant error messages

## License

By contributing, you agree that your contributions will be licensed under the project's [LICENSE](LICENSE) file.

---

Thank you for contributing! :tada:
