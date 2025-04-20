import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mainRouter from './routes/index';
import globalErrorHandler from './middleware/errorMiddleware';
import { createApolloServer, createApolloMiddleware } from './graphql';
import { json } from 'body-parser';
import config from '../config/index';

const app = express();

// Apply CORS and Helmet globally
app.use(cors());
app.use(helmet());

// Use express.json for general REST routes
app.use(express.json());

// Apollo Server setup for tests (middleware only, not starting the server)
// In production, Apollo is started in server.ts
// (No Apollo middleware here; handled in server.ts)

// Main application REST router
app.use('/', mainRouter);

// Global error handling middleware - MUST be last!
app.use(globalErrorHandler);

export { app }; 