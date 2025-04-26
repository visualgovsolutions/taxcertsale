/**
 * Database Initialization Module
 *
 * IMPORTANT: This file was created to fix a server startup error:
 * "Cannot find module '../lib/db-init'"
 *
 * The server.ts file imports this module for database initialization,
 * but the file was missing, causing the server to fail to start.
 *
 * This module provides basic database connection verification and
 * can be expanded to include more complex database initialization
 * tasks like creating default records or schema validation.
 */

import prisma from './prisma';

/**
 * Initialize database with required setup
 * This runs when the server starts to ensure the database is properly configured
 */
async function dbInit(): Promise<void> {
  try {
    // Verify connection by running a simple query
    const userCount = await prisma.user.count();
    console.log(`Database connected successfully. Found ${userCount} users.`);

    // Add any other database initialization code here
    // For example, creating default records if they don't exist

    return Promise.resolve();
  } catch (error) {
    console.error('Database initialization error:', error);
    return Promise.reject(error);
  }
}

export default dbInit;
