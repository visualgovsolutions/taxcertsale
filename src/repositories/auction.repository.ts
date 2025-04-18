import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Auction } from '../models/entities/auction.entity';
import { AuctionStatus } from '../models/entities/auction.entity';

/**
 * Auction State Machine
 * 
 * This repository implements a state machine for auction status transitions:
 * 
 * Valid Transitions:
 * - UPCOMING -> ACTIVE (via activateAuction)
 * - ACTIVE -> COMPLETED (via completeAuction)
 * - UPCOMING -> CANCELLED (via cancelAuction)
 * - ACTIVE -> CANCELLED (via cancelAuction)
 * 
 * Invalid Transitions (will return null):
 * - COMPLETED -> Any other state
 * - CANCELLED -> Any other state
 * - ACTIVE -> UPCOMING
 * - Any auction that doesn't exist
 * 
 * State Effects:
 * - Only ACTIVE auctions can accept bids
 * - UPCOMING auctions are in preparation phase
 * - COMPLETED auctions are finalized and read-only
 * - CANCELLED auctions are terminated prematurely and read-only
 */
class AuctionRepository {
  private repository: Repository<Auction>;

  constructor() {
    this.repository = AppDataSource.getRepository(Auction);
  }

  async findAll(): Promise<Auction[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Auction | null> {
    return this.repository.findOneBy({ id });
  }

  async findByCounty(countyId: string): Promise<Auction[]> {
    return this.repository.findBy({ countyId });
  }

  async findByStatus(status: AuctionStatus): Promise<Auction[]> {
    return this.repository.findBy({ status });
  }

  async findUpcoming(): Promise<Auction[]> {
    return this.repository.find({
      where: { status: AuctionStatus.UPCOMING },
      order: { auctionDate: 'ASC' }
    });
  }

  async findActive(): Promise<Auction[]> {
    return this.repository.find({
      where: { status: AuctionStatus.ACTIVE },
      order: { auctionDate: 'ASC' }
    });
  }

  async findCompleted(): Promise<Auction[]> {
    return this.repository.find({
      where: { status: AuctionStatus.COMPLETED },
      order: { auctionDate: 'DESC' }
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Auction[]> {
    return this.repository.find({
      where: { auctionDate: Between(startDate, endDate) },
      order: { auctionDate: 'ASC' }
    });
  }

  async findUpcomingByDateRange(startDate: Date, endDate: Date): Promise<Auction[]> {
    return this.repository.find({
      where: {
        auctionDate: Between(startDate, endDate),
        status: AuctionStatus.UPCOMING
      },
      order: { auctionDate: 'ASC' }
    });
  }

  async findBeforeDate(date: Date): Promise<Auction[]> {
    return this.repository.find({
      where: { auctionDate: LessThanOrEqual(date) },
      order: { auctionDate: 'DESC' }
    });
  }

  async findAfterDate(date: Date): Promise<Auction[]> {
    return this.repository.find({
      where: { auctionDate: MoreThanOrEqual(date) },
      order: { auctionDate: 'ASC' }
    });
  }

  async create(auctionData: Partial<Auction>): Promise<Auction> {
    const auction = this.repository.create(auctionData);
    return this.repository.save(auction);
  }

  async update(id: string, auctionData: Partial<Auction>): Promise<Auction | null> {
    const updateResult = await this.repository.update(id, auctionData);
    
    if (updateResult.affected === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async findWithCertificates(id: string): Promise<Auction | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['certificates']
    });
  }

  async findWithCounty(id: string): Promise<Auction | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['county']
    });
  }

  async findWithRelations(id: string): Promise<Auction | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['county', 'certificates']
    });
  }

  async activateAuction(id: string): Promise<Auction | null> {
    const auction = await this.findById(id);
    if (!auction) {
      return null;
    }
    if (auction.status !== AuctionStatus.UPCOMING) {
      // Only allow activation from UPCOMING
      return null;
    }
    auction.status = AuctionStatus.ACTIVE;
    return this.repository.save(auction);
  }

  async completeAuction(id: string): Promise<Auction | null> {
    const auction = await this.findById(id);
    if (!auction) {
      return null;
    }
    if (auction.status !== AuctionStatus.ACTIVE) {
      // Only allow completion from ACTIVE
      return null;
    }
    auction.status = AuctionStatus.COMPLETED;
    return this.repository.save(auction);
  }

  async cancelAuction(id: string): Promise<Auction | null> {
    const auction = await this.findById(id);
    if (!auction) {
      return null;
    }
    if (auction.status !== AuctionStatus.UPCOMING && auction.status !== AuctionStatus.ACTIVE) {
      // Only allow cancellation from UPCOMING or ACTIVE
      return null;
    }
    auction.status = AuctionStatus.CANCELLED;
    return this.repository.save(auction);
  }
}

export const auctionRepository = new AuctionRepository();
export default auctionRepository;
