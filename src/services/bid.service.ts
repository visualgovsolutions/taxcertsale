import { bidRepository } from '../repositories/bid.repository';
import { Bid } from '../models/entities/bid.entity';

export class BidService {
  async findAll(): Promise<Bid[]> {
    return bidRepository.findAll();
  }

  async findById(id: string): Promise<Bid | null> {
    return bidRepository.findById(id);
  }

  async findByAuction(auctionId: string): Promise<Bid[]> {
    return bidRepository.findByAuction(auctionId);
  }

  async findByCertificate(certificateId: string): Promise<Bid[]> {
    return bidRepository.findByCertificate(certificateId);
  }

  async findByUser(userId: string): Promise<Bid[]> {
    return bidRepository.findByUser(userId);
  }

  async create(bidData: Partial<Bid>): Promise<Bid> {
    // Add business logic for bid validation here if needed
    return bidRepository.create(bidData);
  }

  async update(id: string, bidData: Partial<Bid>): Promise<Bid | null> {
    return bidRepository.update(id, bidData);
  }

  async delete(id: string): Promise<boolean> {
    return bidRepository.delete(id);
  }

  async findActiveByAuction(auctionId: string): Promise<Bid[]> {
    return bidRepository.findActiveByAuction(auctionId);
  }
}

export const bidService = new BidService();
export default bidService;
