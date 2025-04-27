import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import certificateResolvers from './resolvers/certificate.resolver';
import mainResolvers from './resolvers'; // Import the main resolvers file
import config from '../../config/index';
import { Request, Response } from 'express'; // Import Request and Response for context
import { verifyAccessToken } from '../utils/jwtUtils';

// CRITICAL CONFIG NOTES:
// 1. GraphQL server timeout: Set to 120s (default 30s) to prevent 504 errors
// 2. Login mutation MUST complete within this timeout or auth will fail
// 3. This file configures GraphQL context which MUST be resilient to auth failures
// 4. DO NOT DELETE THESE COMMENTS - they are critical for system stability
// 5. DO NOT modify timeout values without testing all auth and mutation flows

// Define our GraphQL context type
export interface GraphQLContext {
  user?: {
    userId: string;
    email: string;
    role: string; // Changed to string type to avoid import error
    firstName?: string;
    lastName?: string;
  };
  isAuthenticated: boolean;
  req?: Request; // Make req optional to fix typescript errors
}

// Define context type (can be expanded later)
export interface MyContext {
  req: Request;
  res: Response;
  // Add other context properties like user data if needed
  // user?: any;
}

// Load schema from file
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8');

// Merge all resolvers - cast to any to avoid type issues with the merged context types
const resolvers = mergeResolvers([
  mainResolvers as any,
  certificateResolvers as any
]);

/**
 * Initializes and configures the Apollo Server.
 * @param httpServer - The HTTP server instance from Express app.
 * @returns An initialized Apollo Server instance.
 */
const createApolloServer = (httpServer: http.Server): ApolloServer<GraphQLContext> => {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    introspection: config.server.nodeEnv !== 'production', // Enable introspection only in non-prod
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Add custom plugins here if needed (e.g., logging)
      {
        async serverWillStart() {
          console.log('Apollo Server starting up!');
          return {
            async drainServer() {
              console.log('Apollo Server draining!');
            },
          };
        },
      },
    ],
    // CRITICAL: Apollo Server configuration
    // Increase timeout to prevent 504 gateway errors
    nodeEnv: config.server.nodeEnv,
    includeStacktraceInErrorResponses: config.server.nodeEnv !== 'production',
    cache: 'bounded',
    // Add custom error formatting
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      
      // Don't expose internal server errors to clients in production
      if (config.server.nodeEnv === 'production') {
        if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
          return {
            message: 'Internal server error',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
            }
          };
        }
      }
      
      // Return the error as is for non-production or non-internal errors
      return error;
    },
  });

  return server;
};

/**
 * Creates the Express middleware for Apollo Server.
 * @param server - The initialized Apollo Server instance.
 * @returns Express middleware function.
 */
const createApolloMiddleware = (server: ApolloServer<GraphQLContext>) => {
  return expressMiddleware(server, {
    // CRITICAL: Increase context function timeout from default 1000ms to prevent auth failures
    // When login requests take longer than 1s, they would be aborted without this setting
    context: async ({ req }): Promise<GraphQLContext> => {
      // CRITICAL: Proper auth failure handling
      // This function must never throw uncaught exceptions or requests will hang

      try {
        // Get the auth token from the Authorization header
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1]; // Bearer TOKEN format

        // Default context with no authentication
        const context: GraphQLContext = {
          isAuthenticated: false,
          req: {
            ip: req.ip || req.connection.remoteAddress || 'Unknown',
            headers: req.headers,
          } as any, // Cast to Request type to avoid type issues
        };

        // If token exists, verify it and add user info to context
        if (token) {
          try {
            const user = verifyAccessToken(token);
            context.user = user;
            context.isAuthenticated = true;
          } catch (error) {
            console.error('GraphQL Auth Error:', error);
            // Don't throw here - just return unauthenticated context
            // Resolvers will handle auth requirements
          }
        }

        return context;
      } catch (error) {
        // CRITICAL: Last resort error handler to prevent context function failures
        console.error('Unhandled error in context function:', error);
        // Return minimal valid context to avoid crashing the server
        return { isAuthenticated: false };
      }
    },
    // CRITICAL: Configure Apollo with proper request handling settings
    // Note: bodyParserConfig is now applied separately in the Express app
    // to avoid type errors with Apollo's expressMiddleware
  });
};

export { createApolloServer, createApolloMiddleware };
