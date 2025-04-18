import { countyRepository } from '../repositories';
import { County } from '../models/entities';

export class CountyService {
  async findAll(): Promise<County[]> {
    return countyRepository.findAll();
  }

  async findById(id: string): Promise<County | null> {
    return countyRepository.findById(id);
  }

  async findByName(name: string): Promise<County | null> {
    return countyRepository.findByName(name);
  }

  async findByState(state: string): Promise<County[]> {
    return countyRepository.findByState(state);
  }

  async create(countyData: Partial<County>): Promise<County> {
    return countyRepository.create(countyData);
  }

  async update(id: string, countyData: Partial<County>): Promise<County | null> {
    return countyRepository.update(id, countyData);
  }

  async delete(id: string): Promise<boolean> {
    return countyRepository.delete(id);
  }

  async findWithProperties(id: string): Promise<County | null> {
    return countyRepository.findWithProperties(id);
  }

  async findWithCertificates(id: string): Promise<County | null> {
    return countyRepository.findWithCertificates(id);
  }

  async findWithAuctions(id: string): Promise<County | null> {
    return countyRepository.findWithAuctions(id);
  }
}

export const countyService = new CountyService();
export default countyService; 