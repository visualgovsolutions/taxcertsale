import { Server, Socket } from 'socket.io';
import { Pool } from 'pg';
import { CertificateService, CertificateStatus } from '../../models/certificate/Certificate';
import { BidService, BidStatus } from '../../models/certificate/Bid';
import { CertificateBatchService, BatchStatus } from '../../models/certificate/CertificateBatch';

/**
 * Bid Validation Result
 */
interface BidValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * Bid Event Data
 */
interface BidEventData {
  certificateId: string;
  bidderId: string;
  interestRate: number;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Certificate Auction Data
 */
interface CertificateAuctionData {
  certificateId: string;
  lowestBid: number | null;
  lowestBidder: string | null;
  bidCount: number;
  lastBidTime: Date | null;
}

/**
 * Auction Service Class
 */
export class AuctionService {
  private io: Server;
  private pool: Pool;
  private certificateService: CertificateService;
  private bidService: BidService;
  private batchService: CertificateBatchService;
  private activeAuctions: Map<string, CertificateAuctionData>;
  private connectedUsers: Map<string, Set<string>>;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(io: Server, pool: Pool) {
    this.io = io;
    this.pool = pool;
    this.certificateService = new CertificateService(pool);
    this.bidService = new BidService(pool);
    this.batchService = new CertificateBatchService(pool);
    this.activeAuctions = new Map();
    this.connectedUsers = new Map(); // Map of userId to Set of socketIds
  }

  /**
   * Initialize the auction service
   */
  initialize(): void {
    this.setupSocketHandlers();
    this.startHeartbeat();
    this.startBatchProcessing();

    // Initialize active auctions from database
    this.initializeActiveAuctions().catch(err => {
      console.error('Failed to initialize active auctions:', err);
    });
  }

