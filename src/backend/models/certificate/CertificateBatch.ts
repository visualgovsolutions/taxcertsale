import { Pool } from 'pg';

/**
 * Certificate Batch Status
 */
export enum BatchStatus {
  SCHEDULED = 'scheduled',
  ACTIVE = 'active',
  CLOSING = 'closing',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

/**
 * Certificate Batch Closing Interval
 */
export enum ClosingInterval {
  HOURLY = 'hourly',
  DAILY = 'daily',
  CUSTOM = 'custom'
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
  certificates: string[]; // Array of certificate IDs
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Certificate Batch Service Class
 */
export class CertificateBatchService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Create a new certificate batch
   */
  async createBatch(batch: Omit<CertificateBatch, 'id' | 'createdAt' | 'updatedAt'>): Promise<CertificateBatch> {
    const now = new Date();
    
    const query = `
      INSERT INTO certificate_batches (
        name, description, county_id, status, start_time, end_time, 
        closing_interval, custom_interval_minutes, certificates, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      batch.name,
      batch.description || null,
      batch.countyId,
      batch.status,
      batch.startTime,
      batch.endTime,
      batch.closingInterval,
      batch.customIntervalMinutes || null,
      JSON.stringify(batch.certificates),
      now,
      now
    ];
    
    const result = await this.pool.query(query, values);
    return this.mapRowToBatch(result.rows[0]);
  }

  /**
   * Get a batch by ID
   */
  async getBatchById(id: string): Promise<CertificateBatch | null> {
    const query = 'SELECT * FROM certificate_batches WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBatch(result.rows[0]);
  }

  /**
   * Get all active batches
   */
  async getActiveBatches(): Promise<CertificateBatch[]> {
    const query = 'SELECT * FROM certificate_batches WHERE status = $1';
    const result = await this.pool.query(query, [BatchStatus.ACTIVE]);
    
    return result.rows.map(row => this.mapRowToBatch(row));
  }

  /**
   * Update batch status
   */
  async updateBatchStatus(id: string, status: BatchStatus): Promise<CertificateBatch | null> {
    const query = `
      UPDATE certificate_batches 
      SET status = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [status, new Date(), id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToBatch(result.rows[0]);
  }

  /**
   * Get batches by county
   */
  async getBatchesByCounty(countyId: string): Promise<CertificateBatch[]> {
    const query = 'SELECT * FROM certificate_batches WHERE county_id = $1';
    const result = await this.pool.query(query, [countyId]);
    
    return result.rows.map(row => this.mapRowToBatch(row));
  }

  /**
   * Get scheduled batches that should be activated
   */
  async getScheduledBatchesToActivate(): Promise<CertificateBatch[]> {
    const now = new Date();
    
    const query = `
      SELECT * FROM certificate_batches 
      WHERE status = $1 AND start_time <= $2
    `;
    
    const result = await this.pool.query(query, [BatchStatus.SCHEDULED, now]);
    
    return result.rows.map(row => this.mapRowToBatch(row));
  }

  /**
   * Get active batches that should be closed
   */
  async getActiveBatchesToClose(): Promise<CertificateBatch[]> {
    const now = new Date();
    
    const query = `
      SELECT * FROM certificate_batches 
      WHERE status = $1 AND end_time <= $2
    `;
    
    const result = await this.pool.query(query, [BatchStatus.ACTIVE, now]);
    
    return result.rows.map(row => this.mapRowToBatch(row));
  }

  /**
   * Map database row to CertificateBatch object
   */
  private mapRowToBatch(row: any): CertificateBatch {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      countyId: row.county_id,
      status: row.status as BatchStatus,
      startTime: new Date(row.start_time),
      endTime: new Date(row.end_time),
      closingInterval: row.closing_interval as ClosingInterval,
      customIntervalMinutes: row.custom_interval_minutes,
      certificates: typeof row.certificates === 'string' 
        ? JSON.parse(row.certificates) 
        : row.certificates,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
} 