import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import express from 'express'; // Unused import
import http from 'http';
import fs from 'fs';
import path from 'path';
import resolvers from './resolvers';
import config from '@config/index';
import { Request, Response } from 'express'; // Import Request and Response for context

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
const createApolloServer = (httpServer: http.Server): ApolloServer<MyContext> => {
  const server = new ApolloServer<MyContext>({
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
const createApolloMiddleware = (server: ApolloServer<MyContext>) => {
  return expressMiddleware(server, {
    context: async ({ req, res }): Promise<MyContext> => {
      // Basic context with request and response objects
      // Authentication logic can be added here to extract user from token (req.user)
      // const user = req.user; // Assuming authMiddleware runs before this
      return { req, res /*, user*/ };
    },
  });
};

export {
  createApolloServer,
  createApolloMiddleware
}; 