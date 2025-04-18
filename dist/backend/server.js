"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.createTestServer = createTestServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http")); // Import http module
const socket_io_1 = require("socket.io"); // Import Socket.io
const index_1 = __importDefault(require("../config/index"));
const index_2 = __importDefault(require("./routes/index")); // Import main router
const postgresPool_1 = require("../database/postgresPool"); // Import pool functions
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware")); // Import error handler
const graphql_1 = require("./graphql"); // Import Apollo setup
const body_parser_1 = require("body-parser"); // Import json body parser specifically for GraphQL endpoint
const AuctionService_1 = require("./services/auction/AuctionService"); // Import Auction Service
// Global variable to store the auction service instance
let auctionService = null;
// --- TESTING SUPPORT ---
// Create a testable Express app without starting HTTP server or Socket.io
async function createTestServer() {
    const testApp = (0, express_1.default)();
    // Middleware
    testApp.use((0, cors_1.default)());
    testApp.use((0, helmet_1.default)());
    testApp.use(express_1.default.json());
    // Optionally, you could mock Apollo or skip GraphQL for tests
    // testApp.use('/graphql', ...)
    // Main application REST router
    testApp.use('/', index_2.default);
    // Global error handling middleware
    testApp.use(errorMiddleware_1.default);
    return testApp;
}
async function startServer() {
    exports.app = (0, express_1.default)(); // Assign to the exported variable
    const port = index_1.default.server.port;
    const httpServer = http_1.default.createServer(exports.app);
    // Initialize Socket.io
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*', // TODO: Configure this more restrictively in production
            methods: ['GET', 'POST'],
        },
    });
    // Initialize the auction service
    const pool = (0, postgresPool_1.getPostgresPool)();
    auctionService = new AuctionService_1.AuctionService(io, pool);
    auctionService.initialize();
    // Initialize Apollo Server
    const apolloServer = (0, graphql_1.createApolloServer)(httpServer);
    await apolloServer.start(); // Start Apollo Server
    // Middleware
    // Apply CORS and Helmet globally
    exports.app.use((0, cors_1.default)());
    exports.app.use((0, helmet_1.default)());
    // Use express.json for general REST routes
    exports.app.use(express_1.default.json());
    // GraphQL endpoint - Apply specific body parser and Apollo middleware
    exports.app.use('/graphql', (0, cors_1.default)(), // Re-apply CORS if needed for specific GQL origins
    (0, body_parser_1.json)(), // Use body-parser's json middleware for GraphQL
    (0, graphql_1.createApolloMiddleware)(apolloServer) // Apply Apollo middleware
    );
    // Main application REST router
    exports.app.use('/', index_2.default); // Mount REST routes (excluding /graphql)
    // Global error handling middleware - MUST be last!
    exports.app.use(errorMiddleware_1.default);
    // Basic graceful shutdown
    const shutdown = (signal) => {
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
            await (0, postgresPool_1.closePostgresPool)();
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
    await new Promise(resolve => httpServer.listen({ port }, resolve));
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
//# sourceMappingURL=server.js.map