import { EntityRepository, Repository } from 'typeorm';
import { Auction } from '../models/entities/auction.entity';

@EntityRepository(Auction)
export class AuctionRepository extends Repository<Auction> {
  async findUpcomingAuctions(): Promise<Auction[]> {
    return this.createQueryBuilder('auction')
      .where('auction.auctionDate > :now', { now: new Date() })
      .orderBy('auction.auctionDate', 'ASC')
      .getMany();
  }

  async findByCounty(countyId: string): Promise<Auction[]> {
    return this.createQueryBuilder('auction')
      .where('auction.countyId = :countyId', { countyId })
      .orderBy('auction.auctionDate', 'DESC')
      .getMany();
  }

  async findWithCertificates(auctionId: string): Promise<Auction | undefined> {
    return this.createQueryBuilder('auction')
      .leftJoinAndSelect('auction.certificates', 'certificate')
      .leftJoinAndSelect('certificate.property', 'property')
      .where('auction.id = :auctionId', { auctionId })
      .getOne();
  }

  async searchAuctions(searchTerm: string): Promise<Auction[]> {
    return this.createQueryBuilder('auction')
      .leftJoinAndSelect('auction.county', 'county')
      .where('auction.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('county.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('auction.auctionDate', 'DESC')
      .getMany();
  }
}
