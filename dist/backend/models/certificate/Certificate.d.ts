import { Pool } from 'pg';
/**
 * Certificate Status
 */
export declare enum CertificateStatus {
    PENDING = "pending",
    AVAILABLE = "available",
    AUCTION_SCHEDULED = "auction_scheduled",
    AUCTION_ACTIVE = "auction_active",
    AUCTION_CLOSED = "auction_closed",
    SOLD = "sold",
    REDEEMED = "redeemed",
    EXPIRED = "expired"
}
/**
 * Certificate Interface
 */
export interface Certificate {
    id: string;
    certificateNumber: string;
    countyId: string;
    parcelId: string;
    propertyAddress?: string;
    ownerName?: string;
    faceValue: number;
    auctionDate?: Date;
    status: CertificateStatus;
    interestRate?: number;
    purchaserId?: string;
    purchaseDate?: Date;
    redemptionDate?: Date;
    expirationDate?: Date;
    batchId?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Certificate Service Class
 */
export declare class CertificateService {
    private pool;
    constructor(pool: Pool);
    /**
     * Create a new certificate
     */
    createCertificate(certificate: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Certificate>;
    /**
     * Get a certificate by ID
     */
    getCertificateById(id: string): Promise<Certificate | null>;
    /**
     * Get certificates by batch ID
     */
    getCertificatesByBatchId(batchId: string): Promise<Certificate[]>;
    /**
     * Update certificate status
     */
    updateCertificateStatus(id: string, status: CertificateStatus): Promise<Certificate | null>;
    /**
     * Update certificate after successful bid
     */
    updateCertificateAfterBid(id: string, purchaserId: string, interestRate: number): Promise<Certificate | null>;
    /**
     * Assign certificates to a batch
     */
    assignCertificatesToBatch(certificateIds: string[], batchId: string): Promise<number>;
    /**
     * Map database row to Certificate object
     */
    private mapRowToCertificate;
}
