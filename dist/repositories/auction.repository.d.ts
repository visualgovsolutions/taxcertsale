import { Auction, AuctionStatus } from '../models/entities';
declare class AuctionRepository {
    private repository;
    constructor();
    findAll(): Promise<Auction[]>;
    findById(id: string): Promise<Auction | null>;
    findByCounty(countyId: string): Promise<Auction[]>;
    findByStatus(status: AuctionStatus): Promise<Auction[]>;
    findUpcoming(): Promise<Auction[]>;
    findActive(): Promise<Auction[]>;
    findCompleted(): Promise<Auction[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Auction[]>;
    findUpcomingByDateRange(startDate: Date, endDate: Date): Promise<Auction[]>;
    findBeforeDate(date: Date): Promise<Auction[]>;
    findAfterDate(date: Date): Promise<Auction[]>;
    create(auctionData: Partial<Auction>): Promise<Auction>;
    update(id: string, auctionData: Partial<Auction>): Promise<Auction | null>;
    delete(id: string): Promise<boolean>;
    findWithCertificates(id: string): Promise<Auction | null>;
    findWithCounty(id: string): Promise<Auction | null>;
    findWithRelations(id: string): Promise<Auction | null>;
    activateAuction(id: string): Promise<Auction | null>;
    completeAuction(id: string): Promise<Auction | null>;
    cancelAuction(id: string): Promise<Auction | null>;
}
export declare const auctionRepository: AuctionRepository;
export default auctionRepository;
