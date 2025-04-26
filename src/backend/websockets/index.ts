/**
 * WebSockets Configuration
 *
 * IMPORTANT: This file was created to fix a server startup error:
 * "Cannot find module './websockets'"
 *
 * The server.ts file imports configureWebSockets from this module, but
 * the file was missing, causing the server to fail to start.
 *
 * If you encounter "Cannot find module" errors, check if the module exists
 * and create it if necessary, like we did with this file.
 */

import { Server } from 'socket.io';
import { setupAuctionGateway } from './auction.gateway';

/**
 * Configure WebSockets for the application
 * @param io Socket.IO server instance
 */
export function configureWebSockets(io: Server): void {
  // Currently we only have auction websockets
  // If there are more socket handlers in the future, they would be configured here
  console.log('Configuring WebSockets...');
}

export { setupAuctionGateway };
