import { Pool } from 'pg';
/**
 * Bid Status
 */
export declare enum BidStatus {
    ACTIVE = "active",
    OUTBID = "outbid",
    WINNING = "winning",
    CANCELLED = "cancelled"
}
/**
 * Bid Interface
 */
export interface Bid {
    id: string;
    certificateId: string;
    bidderId: string;
    interestRate: number;
    timestamp: Date;
    status: BidStatus;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Bid Service Class
 */
export declare class BidService {
    private pool;
    constructor(pool: Pool);
    /**
     * Place a new bid
     */
    placeBid(bid: Omit<Bid, 'id' | 'timestamp' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Bid>;
    /**
     * Get a bid by ID
     */
    getBidById(id: string): Promise<Bid | null>;
    /**
     * Get all bids for a certificate
     */
    getBidsForCertificate(certificateId: string): Promise<Bid[]>;
    /**
     * Get active bids for a certificate
     */
    getActiveBidsForCertificate(certificateId: string): Promise<Bid[]>;
    /**
     * Get lowest bid for a certificate
     */
    getLowestBidForCertificate(certificateId: string): Promise<Bid | null>;
    /**
     * Update bid status
     */
    updateBidStatus(id: string, status: BidStatus): Promise<Bid | null>;
    /**
     * Update all bids for a certificate to outbid status except the winning bid
     */
    updateBidsToOutbid(certificateId: string, winningBidId: string): Promise<number>;
    /**
     * Get bids by bidder
     */
    getBidsByBidder(bidderId: string): Promise<Bid[]>;
    /**
     * Get active bids by bidder
     */
    getActiveBidsByBidder(bidderId: string): Promise<Bid[]>;
    /**
     * Get winning bids by bidder
     */
    getWinningBidsByBidder(bidderId: string): Promise<Bid[]>;
    /**
     * Map database row to Bid object
     */
    private mapRowToBid;
}
