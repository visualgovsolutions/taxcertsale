import 'reflect-metadata';
import http from 'http';
import config from '../config/index';
import { createApolloServer, createApolloMiddleware } from './graphql';
import { getPostgresPool, closePostgresPool } from '../database/postgresPool';
import { AuctionService } from './services/auction/AuctionService';
import { setupAuctionGateway } from './websockets/auction.gateway';
import prisma from '../lib/prisma';
import { app } from './app'; // Import the fully initialized app

let auctionService: AuctionService | null = null;

async function startServer() {
  const port = config.server.port;
  const httpServer = http.createServer(app);

  // Initialize Auction WebSocket Gateway
  const auctionIo = setupAuctionGateway(httpServer);
  console.log('Auction WebSocket Gateway initialized.');

  // Initialize the auction service
  const pool = getPostgresPool();
  auctionService = new AuctionService(auctionIo, pool);
  auctionService.initialize();

  // Initialize Apollo Server
  const apolloServer = createApolloServer(httpServer);
  await apolloServer.start();

  // Basic graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    httpServer.close(async () => {
      console.log('HTTP server closed.');
      if (auctionService) {
        auctionService.shutdown();
        auctionService = null;
        console.log('Auction service stopped.');
      }
      await apolloServer.stop();
      console.log('Apollo server stopped.');
      await prisma.$disconnect();
      console.log('Prisma connection closed.');
      await closePostgresPool();
      console.log('Postgres pool connections closed.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 15000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}`);
  console.log(`🚀 GraphQL ready at http://localhost:${port}/graphql`);
  console.log('🚀 WebSocket ready for bidding');
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
