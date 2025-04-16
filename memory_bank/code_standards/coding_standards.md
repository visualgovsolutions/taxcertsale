# Code Standards Document

## Overview
This document defines the coding standards, naming conventions, and architecture guidelines for the Florida Tax Certificate Sale platform.

## Technology Stack
- **Frontend**: React, TypeScript, Material UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cloud Infrastructure**: Microsoft Azure
- **CI/CD**: GitHub Actions

## General Coding Principles
1. **Code Readability**: Write self-documenting code with clear intent
2. **Single Responsibility**: Each function or class should have a single purpose
3. **DRY (Don't Repeat Yourself)**: Avoid code duplication
4. **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones
5. **Error Handling**: Always handle potential errors appropriately
6. **Performance**: Consider performance implications, especially for auction functions
7. **Security**: Follow security best practices, particularly for financial transactions
8. **Accessibility**: Ensure all UI components meet WCAG 2.1 AA standards

## Naming Conventions

### File Naming
- **React Components**: PascalCase (e.g., PropertyCard.tsx, BidHistory.tsx)
- **Utility Functions**: camelCase (e.g., formatCurrency.ts, validateBid.ts)
- **API Routes**: kebab-case (e.g., certificate-routes.ts, user-authentication.ts)
- **Test Files**: Same name as the file being tested with .test or .spec suffix
- **CSS/SCSS**: Same name as the component (e.g., PropertyCard.module.scss)

### Variable Naming
- **Variables & Functions**: camelCase (e.g., userId, calculateInterest())
- **Classes & Components**: PascalCase (e.g., BidManager, PropertyList)
- **Interfaces & Types**: PascalCase with descriptive names (e.g., ICertificate, PropertyDetails)
- **Constants**: UPPER_SNAKE_CASE (e.g., MAX_INTEREST_RATE, DEFAULT_BATCH_SIZE)
- **Private Variables**: Prefixed with underscore (e.g., _privateMethod(), _internalState)

### Database Naming
- **Tables**: snake_case, plural (e.g., tax_certificates, user_accounts)
- **Columns**: snake_case (e.g., property_id, certificate_number)
- **Primary Keys**: id or table_name_id for foreign keys
- **Junction Tables**: Combine both table names (e.g., users_roles)
- **Indexes**: idx_table_column

## Code Formatting

### TypeScript/JavaScript
- **Indentation**: 2 spaces
- **Line Length**: 100 characters maximum
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Required for multiline lists
- **Braces**: Same line for statements, new line for function declarations
- **File Encoding**: UTF-8
- **Line Endings**: LF (Unix-style)

### Tool Configuration
- **ESLint**: Standard configuration with TypeScript plugin
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks for linting and formatting
- **EditorConfig**: Consistent editor settings

## Architecture Guidelines

### Frontend Architecture
1. **Component Structure**:
   - Atomic design methodology (atoms, molecules, organisms, templates, pages)
   - Container/Presentational component pattern

2. **State Management**:
   - React Context API for global state
   - Redux for complex state management
   - React Query for server state

### Backend Architecture
1. **API Design**:
   - RESTful endpoint conventions
   - GraphQL for complex data queries
   - Controller-Service-Repository pattern

2. **Error Handling**:
   - Centralized error handling middleware
   - Standardized error response format
   - Error logging strategy

### API Conventions
1. **RESTful Endpoints**:
   - Use resource-oriented URLs
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - Proper status codes (200, 201, 400, 401, 403, 404, 500)
   - Consistent response format

2. **Authentication**:
   - JWT for authentication
   - Token refreshing strategy
   - Role-based access control

## Testing Standards

### Unit Testing
- Jest for both frontend and backend
- 80% minimum code coverage
- Tests should be isolated and not depend on external services
- Use mocks and stubs for external dependencies

### Integration Testing
- Test API endpoints with supertest
- Test component integration with React Testing Library
- Focus on user flows and business requirements

### End-to-End Testing
- Cypress for critical user flows
- Test real-world scenarios across the entire application
- Focus on key business processes (registration, bidding, etc.)

## Azure Infrastructure Considerations
- Follow Azure resource naming conventions
- Implement proper resource tagging for cost tracking
- Use Azure Security Center recommendations
- Configure appropriate logging and monitoring
- Implement Azure DevOps integration with GitHub Actions

## Compliance with Florida Regulations
- Ensure all code handling tax certificates complies with Florida Statutes (Chapter 197)
- Follow Florida Department of Revenue guidelines
- Implement proper audit trails for all transactions
- Maintain data retention policies as required by regulations
