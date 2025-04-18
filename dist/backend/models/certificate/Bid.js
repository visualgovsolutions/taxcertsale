"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidService = exports.BidStatus = void 0;
/**
 * Bid Status
 */
var BidStatus;
(function (BidStatus) {
    BidStatus["ACTIVE"] = "active";
    BidStatus["OUTBID"] = "outbid";
    BidStatus["WINNING"] = "winning";
    BidStatus["CANCELLED"] = "cancelled";
})(BidStatus || (exports.BidStatus = BidStatus = {}));
/**
 * Bid Service Class
 */
class BidService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    /**
     * Place a new bid
     */
    async placeBid(bid) {
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
    async getBidById(id) {
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
    async getBidsForCertificate(certificateId) {
        const query = 'SELECT * FROM bids WHERE certificate_id = $1 ORDER BY timestamp DESC';
        const result = await this.pool.query(query, [certificateId]);
        return result.rows.map(row => this.mapRowToBid(row));
    }
    /**
     * Get active bids for a certificate
     */
    async getActiveBidsForCertificate(certificateId) {
        const query = 'SELECT * FROM bids WHERE certificate_id = $1 AND status = $2 ORDER BY interest_rate ASC, timestamp ASC';
        const result = await this.pool.query(query, [certificateId, BidStatus.ACTIVE]);
        return result.rows.map(row => this.mapRowToBid(row));
    }
    /**
     * Get lowest bid for a certificate
     */
    async getLowestBidForCertificate(certificateId) {
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
    async updateBidStatus(id, status) {
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
    async updateBidsToOutbid(certificateId, winningBidId) {
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
        // Handle potential null value for rowCount
        return result.rowCount ?? 0;
    }
    /**
     * Get bids by bidder
     */
    async getBidsByBidder(bidderId) {
        const query = 'SELECT * FROM bids WHERE bidder_id = $1 ORDER BY timestamp DESC';
        const result = await this.pool.query(query, [bidderId]);
        return result.rows.map(row => this.mapRowToBid(row));
    }
    /**
     * Get active bids by bidder
     */
    async getActiveBidsByBidder(bidderId) {
        const query = 'SELECT * FROM bids WHERE bidder_id = $1 AND status = $2 ORDER BY timestamp DESC';
        const result = await this.pool.query(query, [bidderId, BidStatus.ACTIVE]);
        return result.rows.map(row => this.mapRowToBid(row));
    }
    /**
     * Get winning bids by bidder
     */
    async getWinningBidsByBidder(bidderId) {
        const query = 'SELECT * FROM bids WHERE bidder_id = $1 AND status = $2 ORDER BY timestamp DESC';
        const result = await this.pool.query(query, [bidderId, BidStatus.WINNING]);
        return result.rows.map(row => this.mapRowToBid(row));
    }
    /**
     * Map database row to Bid object
     */
    mapRowToBid(row) {
        return {
            id: row.id,
            certificateId: row.certificate_id,
            bidderId: row.bidder_id,
            interestRate: typeof row.interest_rate === 'number' ? row.interest_rate : parseFloat(row.interest_rate),
            timestamp: new Date(row.timestamp),
            status: row.status,
            ipAddress: row.ip_address,
            userAgent: row.user_agent,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        };
    }
}
exports.BidService = BidService;
//# sourceMappingURL=Bid.js.map