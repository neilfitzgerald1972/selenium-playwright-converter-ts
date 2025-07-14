# Windsurf Configuration

This directory contains configuration files for the Windsurf tooling used in this project.

## Files

- `rules.json`: Main configuration file for project rules, coding standards, and tooling setup.

## Configuration Details

### ES Modules
- The project uses ES modules (ESM) exclusively
- All imports/exports should use ES module syntax (`import`/`export`)
- File extensions must be included in imports

### Code Style
- 2-space indentation
- Single quotes
- Trailing commas in multi-line objects/arrays
- 100 character print width
- No semicolons (except where required)

### Testing
- Jest is the test runner
- Test files should be named `*.test.ts`
- Tests should be placed next to the code they test or in `__tests__` directories
- Minimum test coverage: 80% across branches, functions, lines, and statements

### Linting
- TypeScript ESLint is used for linting
- Strict type checking is enabled
- Unused variables are treated as errors (except those prefixed with `_`)

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Lint code:
   ```bash
   npm run lint
   ```

4. Fix linting issues:
   ```bash
   npm run lint:fix
   ```

## Git Hooks

- Pre-commit: Runs lint-staged to check staged files
- Pre-push: Runs the full test suite

## Dependencies

See `rules.json` for the complete list of dependencies and their versions.
