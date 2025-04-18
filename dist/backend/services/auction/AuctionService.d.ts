import { Server } from 'socket.io';
import { Pool } from 'pg';
/**
 * Auction Service Class
 */
export declare class AuctionService {
    private io;
    private pool;
    private certificateService;
    private bidService;
    private batchService;
    private activeAuctions;
    private connectedUsers;
    private heartbeatInterval;
    constructor(io: Server, pool: Pool);
    /**
     * Initialize the auction service
     */
    initialize(): void;
    /**
     * Start auction service heartbeat
     */
    private startHeartbeat;
    /**
     * Setup WebSocket event handlers
     */
    private setupSocketHandlers;
    /**
     * Handle user connection
     */
    private handleUserConnection;
    /**
     * Handle user disconnection
     */
    private handleUserDisconnection;
    /**
     * Get user ID from socket
     */
    private getUserIdFromSocket;
    /**
     * Validate a bid
     */
    private validateBid;
    /**
     * Process a new bid
     */
    private processBid;
    /**
     * Update auction data when a new bid is placed
     */
    private updateAuctionData;
    /**
     * Send current auction state to clients
     */
    private sendAuctionState;
    /**
     * Initialize active auctions from the database
     */
    private initializeActiveAuctions;
    /**
     * Start batch processing
     */
    private startBatchProcessing;
    /**
     * Process certificate batches
     */
    private processBatches;
    /**
     * Clean up resources when stopping the service
     */
    shutdown(): void;
    /**
     * Get all auctions - for REST API
     */
    getAllAuctions(): Promise<any[]>;
    /**
     * Get upcoming auctions - for REST API
     */
    getUpcomingAuctions(): Promise<any[]>;
    /**
     * Get auction by ID - for REST API
     */
    getAuctionById(id: string): Promise<any>;
    /**
     * Create a new auction - for REST API
     */
    createAuction(auctionData: any): Promise<any>;
    /**
     * Update an auction - for REST API
     */
    updateAuction(id: string, auctionData: any): Promise<any>;
    /**
     * Delete an auction - for REST API
     */
    deleteAuction(id: string): Promise<any>;
    /**
     * Start an auction - for REST API
     */
    startAuction(id: string): Promise<any>;
    /**
     * End an auction - for REST API
     */
    endAuction(id: string): Promise<any>;
}
