import { Pool } from 'pg';
/**
 * Certificate Batch Status
 */
export declare enum BatchStatus {
    SCHEDULED = "scheduled",
    ACTIVE = "active",
    CLOSING = "closing",
    CLOSED = "closed",
    CANCELLED = "cancelled"
}
/**
 * Certificate Batch Closing Interval
 */
export declare enum ClosingInterval {
    HOURLY = "hourly",
    DAILY = "daily",
    CUSTOM = "custom"
}
/**
 * Certificate Batch Interface
 */
export interface CertificateBatch {
    id: string;
    name: string;
    description?: string;
    countyId: string;
    status: BatchStatus;
    startTime: Date;
    endTime: Date;
    closingInterval: ClosingInterval;
    customIntervalMinutes?: number;
    certificates: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Certificate Batch Service Class
 */
export declare class CertificateBatchService {
    private pool;
    constructor(pool: Pool);
    /**
     * Create a new certificate batch
     */
    createBatch(batch: Omit<CertificateBatch, 'id' | 'createdAt' | 'updatedAt'>): Promise<CertificateBatch>;
    /**
     * Get a batch by ID
     */
    getBatchById(id: string): Promise<CertificateBatch | null>;
    /**
     * Get all active batches
     */
    getActiveBatches(): Promise<CertificateBatch[]>;
    /**
     * Update batch status
     */
    updateBatchStatus(id: string, status: BatchStatus): Promise<CertificateBatch | null>;
    /**
     * Get batches by county
     */
    getBatchesByCounty(countyId: string): Promise<CertificateBatch[]>;
    /**
     * Get scheduled batches that should be activated
     */
    getScheduledBatchesToActivate(): Promise<CertificateBatch[]>;
    /**
     * Get active batches that should be closed
     */
    getActiveBatchesToClose(): Promise<CertificateBatch[]>;
    /**
     * Map database row to CertificateBatch object
     */
    private mapRowToBatch;
}
