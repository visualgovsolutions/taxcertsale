import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { County } from '../models/entities';

class CountyRepository {
  private repository: Repository<County>;

  constructor() {
    this.repository = AppDataSource.getRepository(County);
  }

  async findAll(): Promise<County[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<County | null> {
    return this.repository.findOneBy({ id });
  }

  async findByName(name: string): Promise<County | null> {
    return this.repository.findOneBy({ name });
  }

  async findByState(state: string): Promise<County[]> {
    return this.repository.findBy({ state });
  }

  async create(countyData: Partial<County>): Promise<County> {
    const county = this.repository.create(countyData);
    return this.repository.save(county);
  }

  async update(id: string, countyData: Partial<County>): Promise<County | null> {
    const updateResult = await this.repository.update(id, countyData);
    
    if (updateResult.affected === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async findWithProperties(id: string): Promise<County | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['properties']
    });
  }

  async findWithCertificates(id: string): Promise<County | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['certificates']
    });
  }

  async findWithAuctions(id: string): Promise<County | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['auctions']
    });
  }
}

export const countyRepository = new CountyRepository();
export default countyRepository; 