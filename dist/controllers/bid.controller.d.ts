import { BidService } from '../services/bid.service';
import { CreateBidDto } from '../dtos/create-bid.dto';
import { UpdateBidDto } from '../dtos/update-bid.dto';
import { Bid } from '../models/entities/bid.entity';
export declare class BidController {
    private readonly bidService;
    constructor(bidService: BidService);
    findAll(): Promise<Bid[]>;
    findById(id: string): Promise<Bid | null>;
    findByAuction(auctionId: string): Promise<Bid[]>;
    findByCertificate(certificateId: string): Promise<Bid[]>;
    findByUser(userId: string): Promise<Bid[]>;
    create(createBidDto: CreateBidDto): Promise<Bid>;
    update(id: string, updateBidDto: UpdateBidDto): Promise<Bid | null>;
    delete(id: string): Promise<boolean>;
}
