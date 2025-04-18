import { auctionRepository } from '../repositories';
import { Auction } from '../models/entities';
import { AuctionStatus } from '../models/entities/auction.entity';

export class AuctionService {
  async findAll(): Promise<Auction[]> {
    return auctionRepository.findAll();
  }

  async findById(id: string): Promise<Auction | null> {
    return auctionRepository.findById(id);
  }

  async findByCounty(countyId: string): Promise<Auction[]> {
    return auctionRepository.findByCounty(countyId);
  }

  async findByStatus(status: AuctionStatus): Promise<Auction[]> {
    return auctionRepository.findByStatus(status);
  }

  async findUpcoming(): Promise<Auction[]> {
    return auctionRepository.findUpcoming();
  }

  async findActive(): Promise<Auction[]> {
    return auctionRepository.findActive();
  }

  async findCompleted(): Promise<Auction[]> {
    return auctionRepository.findCompleted();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Auction[]> {
    return auctionRepository.findByDateRange(startDate, endDate);
  }

  async create(auctionData: Partial<Auction>): Promise<Auction> {
    // Set default status if not provided
    if (!auctionData.status) {
      auctionData.status = AuctionStatus.UPCOMING;
    }
    
    return auctionRepository.create(auctionData);
  }

  async update(id: string, auctionData: Partial<Auction>): Promise<Auction | null> {
    return auctionRepository.update(id, auctionData);
  }

  async delete(id: string): Promise<boolean> {
    return auctionRepository.delete(id);
  }

  async findWithCertificates(id: string): Promise<Auction | null> {
    return auctionRepository.findWithCertificates(id);
  }

  async findWithCounty(id: string): Promise<Auction | null> {
    return auctionRepository.findWithCounty(id);
  }

  async findWithRelations(id: string): Promise<Auction | null> {
    return auctionRepository.findWithRelations(id);
  }

  async activateAuction(id: string): Promise<Auction | null> {
    return auctionRepository.activateAuction(id);
  }

  async completeAuction(id: string): Promise<Auction | null> {
    return auctionRepository.completeAuction(id);
  }

  async cancelAuction(id: string): Promise<Auction | null> {
    return auctionRepository.cancelAuction(id);
  }
}

export const auctionService = new AuctionService();
export default auctionService;
