import { Repository, ILike } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Property } from '../models/entities';

class PropertyRepository {
  private repository: Repository<Property>;

  constructor() {
    this.repository = AppDataSource.getRepository(Property);
  }

  async findAll(): Promise<Property[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Property | null> {
    return this.repository.findOneBy({ id });
  }

  async findByParcelId(parcelId: string): Promise<Property | null> {
    return this.repository.findOneBy({ parcelId });
  }

  async findByCounty(countyId: string): Promise<Property[]> {
    return this.repository.findBy({ countyId });
  }

  async findByAddress(address: string): Promise<Property[]> {
    return this.repository.findBy({ address: ILike(`%${address}%`) });
  }

  async findByOwner(ownerName: string): Promise<Property[]> {
    return this.repository.findBy({ ownerName: ILike(`%${ownerName}%`) });
  }

  async create(propertyData: Partial<Property>): Promise<Property> {
    const property = this.repository.create(propertyData);
    return this.repository.save(property);
  }

  async update(id: string, propertyData: Partial<Property>): Promise<Property | null> {
    const updateResult = await this.repository.update(id, propertyData);
    
    if (updateResult.affected === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async findWithCertificates(id: string): Promise<Property | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['certificates']
    });
  }

  async findWithCounty(id: string): Promise<Property | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['county']
    });
  }

  async findWithRelations(id: string): Promise<Property | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['county', 'certificates']
    });
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
    const queryBuilder = this.repository.createQueryBuilder('property');
    
    if (searchParams.countyId) {
      queryBuilder.andWhere('property.countyId = :countyId', { countyId: searchParams.countyId });
    }
    
    if (searchParams.address) {
      queryBuilder.andWhere('property.address ILIKE :address', { address: `%${searchParams.address}%` });
    }
    
    if (searchParams.parcelId) {
      queryBuilder.andWhere('property.parcelId ILIKE :parcelId', { parcelId: `%${searchParams.parcelId}%` });
    }
    
    if (searchParams.ownerName) {
      queryBuilder.andWhere('property.ownerName ILIKE :ownerName', { ownerName: `%${searchParams.ownerName}%` });
    }
    
    if (searchParams.propertyType) {
      queryBuilder.andWhere('property.propertyType = :propertyType', { propertyType: searchParams.propertyType });
    }
    
    if (searchParams.zoning) {
      queryBuilder.andWhere('property.zoning = :zoning', { zoning: searchParams.zoning });
    }
    
    if (searchParams.minLandArea) {
      queryBuilder.andWhere('property.landArea >= :minLandArea', { minLandArea: searchParams.minLandArea });
    }
    
    if (searchParams.maxLandArea) {
      queryBuilder.andWhere('property.landArea <= :maxLandArea', { maxLandArea: searchParams.maxLandArea });
    }
    
    if (searchParams.minBuildingArea) {
      queryBuilder.andWhere('property.buildingArea >= :minBuildingArea', { minBuildingArea: searchParams.minBuildingArea });
    }
    
    if (searchParams.maxBuildingArea) {
      queryBuilder.andWhere('property.buildingArea <= :maxBuildingArea', { maxBuildingArea: searchParams.maxBuildingArea });
    }
    
    return queryBuilder.getMany();
  }
}

export const propertyRepository = new PropertyRepository();
export default propertyRepository; 