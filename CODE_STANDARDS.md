# Code Standards and Formatting Guidelines

This document outlines the code standards and formatting guidelines for the Florida Tax Certificate Sale Platform.

## Linting and Formatting Setup

The project uses ESLint and Prettier to enforce consistent code quality and formatting:

- **ESLint**: Enforces code quality rules and best practices
- **Prettier**: Ensures consistent code formatting
- **Husky**: Runs linting before commits
- **lint-staged**: Only runs linting on staged files

## Installing Development Tools

```bash
# Install dependencies
npm install
```

## Code Formatting Standards

This document outlines the code formatting standards for our project. Consistent formatting helps with readability and maintainability of the codebase.

## Linting and Formatting Setup

We use the following tools to enforce code quality and consistent formatting:

- **ESLint**: JavaScript/TypeScript linter that helps catch errors and enforce coding standards
- **Prettier**: Code formatter that automatically formats code to ensure consistency
- **Husky**: Git hooks tool to run linting/formatting before commits
- **lint-staged**: Run linters against staged git files

These tools are already set up in the project and configured to work together.

## Installation

All required development dependencies are already included in `package.json`. To install them, run:

```
npm install
```

## Code Formatting Standards

### General

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line Length**: Maximum 100 characters
- **Trailing Commas**: ES5 style (objects, arrays)
- **Bracket Spacing**: Yes (`{ foo: bar }` not `{foo: bar}`)
- **Arrow Function Parentheses**: Avoid when possible (`x => x` not `(x) => x`)
- **End of Line**: Auto (respects editor settings)

### Naming Conventions

- **Files**:

  - React components: PascalCase (e.g., `UserProfile.tsx`)
  - Utility files: camelCase (e.g., `formatDate.ts`)
  - Test files: Same name as the file being tested with `.test` or `.spec` suffix (e.g., `UserProfile.test.tsx`)

- **Classes**: PascalCase

  ```typescript
  class UserService {...}
  ```

- **Functions/Methods**: camelCase

  ```typescript
  function calculateTotal() {...}
  const getUserData = () => {...}
  ```

- **Variables**: camelCase

  ```typescript
  const userName = 'John';
  let itemCount = 42;
  ```

- **Constants**: UPPER_SNAKE_CASE for global constants

  ```typescript
  const MAX_RETRY_ATTEMPTS = 3;
  ```

- **Interfaces/Types**: PascalCase, prefixed with 'I' for interfaces (optional)

  ```typescript
  interface IUser {...}
  type UserRole = 'admin' | 'user';
  ```

- **React Components**: PascalCase
  ```typescript
  const UserProfile = () => {...}
  ```

## TypeScript Best Practices

- Prefer explicit types over implicit ones
- Use interfaces for object shapes that will be implemented or extended
- Use type for unions, intersections, and utility types
- Avoid using `any` when possible
- Use TypeScript's built-in utility types (e.g., `Partial<T>`, `Pick<T>`, `Omit<T>`)
- Use proper return types for functions

```typescript
// Good
function getUser(id: string): User {...}

// Avoid
function getUser(id): any {...}
```

## React Best Practices

- Use functional components with hooks instead of class components
- Use proper prop typing with TypeScript
- Use destructuring for props and state
- Use React Fragments to avoid unnecessary div wrappers
- Follow React's naming conventions for event handlers (e.g., `handleClick`, not `onClick`)

```typescript
// Good example
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

## Running Linting and Formatting

The following npm scripts are available:

- **Lint code**:

  ```
  npm run lint
  ```

- **Lint and fix code**:

  ```
  npm run lint:fix
  ```

- **Format code with Prettier**:
  ```
  npm run format
  ```

## Pre-commit Hooks

Husky is configured to run linting and formatting checks before each commit. The pre-commit hook will:

1. Run ESLint to check for errors/warnings
2. Run Prettier to format files

This ensures that all committed code meets our standards.

If you need to bypass these checks in an emergency (not recommended), you can use:

```
git commit -m "Your message" --no-verify
```

## Git Commit Standards

### Commit Frequency

To maintain code quality and make code reviews more effective, we enforce frequent, small commits:

- **Make small, focused commits** that address a single concern
- **Commit early and often** during development
- **Maximum commit size**: 300 lines of code or 10 files (enforced by pre-commit hook)
- **Ideal commit size**: 50-150 lines of code

### Commit Messages

Use conventional commit format:

```
<type>(<scope>): <short summary>

<body>

<footer>
```

Where:

- **type**: feat, fix, docs, style, refactor, test, chore
- **scope**: optional area of codebase (e.g., auth, db, ui)
- **summary**: imperative, present tense description
- **body**: optional detailed description
- **footer**: optional, for breaking changes or issue references

Examples:

```
feat(auth): implement JWT token refresh
fix(payment): resolve double-charge issue on checkout page
docs: update README with setup instructions
```

### Working with Large Changes

When implementing larger features:

1. Break work into logical chunks
2. Use feature branches
3. Create a draft PR early
4. Make frequent, small commits
5. Consider using `git add -p` to stage partial changes

### Automatic Versioning

The project uses automatic versioning with semantic versioning principles:

- Each commit automatically increments the patch version (0.0.x)
- The version is stored in a `VERSION` file in the project root
- A Git tag is created for each commit in the format `vX.Y.Z+abcdef1` (version + commit hash)

For manual version control:

- To increment minor version: `echo "X.Y+1.0" > VERSION`
- To increment major version: `echo "X+1.0.0" > VERSION`

After manually changing the version, commit the VERSION file:

```
git add VERSION
git commit -m "chore: bump version to X.Y.Z"
```

This system ensures that:

1. Every commit has a unique version number
2. The version history is easily traceable
3. Release versions can be generated automatically

## Editor Integration

### VS Code

We recommend installing the following extensions:

- ESLint
- Prettier

Configure VS Code to format on save by adding to your `settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### JetBrains IDEs (WebStorm, IntelliJ IDEA)

These IDEs have built-in support for ESLint and Prettier:

1. Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable Prettier: Settings → Languages & Frameworks → JavaScript → Prettier

Configure formatting on save: Settings → Tools → Actions on Save → check "Reformat code" and "Run ESLint --fix"
