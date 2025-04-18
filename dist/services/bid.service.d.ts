import { Bid } from '../models/entities/bid.entity';
export declare class BidService {
    findAll(): Promise<Bid[]>;
    findById(id: string): Promise<Bid | null>;
    findByAuction(auctionId: string): Promise<Bid[]>;
    findByCertificate(certificateId: string): Promise<Bid[]>;
    findByUser(userId: string): Promise<Bid[]>;
    create(bidData: Partial<Bid>): Promise<Bid>;
    update(id: string, bidData: Partial<Bid>): Promise<Bid | null>;
    delete(id: string): Promise<boolean>;
    findActiveByAuction(auctionId: string): Promise<Bid[]>;
}
export declare const bidService: BidService;
export default bidService;
