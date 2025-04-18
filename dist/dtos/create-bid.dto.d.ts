export declare class CreateBidDto {
    userId: string;
    certificateId: string;
    auctionId: string;
    amount: number;
    interestRate: number;
    notes?: string;
    metadata?: Record<string, any>;
}
