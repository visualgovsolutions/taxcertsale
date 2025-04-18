/**
 * Represents a bid placed on a tax certificate
 */
export interface Bid {
  /**
   * Unique ID of the bid
   */
  id: string;
  
  /**
   * ID of the certificate being bid on
   */
  certificateId: string;
  
  /**
   * ID of the user placing the bid
   */
  bidderId: string;
  
  /**
   * Interest rate of the bid (percentage)
   */
  interestRate: number;
  
  /**
   * Timestamp when the bid was placed
   */
  timestamp: Date;
  
  /**
   * IP address of the bidder (for audit purposes)
   */
  ipAddress?: string;
  
  /**
   * User agent of the bidder (for audit purposes)
   */
  userAgent?: string;
  
  /**
   * Status of the bid
   */
  status: 'pending' | 'accepted' | 'rejected' | 'winning';
} 