#!/bin/bash
set -e

# Configurable variables
DB_NAME=${TEST_DB_NAME:-taxcertsale_test}
DB_USER=${TEST_DB_USER:-postgres}
DB_PASSWORD=${TEST_DB_PASSWORD:-postgres}
DB_HOST=${TEST_DB_HOST:-localhost}
DB_PORT=${TEST_DB_PORT:-5432}

export PGPASSWORD="$DB_PASSWORD"

# Drop the test database if it exists
psql -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d postgres -c "DROP DATABASE IF EXISTS \"$DB_NAME\";"

# Create the test database
psql -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d postgres -c "CREATE DATABASE \"$DB_NAME\";"

# Run migrations using ts-node (for TypeScript source files)
npx ts-node --transpile-only ./node_modules/typeorm/cli.js migration:run -d ./tests/test-utils/test-data-source.ts

echo "Test database $DB_NAME reset and migrations applied." 