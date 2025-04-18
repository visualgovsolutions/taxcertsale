import { propertyRepository } from '../repositories';
import { Property } from '../models/entities';

export class PropertyService {
  async findAll(): Promise<Property[]> {
    return propertyRepository.findAll();
  }

  async findById(id: string): Promise<Property | null> {
    return propertyRepository.findById(id);
  }

  async findByParcelId(parcelId: string): Promise<Property | null> {
    return propertyRepository.findByParcelId(parcelId);
  }

  async findByCounty(countyId: string): Promise<Property[]> {
    return propertyRepository.findByCounty(countyId);
  }

  async findByAddress(address: string): Promise<Property[]> {
    return propertyRepository.findByAddress(address);
  }

  async findByOwner(ownerName: string): Promise<Property[]> {
    return propertyRepository.findByOwner(ownerName);
  }

  async create(propertyData: Partial<Property>): Promise<Property> {
    return propertyRepository.create(propertyData);
  }

  async update(id: string, propertyData: Partial<Property>): Promise<Property | null> {
    return propertyRepository.update(id, propertyData);
  }

  async delete(id: string): Promise<boolean> {
    return propertyRepository.delete(id);
  }

  async findWithCertificates(id: string): Promise<Property | null> {
    return propertyRepository.findWithCertificates(id);
  }

  async findWithCounty(id: string): Promise<Property | null> {
    return propertyRepository.findWithCounty(id);
  }

  async findWithRelations(id: string): Promise<Property | null> {
    return propertyRepository.findWithRelations(id);
  }

  async searchProperties(
    searchParams: {
      countyId?: string;
      address?: string;
      parcelId?: string;
      ownerName?: string;
      propertyType?: string;
      zoning?: string;
      minLandArea?: number;
      maxLandArea?: number;
      minBuildingArea?: number;
      maxBuildingArea?: number;
    }
  ): Promise<Property[]> {
    return propertyRepository.searchProperties(searchParams);
  }
}

export const propertyService = new PropertyService();
export default propertyService; 