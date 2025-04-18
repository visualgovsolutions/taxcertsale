"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApolloMiddleware = exports.createApolloServer = void 0;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const resolvers_1 = __importDefault(require("./resolvers"));
const index_1 = __importDefault(require("../../config/index"));
// Load schema from file
const typeDefs = fs_1.default.readFileSync(path_1.default.join(__dirname, 'schema.graphql'), 'utf-8');
/**
 * Initializes and configures the Apollo Server.
 * @param httpServer - The HTTP server instance from Express app.
 * @returns An initialized Apollo Server instance.
 */
const createApolloServer = (httpServer) => {
    const server = new server_1.ApolloServer({
        typeDefs,
        resolvers: resolvers_1.default,
        introspection: index_1.default.server.nodeEnv !== 'production', // Enable introspection only in non-prod
        plugins: [
            // Proper shutdown for the HTTP server.
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
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
exports.createApolloServer = createApolloServer;
/**
 * Creates the Express middleware for Apollo Server.
 * @param server - The initialized Apollo Server instance.
 * @returns Express middleware function.
 */
const createApolloMiddleware = (server) => {
    return (0, express4_1.expressMiddleware)(server, {
        context: async ({ req, res }) => {
            // Basic context with request and response objects
            // Authentication logic can be added here to extract user from token (req.user)
            // const user = req.user; // Assuming authMiddleware runs before this
            return { req, res /*, user*/ };
        },
    });
};
exports.createApolloMiddleware = createApolloMiddleware;
//# sourceMappingURL=index.js.map