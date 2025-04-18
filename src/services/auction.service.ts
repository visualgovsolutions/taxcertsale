import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Auction, AuctionStatus } from '../models/entities/auction.entity';
import { County } from '../models/entities/county.entity';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { UpdateAuctionDto } from '../dtos/update-auction.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private auctionRepository: Repository<Auction>,
    @InjectRepository(County)
    private countyRepository: Repository<County>
  ) {}

  async findAll(): Promise<Auction[]> {
    return this.auctionRepository.find({
      relations: ['county'],
    });
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['county', 'certificates'],
    });

    if (!auction) {
      throw new NotFoundException(`Auction with ID "${id}" not found`);
    }

    return auction;
  }

  async findByCounty(countyId: string): Promise<Auction[]> {
    return this.auctionRepository.find({
      where: { countyId },
      relations: ['county'],
    });
  }

  async findUpcoming(): Promise<Auction[]> {
    const now = new Date();
    return this.auctionRepository.find({
      where: {
        auctionDate: MoreThan(now),
        status: AuctionStatus.UPCOMING,
      },
      relations: ['county'],
      order: {
        auctionDate: 'ASC',
      },
    });
  }

  async findWithCertificates(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOne(id);
    if (!auction) {
      throw new Error(`Auction with ID "${id}" not found`);
    }
    return auction;
  }

  async create(auctionData: Partial<Auction>): Promise<Auction> {
    const auction = this.auctionRepository.create(auctionData);
    return this.auctionRepository.save(auction);
  }

  async update(id: string, auctionData: Partial<Auction>): Promise<Auction> {
    await this.auctionRepository.update(id, auctionData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.auctionRepository.delete(id);
  }

  async startAuction(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.UPCOMING) {
      throw new Error('Only upcoming auctions can be started');
    }

    auction.status = AuctionStatus.ACTIVE;
    auction.startTime = new Date();

    return this.auctionRepository.save(auction);
  }

  async endAuction(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new Error('Only active auctions can be ended');
    }

    auction.status = AuctionStatus.COMPLETED;
    auction.endTime = new Date();

    return this.auctionRepository.save(auction);
  }

  async cancelAuction(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status === AuctionStatus.COMPLETED) {
      throw new Error('Completed auctions cannot be cancelled');
    }

    auction.status = AuctionStatus.CANCELLED;

    return this.auctionRepository.save(auction);
  }

  async search(searchTerm: string): Promise<Auction[]> {
    return this.auctionRepository.searchAuctions(searchTerm);
  }
}