  /**
   * Start auction service heartbeat
   */
  private startHeartbeat(): void {
    // Send heartbeat every 30 seconds to ensure connections stay alive
    this.heartbeatInterval = setInterval(() => {
      this.io.emit('auction:heartbeat', { timestamp: new Date() });
    }, 30000);
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('auction:authenticate', (data: { userId: string, token: string }) => {
        // TODO: Add proper authentication validation
        if (data.userId && data.token) {
          this.handleUserConnection(socket, data.userId);
        } else {
          socket.emit('auction:error', { message: 'Authentication failed' });
          socket.disconnect(true);
        }
      });

      // Handle joining auction room
      socket.on('auction:join', (data: { certificateId: string }) => {
        if (!data.certificateId) {
          socket.emit('auction:error', { message: 'Certificate ID is required' });
          return;
        }

        // Join the auction room
        socket.join(`certificate:${data.certificateId}`);
        console.log(`Socket ${socket.id} joined auction for certificate ${data.certificateId}`);

        // Send current auction state
        this.sendAuctionState(data.certificateId);
      });

      // Handle leaving auction room
      socket.on('auction:leave', (data: { certificateId: string }) => {
        if (data.certificateId) {
          socket.leave(`certificate:${data.certificateId}`);
          console.log(`Socket ${socket.id} left auction for certificate ${data.certificateId}`);
        }
      });

      // Handle bid placement
      socket.on('auction:place-bid', async (data: BidEventData) => {
        // Validate the user is authenticated
        const userId = this.getUserIdFromSocket(socket);
        if (!userId) {
          socket.emit('auction:error', { message: 'Not authenticated' });
          return;
        }

        // Validate the bid
        const validation = await this.validateBid(data, userId);
        if (!validation.valid) {
          socket.emit('auction:bid-rejected', { 
            certificateId: data.certificateId, 
            message: validation.message 
          });
          return;
        }

        // Process the bid
        try {
          const bid = await this.processBid(data, userId);
          
          // Notify all users in the auction room
          this.io.to(`certificate:${data.certificateId}`).emit('auction:bid-placed', {
            certificateId: data.certificateId,
            bidId: bid.id,
            bidderId: bid.bidderId,
            interestRate: bid.interestRate,
            timestamp: bid.timestamp
          });

          // Update auction data
          this.updateAuctionData(data.certificateId, bid.interestRate, bid.bidderId, bid.timestamp);

          // Send updated auction state
          this.sendAuctionState(data.certificateId);

          // Notify bidder of successful bid
          socket.emit('auction:bid-accepted', {
            certificateId: data.certificateId,
            bidId: bid.id,
            interestRate: bid.interestRate
          });
        } catch (error) {
          console.error('Bid processing error:', error);
          socket.emit('auction:error', { 
            message: 'An error occurred while processing your bid' 
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleUserDisconnection(socket);
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Handle user connection
   */
  private handleUserConnection(socket: Socket, userId: string): void {
    // Store the user's socket
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    
    this.connectedUsers.get(userId)?.add(socket.id);
    
    // Associate the user ID with the socket
    socket.data.userId = userId;
    
    // Send confirmation
    socket.emit('auction:authenticated', { userId });
    
    console.log(`User ${userId} authenticated on socket ${socket.id}`);
  }

  /**
   * Handle user disconnection
   */
  private handleUserDisconnection(socket: Socket): void {
    const userId = this.getUserIdFromSocket(socket);
    
    if (userId && this.connectedUsers.has(userId)) {
      // Remove this socket from the user's set
      this.connectedUsers.get(userId)?.delete(socket.id);
      
      // If no more sockets for this user, remove the user entry
      if (this.connectedUsers.get(userId)?.size === 0) {
        this.connectedUsers.delete(userId);
      }
    }
  }

  /**
   * Get user ID from socket
   */
  private getUserIdFromSocket(socket: Socket): string | undefined {
    return socket.data.userId;
  }

  /**
   * Validate a bid
   */
  private async validateBid(
    bid: BidEventData,
    userId: string
  ): Promise<BidValidationResult> {
    // Verify the bidder ID matches the authenticated user
    if (bid.bidderId !== userId) {
      return { valid: false, message: 'Bidder ID does not match authenticated user' };
    }

    // Verify the certificate exists and is in active auction
    const certificate = await this.certificateService.getCertificateById(bid.certificateId);
    if (!certificate) {
      return { valid: false, message: 'Certificate not found' };
    }

    if (certificate.status !== CertificateStatus.AUCTION_ACTIVE) {
      return { valid: false, message: 'Certificate is not in active auction' };
    }

    // Check if the batch is active
    if (certificate.batchId) {
      const batch = await this.batchService.getBatchById(certificate.batchId);
      if (!batch || batch.status !== BatchStatus.ACTIVE) {
        return { valid: false, message: 'Certificate batch is not active' };
      }
    }

    // Validate interest rate bounds (Florida rules)
    if (bid.interestRate > 18) {
      return { valid: false, message: 'Interest rate cannot exceed 18%' };
    }

    if (bid.interestRate < 0) {
      return { valid: false, message: 'Interest rate cannot be negative' };
    }

    if (bid.interestRate !== 0 && bid.interestRate < 5) {
      return { valid: false, message: 'Interest rate must be at least 5% or exactly 0%' };
    }

    // Check if the bid is lower than current lowest bid
    const auctionData = this.activeAuctions.get(bid.certificateId);
    if (auctionData && auctionData.lowestBid !== null) {
      if (bid.interestRate >= auctionData.lowestBid) {
        return { 
          valid: false, 
          message: `Bid must be lower than current lowest bid (${auctionData.lowestBid}%)` 
        };
      }
    }

    return { valid: true };
  }

  /**
   * Process a new bid
   */
  private async processBid(bid: BidEventData, userId: string) {
    // Start a database transaction
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create the bid record
      const newBid = await this.bidService.placeBid({
        certificateId: bid.certificateId,
        bidderId: userId,
        interestRate: bid.interestRate,
        ipAddress: bid.ipAddress,
        userAgent: bid.userAgent
      });
      
      // Mark previous bids as outbid
      await this.bidService.updateBidsToOutbid(bid.certificateId, newBid.id);
      
      // Mark this bid as winning
      await this.bidService.updateBidStatus(newBid.id, BidStatus.WINNING);
      
      await client.query('COMMIT');
      return newBid;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update auction data when a new bid is placed
   */
  private updateAuctionData(
    certificateId: string, 
    interestRate: number, 
    bidderId: string, 
    timestamp: Date
  ): void {
    const auctionData = this.activeAuctions.get(certificateId) || {
      certificateId,
      lowestBid: null,
      lowestBidder: null,
      bidCount: 0,
      lastBidTime: null
    };
    
    auctionData.lowestBid = interestRate;
    auctionData.lowestBidder = bidderId;
    auctionData.bidCount++;
    auctionData.lastBidTime = timestamp;
    
    this.activeAuctions.set(certificateId, auctionData);
  }

  /**
   * Send current auction state to clients
   */
  private async sendAuctionState(certificateId: string): Promise<void> {
    const auctionData = this.activeAuctions.get(certificateId);
    
    if (!auctionData) {
      // If we don't have cached data, try to get it from the database
      try {
        const lowestBid = await this.bidService.getLowestBidForCertificate(certificateId);
        const bids = await this.bidService.getBidsForCertificate(certificateId);
        
        const stateData = {
          certificateId,
          lowestBid: lowestBid ? lowestBid.interestRate : null,
          lowestBidder: lowestBid ? lowestBid.bidderId : null,
          bidCount: bids.length,
          lastBidTime: lowestBid ? lowestBid.timestamp : null
        };
        
        this.io.to(`certificate:${certificateId}`).emit('auction:state', stateData);
      } catch (error) {
        console.error(`Error fetching auction state for certificate ${certificateId}:`, error);
      }
    } else {
      // Send the cached auction data
      this.io.to(`certificate:${certificateId}`).emit('auction:state', auctionData);
    }
  }

  /**
   * Initialize active auctions from the database
   */
  private async initializeActiveAuctions(): Promise<void> {
    // Get all certificates in active auction
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(`
        SELECT c.id as certificate_id, 
               b.id as bid_id, 
               b.bidder_id, 
               b.interest_rate, 
               b.timestamp,
               (SELECT COUNT(*) FROM bids WHERE certificate_id = c.id) as bid_count
        FROM certificates c
        LEFT JOIN bids b ON b.certificate_id = c.id AND b.status = $1
        WHERE c.status = $2
        ORDER BY b.interest_rate ASC, b.timestamp ASC
      `, [BidStatus.WINNING, CertificateStatus.AUCTION_ACTIVE]);
      
      // Group by certificate and take the lowest bid for each
      const certificates = new Map<string, any>();
      
      for (const row of result.rows) {
        if (!certificates.has(row.certificate_id)) {
          certificates.set(row.certificate_id, row);
        }
      }
      
      // Initialize auction data for each certificate
      for (const [certificateId, row] of certificates.entries()) {
        this.activeAuctions.set(certificateId, {
          certificateId,
          lowestBid: row.bid_id ? parseFloat(row.interest_rate) : null,
          lowestBidder: row.bidder_id || null,
          bidCount: parseInt(row.bid_count, 10),
          lastBidTime: row.timestamp ? new Date(row.timestamp) : null
        });
      }
      
      console.log(`Initialized ${this.activeAuctions.size} active auctions`);
    } catch (error) {
      console.error('Error initializing active auctions:', error);
    } finally {
      client.release();
    }
  }

  /**
   * Start batch processing
   */
  private startBatchProcessing(): void {
    // Check for batches that need to be activated or closed every minute
    setInterval(async () => {
      try {
        await this.processBatches();
      } catch (error) {
        console.error('Error processing batches:', error);
      }
    }, 60000);
  }

  /**
   * Process certificate batches
   */
  private async processBatches(): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get scheduled batches that should be activated
      const batchesToActivate = await this.batchService.getScheduledBatchesToActivate();
      
      for (const batch of batchesToActivate) {
        // Update batch status
        await this.batchService.updateBatchStatus(batch.id, BatchStatus.ACTIVE);
        
        // Update certificate statuses
        for (const certificateId of batch.certificates) {
          await this.certificateService.updateCertificateStatus(
            certificateId, 
            CertificateStatus.AUCTION_ACTIVE
          );
          
          // Initialize auction data
          if (!this.activeAuctions.has(certificateId)) {
            this.activeAuctions.set(certificateId, {
              certificateId,
              lowestBid: null,
              lowestBidder: null,
              bidCount: 0,
              lastBidTime: null
            });
          }
          
          // Notify clients that the auction is active
          this.io.emit('auction:started', { certificateId });
        }
        
        console.log(`Activated batch ${batch.id} with ${batch.certificates.length} certificates`);
      }
      
      // Get active batches that should be closed
      const batchesToClose = await this.batchService.getActiveBatchesToClose();
      
      for (const batch of batchesToClose) {
        // Update batch status
        await this.batchService.updateBatchStatus(batch.id, BatchStatus.CLOSED);
        
        // Process each certificate in the batch
        for (const certificateId of batch.certificates) {
          // Get the winning bid
          const lowestBid = await this.bidService.getLowestBidForCertificate(certificateId);
          
          if (lowestBid) {
            // Update certificate with winning bid
            await this.certificateService.updateCertificateAfterBid(
              certificateId,
              lowestBid.bidderId,
              lowestBid.interestRate
            );
            
            // Notify clients of auction end with winner
            this.io.emit('auction:ended', { 
              certificateId, 
              winner: lowestBid.bidderId,
              interestRate: lowestBid.interestRate
            });
          } else {
            // No bids, update certificate status to closed
            await this.certificateService.updateCertificateStatus(
              certificateId,
              CertificateStatus.AUCTION_CLOSED
            );
            
            // Notify clients of auction end with no winner
            this.io.emit('auction:ended', { 
              certificateId, 
              winner: null
            });
          }
          
          // Remove from active auctions
          this.activeAuctions.delete(certificateId);
        }
        
        console.log(`Closed batch ${batch.id} with ${batch.certificates.length} certificates`);
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error processing batches:', error);
    } finally {
      client.release();
    }
  }

  /**
   * Clean up resources when stopping the service
   */
  shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    console.log('Auction service shutdown');
  }
} 