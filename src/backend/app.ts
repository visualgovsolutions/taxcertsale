import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http'; // Import http
import mainRouter from './routes/index';
import globalErrorHandler from './middleware/errorMiddleware';
import { createApolloServer, createApolloMiddleware, GraphQLContext } from './graphql';
import { json } from 'body-parser';
import config from '../config/index';
import { ApolloServer } from '@apollo/server'; // Import ApolloServer type

const app = express();

// Create HTTP server instance early
const httpServer = http.createServer(app);

// Initialize Apollo Server (needs to be async)
let apolloServer: ApolloServer<GraphQLContext>;
let apolloMiddleware: express.Handler;

async function initializeApollo() {
  apolloServer = createApolloServer(httpServer); // Pass httpServer here
  await apolloServer.start();
  console.log('Apollo Server started in app.ts');
  apolloMiddleware = createApolloMiddleware(apolloServer);
}

// Apply CORS and Helmet globally
app.use(cors()); // Consider more specific CORS options if needed
app.use(helmet());

// Use express.json for general REST routes BEFORE GraphQL middleware
app.use(express.json());

// Apply Apollo GraphQL middleware AFTER global middleware and general body-parser
// but BEFORE the main REST router and global error handler.
// We wrap this in an async function to ensure Apollo server is started.
app.use(async (req, res, next) => {
  if (!apolloMiddleware) {
    console.log('Waiting for Apollo Server to initialize...');
    // If Apollo isn't ready yet, maybe wait or return an error/loading state
    // For simplicity here, we might just let it error if accessed too soon,
    // or implement a more robust waiting mechanism.
    // Let's assume initializeApollo() is called before requests arrive in typical startup.
     res.status(503).send('GraphQL server not ready');
     return;
  }
  // Apply specific middleware for the /graphql path
  if (req.path === '/graphql') { 
      cors<cors.CorsRequest>()(req, res, () => { // Apply CORS specifically
          json()(req, res, () => { // Apply body-parser specifically
              apolloMiddleware(req, res, next); // Apply Apollo middleware
          });
      });
  } else {
      next(); // Continue to other routes if not /graphql
  }
});


// Main application REST router
app.use('/', mainRouter);

// Global error handling middleware - MUST be last!
app.use(globalErrorHandler);

// Export app, httpServer, apolloServer, and initializeApollo
export { app, httpServer, apolloServer, initializeApollo }; 