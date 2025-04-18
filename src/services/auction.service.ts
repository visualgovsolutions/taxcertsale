import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionRepository } from '../repositories/auction.repository';
import { Auction } from '../models/entities/auction.entity';
import { CreateAuctionDto } from '../dtos/create-auction.dto';
import { UpdateAuctionDto } from '../dtos/update-auction.dto';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(AuctionRepository)
    private auctionRepository: AuctionRepository
  ) {}

  async findAll(): Promise<Auction[]> {
    return this.auctionRepository.find();
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findOne(id);
    if (!auction) {
      throw new Error(`Auction with ID "${id}" not found`);
    }
    return auction;
  }

  async findUpcoming(): Promise<Auction[]> {
    return this.auctionRepository.findUpcomingAuctions();
  }

  async findByCounty(countyId: string): Promise<Auction[]> {
    return this.auctionRepository.findByCounty(countyId);
  }

  async findWithCertificates(id: string): Promise<Auction> {
    const auction = await this.auctionRepository.findWithCertificates(id);
    if (!auction) {
      throw new Error(`Auction with ID "${id}" not found`);
    }
    return auction;
  }

  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const auction = this.auctionRepository.create(createAuctionDto);
    return this.auctionRepository.save(auction);
  }

  async update(id: string, updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
    const auction = await this.findOne(id);

    // Update auction properties
    Object.assign(auction, updateAuctionDto);

    return this.auctionRepository.save(auction);
  }

  async remove(id: string): Promise<void> {
    const result = await this.auctionRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Auction with ID "${id}" not found`);
    }
  }

  async search(searchTerm: string): Promise<Auction[]> {
    return this.auctionRepository.searchAuctions(searchTerm);
  }
}
