// Import from the generated location
import { PrismaClient } from '../generated/prisma';

// Instantiate Prisma Client for the application
// It's generally recommended to have a single instance

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = 
  global.prisma ||
  new PrismaClient({
    // Enable logging for debugging
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma; 