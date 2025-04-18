import { User } from './user.entity';
import { Certificate } from './certificate.entity';
import { Auction } from './auction.entity';
export declare enum BidStatus {
    PENDING = "pending",
    ACTIVE = "active",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare class Bid {
    id: string;
    user: User;
    userId: string;
    certificate: Certificate;
    certificateId: string;
    auction: Auction;
    auctionId: string;
    amount: number;
    interestRate: number;
    status: BidStatus;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
