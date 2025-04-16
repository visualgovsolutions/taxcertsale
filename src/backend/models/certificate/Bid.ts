import { Pool } from 'pg';

/**
 * Bid Status
 */
export enum BidStatus {
  ACTIVE = 'active',
  OUTBID = 'outbid',
  WINNING = 'winning',
  CANCELLED = 'cancelled'
}

/**
 * Bid Interface
 */
export interface Bid {
  id: string;
  certificateId: string;
  bidderId: string;
  interestRate: number; // Interest rate being bid
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
export class BidService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Place a new bid
   */
  async placeBid(bid: Omit<Bid, 'id' | 'timestamp' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Bid> {
    const now = new Date();
    
    const query = `
      INSERT INTO bids (
        certificate_id, bidder_id, interest_rate, timestamp,
        status, ip_address, user_agent, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      bid.certificateId,
      bid.bidderId,
      bid.interestRate,
      now,
      BidStatus.ACTIVE,
      bid.ipAddress || null,
      bid.userAgent || null,
      now,
      now
    ];
    
    const result = await this.pool.query(query, values);
    return this.mapRowToBid(result.rows[0]);
  }

  /**
   * Get a bid by ID
   */
  async getBidById(id: string): Promise<Bid | null> {
    const query = 'SELECT * FROM bids WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBid(result.rows[0]);
  }

  /**
   * Get all bids for a certificate
   */
  async getBidsForCertificate(certificateId: string): Promise<Bid[]> {
    const query = 'SELECT * FROM bids WHERE certificate_id = $1 ORDER BY timestamp DESC';
    const result = await this.pool.query(query, [certificateId]);
    
    return result.rows.map(row => this.mapRowToBid(row));
  }

  /**
   * Get active bids for a certificate
   */
  async getActiveBidsForCertificate(certificateId: string): Promise<Bid[]> {
    const query = 'SELECT * FROM bids WHERE certificate_id = $1 AND status = $2 ORDER BY interest_rate ASC, timestamp ASC';
    const result = await this.pool.query(query, [certificateId, BidStatus.ACTIVE]);
    
    return result.rows.map(row => this.mapRowToBid(row));
  }

  /**
   * Get lowest bid for a certificate
   */
  async getLowestBidForCertificate(certificateId: string): Promise<Bid | null> {
    const query = `
      SELECT * FROM bids 
      WHERE certificate_id = $1 AND status = $2 
      ORDER BY interest_rate ASC, timestamp ASC 
      LIMIT 1
    `;
    
    const result = await this.pool.query(query, [certificateId, BidStatus.ACTIVE]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBid(result.rows[0]);
  }

  /**
   * Update bid status
   */
  async updateBidStatus(id: string, status: BidStatus): Promise<Bid | null> {
    const query = `
      UPDATE bids 
      SET status = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [status, new Date(), id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBid(result.rows[0]);
  }

  /**
   * Update all bids for a certificate to outbid status except the winning bid
   */
  async updateBidsToOutbid(certificateId: string, winningBidId: string): Promise<number> {
    const query = `
      UPDATE bids 
      SET status = $1, updated_at = $2
      WHERE certificate_id = $3 AND id != $4 AND status = $5
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      BidStatus.OUTBID,
      new Date(),
      certificateId,
      winningBidId,
      BidStatus.ACTIVE
    ]);
    
    return result.rowCount;
  }

  /**
   * Get bids by bidder
   */
  async getBidsByBidder(bidderId: string): Promise<Bid[]> {
    const query = 'SELECT * FROM bids WHERE bidder_id = $1 ORDER BY timestamp DESC';
    const result = await this.pool.query(query, [bidderId]);
    
    return result.rows.map(row => this.mapRowToBid(row));
  }

  /**
   * Get active bids by bidder
   */
  async getActiveBidsByBidder(bidderId: string): Promise<Bid[]> {
    const query = 'SELECT * FROM bids WHERE bidder_id = $1 AND status = $2 ORDER BY timestamp DESC';
    const result = await this.pool.query(query, [bidderId, BidStatus.ACTIVE]);
    
    return result.rows.map(row => this.mapRowToBid(row));
  }

  /**
   * Get winning bids by bidder
   */
  async getWinningBidsByBidder(bidderId: string): Promise<Bid[]> {
    const query = 'SELECT * FROM bids WHERE bidder_id = $1 AND status = $2 ORDER BY timestamp DESC';
    const result = await this.pool.query(query, [bidderId, BidStatus.WINNING]);
    
    return result.rows.map(row => this.mapRowToBid(row));
  }

  /**
   * Map database row to Bid object
   */
  private mapRowToBid(row: any): Bid {
    return {
      id: row.id,
      certificateId: row.certificate_id,
      bidderId: row.bidder_id,
      interestRate: typeof row.interest_rate === 'number' ? row.interest_rate : parseFloat(row.interest_rate),
      timestamp: new Date(row.timestamp),
      status: row.status as BidStatus,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
} 