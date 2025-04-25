import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import resolvers from './resolvers';
import config from '../../config/index';
import { Request, Response } from 'express'; // Import Request and Response for context
import { verifyAccessToken } from '../utils/jwtUtils';

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
  req?: Request;  // Make req optional to fix typescript errors
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
    // Consider adding formatError function for custom error formatting later
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
    context: async ({ req }): Promise<GraphQLContext> => {
      // Get the auth token from the Authorization header
      const authHeader = req.headers.authorization || '';
      const token = authHeader.split(' ')[1]; // Bearer TOKEN format
      
      // Default context with no authentication
      const context: GraphQLContext = {
        isAuthenticated: false,
        req: {
          ip: req.ip || req.connection.remoteAddress || 'Unknown',
          headers: req.headers
        } as any // Cast to Request type to avoid type issues
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
    },
  });
};

export {
  createApolloServer,
  createApolloMiddleware
}; 