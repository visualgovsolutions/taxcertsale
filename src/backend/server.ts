import 'reflect-metadata';
import http from 'http';
import config from '../config/index';
import { getPostgresPool, closePostgresPool } from '../database/postgresPool';
import { AuctionService } from './services/auction/AuctionService';
import { setupAuctionGateway } from './websockets/auction.gateway';
import prisma from '../lib/prisma';
import { app, httpServer, apolloServer, initializeApollo } from './app';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import { configureWebSockets } from './websockets';
import { createApolloServer, createApolloMiddleware } from './graphql';
import dbInit from '../lib/db-init';
import { hashPassword } from './utils/passwordUtils';

let auctionService: AuctionService | null = null;

async function startServer() {
  const port = config.server.port;

  // Initialize Auction WebSocket Gateway
  const auctionIo = setupAuctionGateway(httpServer);
  console.log('Auction WebSocket Gateway initialized.');

  // Initialize the auction service
  const pool = getPostgresPool();
  auctionService = new AuctionService(auctionIo, pool);
  auctionService.initialize();

  // Initialize Apollo Server
  await initializeApollo();

  // Early database check and seeding if needed
  (async () => {
    try {
      console.log('Checking database connection...');
      // Test the database connection
      const userCount = await prisma.user.count();
      console.log(`Found ${userCount} users in database`);
      
      // If no users exist, create a default admin user
      if (userCount === 0) {
        console.log('No users found in database, creating default admin user...');
        const hashedPassword = await hashPassword('password123');
        
        await prisma.user.create({
          data: {
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ADMIN',
            status: 'ACTIVE',
          }
        });
        
        console.log('Created default admin user: admin@example.com');
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      process.exit(1); // Exit if database connection fails
    }
  })();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // In production, restrict to your frontend origin
      methods: ['GET', 'POST']
    }
  });

  // Configure WebSockets
  configureWebSockets(io);

  // Initialize database
  dbInit().then(() => {
    console.log('Database initialized');
  }).catch(err => {
    console.error('Failed to initialize database:', err);
  });

  // Setup Apollo Server
  const startApolloServer = async () => {
    const server = createApolloServer(httpServer);
    await server.start();
    
    // Apply Apollo middleware to Express
    app.use('/graphql', createApolloMiddleware(server));
    
    // Serve static files for the frontend
    app.use(express.static(path.join(__dirname, '../../dist')));
    
    // For any other requests, send the index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../dist/index.html'));
    });
    
    // Start the server
    httpServer.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
      console.log(`🔌 WebSockets ready at ws://localhost:${port}`);
      console.log(`🛰️ GraphQL endpoint: http://localhost:${port}/graphql`);
    });
  };

  // Start Apollo Server
  startApolloServer().catch(err => {
    console.error('Failed to start Apollo Server:', err);
  });

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
      if (apolloServer) {
        await apolloServer.stop();
        console.log('Apollo server stopped.');
      } else {
        console.log('Apollo server instance not available for shutdown.');
      }
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

  // Add error handling for the listen call
  httpServer.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    // Handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`🔴🔴🔴 Port ${port} is already in use. Kill the process using it and retry.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
