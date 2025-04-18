"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = exports.CertificateStatus = void 0;
/**
 * Certificate Status
 */
var CertificateStatus;
(function (CertificateStatus) {
    CertificateStatus["PENDING"] = "pending";
    CertificateStatus["AVAILABLE"] = "available";
    CertificateStatus["AUCTION_SCHEDULED"] = "auction_scheduled";
    CertificateStatus["AUCTION_ACTIVE"] = "auction_active";
    CertificateStatus["AUCTION_CLOSED"] = "auction_closed";
    CertificateStatus["SOLD"] = "sold";
    CertificateStatus["REDEEMED"] = "redeemed";
    CertificateStatus["EXPIRED"] = "expired";
})(CertificateStatus || (exports.CertificateStatus = CertificateStatus = {}));
/**
 * Certificate Service Class
 */
class CertificateService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    /**
     * Create a new certificate
     */
    async createCertificate(certificate) {
        const now = new Date();
        const query = `
      INSERT INTO certificates (
        certificate_number, county_id, parcel_id, property_address, owner_name,
        face_value, auction_date, status, interest_rate, purchaser_id,
        purchase_date, redemption_date, expiration_date, batch_id, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
        const values = [
            certificate.certificateNumber,
            certificate.countyId,
            certificate.parcelId,
            certificate.propertyAddress || null,
            certificate.ownerName || null,
            certificate.faceValue,
            certificate.auctionDate || null,
            certificate.status,
            certificate.interestRate || null,
            certificate.purchaserId || null,
            certificate.purchaseDate || null,
            certificate.redemptionDate || null,
            certificate.expirationDate || null,
            certificate.batchId || null,
            now,
            now
        ];
        const result = await this.pool.query(query, values);
        return this.mapRowToCertificate(result.rows[0]);
    }
    /**
     * Get a certificate by ID
     */
    async getCertificateById(id) {
        const query = 'SELECT * FROM certificates WHERE id = $1';
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToCertificate(result.rows[0]);
    }
    /**
     * Get certificates by batch ID
     */
    async getCertificatesByBatchId(batchId) {
        const query = 'SELECT * FROM certificates WHERE batch_id = $1';
        const result = await this.pool.query(query, [batchId]);
        return result.rows.map(row => this.mapRowToCertificate(row));
    }
    /**
     * Update certificate status
     */
    async updateCertificateStatus(id, status) {
        const query = `
      UPDATE certificates 
      SET status = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;
        const result = await this.pool.query(query, [status, new Date(), id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToCertificate(result.rows[0]);
    }
    /**
     * Update certificate after successful bid
     */
    async updateCertificateAfterBid(id, purchaserId, interestRate) {
        const now = new Date();
        const query = `
      UPDATE certificates 
      SET status = $1, purchaser_id = $2, interest_rate = $3, 
          purchase_date = $4, updated_at = $5
      WHERE id = $6
      RETURNING *
    `;
        const values = [
            CertificateStatus.SOLD,
            purchaserId,
            interestRate,
            now,
            now,
            id
        ];
        const result = await this.pool.query(query, values);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToCertificate(result.rows[0]);
    }
    /**
     * Assign certificates to a batch
     */
    async assignCertificatesToBatch(certificateIds, batchId) {
        const now = new Date();
        const query = `
      UPDATE certificates 
      SET batch_id = $1, status = $2, updated_at = $3
      WHERE id = ANY($4)
      RETURNING *
    `;
        const values = [
            batchId,
            CertificateStatus.AUCTION_SCHEDULED,
            now,
            certificateIds
        ];
        const result = await this.pool.query(query, values);
        // Handle potential null value for rowCount
        return result.rowCount ?? 0;
    }
    /**
     * Map database row to Certificate object
     */
    mapRowToCertificate(row) {
        // Ensure faceValue is always a valid number, default to 0 if parsing fails
        const faceValueParsed = parseFloat(row.face_value);
        const finalFaceValue = isNaN(faceValueParsed) ? 0 : faceValueParsed;
        return {
            id: row.id,
            certificateNumber: row.certificate_number,
            countyId: row.county_id,
            parcelId: row.parcel_id,
            propertyAddress: row.property_address,
            ownerName: row.owner_name,
            faceValue: finalFaceValue, // Use validated value
            auctionDate: row.auction_date ? new Date(row.auction_date) : undefined,
            status: row.status,
            interestRate: row.interest_rate !== null ? parseFloat(row.interest_rate) : undefined,
            purchaserId: row.purchaser_id,
            purchaseDate: row.purchase_date ? new Date(row.purchase_date) : undefined,
            redemptionDate: row.redemption_date ? new Date(row.redemption_date) : undefined,
            expirationDate: row.expiration_date ? new Date(row.expiration_date) : undefined,
            batchId: row.batch_id,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at)
        };
    }
}
exports.CertificateService = CertificateService;
//# sourceMappingURL=Certificate.js.map