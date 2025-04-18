import { County } from './county.entity';
import { Property } from './property.entity';
import { Auction } from './auction.entity';
import { Bid } from './bid.entity';
export declare enum CertificateStatus {
    AVAILABLE = "available",
    SOLD = "sold",
    REDEEMED = "redeemed",
    EXPIRED = "expired"
}
export declare class Certificate {
    id: string;
    certificateNumber: string;
    auction: Auction;
    auctionId: string;
    property: Property;
    propertyId: string;
    county: County;
    countyId: string;
    faceValue: number;
    interestRate: number;
    issueDate: Date;
    status: CertificateStatus;
    soldDate?: Date;
    redeemedDate?: Date;
    redemptionAmount?: number;
    earningsAmount?: number;
    holderId?: string;
    metadata?: Record<string, any>;
    bids: Bid[];
    createdAt: Date;
    updatedAt: Date;
}
