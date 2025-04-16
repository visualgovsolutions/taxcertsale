# Florida Tax Certificate Auction System

## Overview
This documentation provides comprehensive details about the Florida Tax Certificate Auction System. The system facilitates online tax certificate auctions for Florida counties, allowing counties to manage tax-delinquent properties and enabling registered bidders to participate in auctions.

## Key Features
- Online bidding platform for tax certificates
- County administration portal for auction management
- Bidder registration and management
- Property and tax certificate tracking
- Real-time auction monitoring
- Comprehensive reporting and analytics

## Documentation Structure
- **[Architecture](./architecture/README.md)**: System architecture, design patterns, and technology stack
- **[Components](./components/README.md)**: Reusable UI components and their properties
- **[Pages](./pages/README.md)**: Application pages and their functionality
- **[Data Model](./data-model/README.md)**: Database schema, entity relationships, and GraphQL schema

## Getting Started
To run the application locally:
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Development Environment
- React + TypeScript
- Tailwind CSS for styling
- Prisma ORM for database operations
- GraphQL API with Apollo Client
- Vite for development and building

## TypeScript Configuration

The project uses TypeScript with a well-configured setup to ensure type safety and enhanced developer experience:

### Key TypeScript Features

- **Strict Type Checking**: Enforces comprehensive type safety across the codebase
- **Path Aliases**: Clean imports with short, descriptive paths (e.g., `@backend/...` instead of `../../src/backend/...`)
- **Modern ECMAScript**: Targets ES2022 with full library support
- **Source Maps**: Enabled for better debugging experience
- **Declaration Files**: Generated for improved module interfaces
- **Comprehensive Error Checking**: Catches unused variables, parameters, and ensures all code paths return values

### Using Path Aliases

Path aliases make imports cleaner and more maintainable:

```typescript
// Instead of this:
import { someFunction } from '../../../utils/helpers';

// Use this:
import { someFunction } from '@utils/helpers';
```

Available path aliases:
- `@/*` - Shortcut to src directory
- `@backend/*` - Backend code
- `@frontend/*` - Frontend code
- `@config/*` - Configuration files
- `@database/*` - Database related code
- `@models/*` - Data models
- `@controllers/*` - API controllers
- `@routes/*` - API routes
- `@middleware/*` - Express middleware
- `@services/*` - Service layer
- `@utils/*` - Utility functions
- `@tests/*` - Test files
- `@components/*` - Frontend components
- `@hooks/*` - React hooks
- `@pages/*` - Frontend pages
- `@styles/*` - CSS styles
- `@assets/*` - Static assets

## Environment Configuration

The application uses environment-based configuration with `.env` files:

- `.env` - Base environment variables
- `.env.local` - Local overrides (not committed to git)
- `.env.test` - Test environment configuration
- `.env.production` - Production settings 