import { ApolloServer } from '@apollo/server';
import http from 'http';
import { Request, Response } from 'express';
export interface MyContext {
    req: Request;
    res: Response;
}
/**
 * Initializes and configures the Apollo Server.
 * @param httpServer - The HTTP server instance from Express app.
 * @returns An initialized Apollo Server instance.
 */
declare const createApolloServer: (httpServer: http.Server) => ApolloServer<MyContext>;
/**
 * Creates the Express middleware for Apollo Server.
 * @param server - The initialized Apollo Server instance.
 * @returns Express middleware function.
 */
declare const createApolloMiddleware: (server: ApolloServer<MyContext>) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export { createApolloServer, createApolloMiddleware };
