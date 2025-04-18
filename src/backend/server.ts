import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http'; // Import http module
import { Server } from 'socket.io'; // Import Socket.io
import config from '../config/index';
import mainRouter from './routes/index'; // Import main router
import { closePostgresPool, getPostgresPool } from '../database/postgresPool'; // Import pool functions
import globalErrorHandler from './middleware/errorMiddleware'; // Import error handler
import { createApolloServer, createApolloMiddleware } from './graphql'; // Import Apollo setup
import { json } from 'body-parser'; // Import json body parser specifically for GraphQL endpoint
import { AuctionService } from './services/auction/AuctionService'; // Import Auction Service

// Global variable to store the auction service instance
let auctionService: AuctionService | null = null;

// Export app for testing purposes
export let app: express.Application;

// --- TESTING SUPPORT ---
// Create a testable Express app without starting HTTP server or Socket.io
export async function createTestServer() {
  const testApp = express();

  // Middleware
  testApp.use(cors());
  testApp.use(helmet());
  testApp.use(express.json());

  // Optionally, you could mock Apollo or skip GraphQL for tests
  // testApp.use('/graphql', ...)

  // Main application REST router
  testApp.use('/', mainRouter);

  // Global error handling middleware
  testApp.use(globalErrorHandler);

  return testApp;
}

async function startServer() {
  app = express(); // Assign to the exported variable
  const port = config.server.port;
  const httpServer = http.createServer(app);

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // TODO: Configure this more restrictively in production
      methods: ['GET', 'POST'],
    },
  });

  // Initialize the auction service
  const pool = getPostgresPool();
  auctionService = new AuctionService(io, pool);
  auctionService.initialize();

  // Initialize Apollo Server
  const apolloServer = createApolloServer(httpServer);
  await apolloServer.start(); // Start Apollo Server

  // Middleware
  // Apply CORS and Helmet globally
  app.use(cors());
  app.use(helmet());

  // Use express.json for general REST routes
  app.use(express.json());

  // GraphQL endpoint - Apply specific body parser and Apollo middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(), // Re-apply CORS if needed for specific GQL origins
    json(), // Use body-parser's json middleware for GraphQL
    createApolloMiddleware(apolloServer) // Apply Apollo middleware
  );

  // Main application REST router
  app.use('/', mainRouter); // Mount REST routes (excluding /graphql)

  // Global error handling middleware - MUST be last!
  app.use(globalErrorHandler);

  // Basic graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    httpServer.close(async () => {
      console.log('HTTP server closed.');

      // Shutdown the auction service
      if (auctionService) {
        auctionService.shutdown();
        auctionService = null;
        console.log('Auction service stopped.');
      }

      await apolloServer.stop(); // Stop Apollo Server
      console.log('Apollo server stopped.');
      await closePostgresPool();
      console.log('Database connections closed.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 15000); // Increased timeout slightly for multiple services
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Start the HTTP server
  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}`);
  console.log(`🚀 GraphQL ready at http://localhost:${port}/graphql`);
  console.log('🚀 WebSocket ready for bidding');
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export startServer if needed elsewhere, but app export is primary for tests
// export { startServer };
