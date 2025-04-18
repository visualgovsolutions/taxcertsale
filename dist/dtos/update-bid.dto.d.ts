import { BidStatus } from '../models/entities/bid.entity';
export declare class UpdateBidDto {
    amount?: number;
    interestRate?: number;
    status?: BidStatus;
    notes?: string;
    metadata?: Record<string, any>;
}
