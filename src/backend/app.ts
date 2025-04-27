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

// CRITICAL CONFIG NOTES:
// 1. Body parser limits are set to 10mb to handle large requests
// 2. Request timeout is increased to 120s to prevent 504 errors especially for auth
// 3. DO NOT modify these values without thorough testing of all auth flows
// 4. If login fails with timeout errors, check these settings FIRST
// 5. DO NOT DELETE THESE COMMENTS - they are critical for system stability

const app = express();

// Create HTTP server instance early
const httpServer = http.createServer(app);

// Configure HTTP server timeouts - CRITICAL for preventing 504 errors
httpServer.timeout = 120000; // 120 seconds
httpServer.keepAliveTimeout = 65000; // Slightly higher than AWS ALB default of 60s
httpServer.headersTimeout = 66000; // Slightly higher than keepAliveTimeout

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

// CRITICAL - Configure body parser with increased limits to prevent payload too large errors
// Configure json parsing with increased limits
app.use(express.json({ 
  limit: '10mb',  // Increase from default 100kb
  verify: (req, res, buf) => {
    // Store raw body for potential signature verification
    // @ts-ignore - Adding rawBody to request object
    req.rawBody = buf;
  }
}));

// Configure URL-encoded parsing with increased limits
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 50000  // Increase from default 1000
}));

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
          json({ limit: '10mb' })(req, res, () => { // Apply body-parser specifically with increased limit
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