import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Bid, BidStatus } from '../models/entities/bid.entity';

class BidRepository {
  private repository: Repository<Bid>;

  constructor() {
    this.repository = AppDataSource.getRepository(Bid);
  }

  async findAll(): Promise<Bid[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Bid | null> {
    return this.repository.findOneBy({ id });
  }

  async findByAuction(auctionId: string): Promise<Bid[]> {
    return this.repository.find({ where: { auctionId } });
  }

  async findByCertificate(certificateId: string): Promise<Bid[]> {
    return this.repository.find({ where: { certificateId } });
  }

  async findByUser(userId: string): Promise<Bid[]> {
    return this.repository.find({ where: { userId } });
  }

  async create(bidData: Partial<Bid>): Promise<Bid> {
    const bid = this.repository.create(bidData);
    return this.repository.save(bid);
  }

  async update(id: string, bidData: Partial<Bid>): Promise<Bid | null> {
    const updateResult = await this.repository.update(id, bidData);
    if (updateResult.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async findActiveByAuction(auctionId: string): Promise<Bid[]> {
    return this.repository.find({ where: { auctionId, status: BidStatus.ACTIVE } });
  }

  async findLowestBidByCertificate(certificateId: string): Promise<Bid | null> {
    return this.repository.findOne({
      where: { certificateId },
      order: { interestRate: 'ASC' },
    });
  }

  async findByIdWithUser(id: string): Promise<Bid | null> {
    return this.repository
      .createQueryBuilder('bid')
      .leftJoinAndSelect('bid.user', 'user')
      .where('bid.id = :id', { id })
      .getOne();
  }

  async findByIdWithRelations(id: string): Promise<Bid | null> {
    return this.repository
      .createQueryBuilder('bid')
      .leftJoinAndSelect('bid.user', 'user')
      .leftJoinAndSelect('bid.certificate', 'certificate')
      .leftJoinAndSelect('bid.auction', 'auction')
      .where('bid.id = :id', { id })
      .getOne();
  }
}

export const bidRepository = new BidRepository();
export default bidRepository;
