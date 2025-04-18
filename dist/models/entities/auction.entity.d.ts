import { Certificate } from './certificate.entity';
import { County } from './county.entity';
import { Bid } from './bid.entity';
export declare enum AuctionStatus {
    UPCOMING = "upcoming",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Auction {
    id: string;
    name: string;
    auctionDate: Date;
    startTime: string;
    endTime: string;
    status: AuctionStatus;
    description: string;
    location: string;
    registrationUrl: string;
    metadata?: Record<string, any>;
    countyId: string;
    county: County;
    certificates: Certificate[];
    bids: Bid[];
    createdAt: Date;
    updatedAt: Date;
}
