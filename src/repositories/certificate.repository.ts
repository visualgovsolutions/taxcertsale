import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Certificate } from '../models/entities';
import { CertificateStatus } from '../models/entities/certificate.entity';

class CertificateRepository {
  private repository: Repository<Certificate>;

  constructor() {
    this.repository = AppDataSource.getRepository(Certificate);
  }

  async findAll(): Promise<Certificate[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Certificate | null> {
    return this.repository.findOneBy({ id });
  }

  async findByCertificateNumber(certificateNumber: string): Promise<Certificate | null> {
    return this.repository.findOneBy({ certificateNumber });
  }

  async findByCounty(countyId: string): Promise<Certificate[]> {
    return this.repository.findBy({ countyId });
  }

  async findByAuction(auctionId: string): Promise<Certificate[]> {
    return this.repository.findBy({ auctionId });
  }

  async findByProperty(propertyId: string): Promise<Certificate[]> {
    return this.repository.findBy({ propertyId });
  }

  async findByStatus(status: CertificateStatus): Promise<Certificate[]> {
    return this.repository.findBy({ status });
  }

  async create(certificateData: Partial<Certificate>): Promise<Certificate> {
    const certificate = this.repository.create(certificateData);
    return this.repository.save(certificate);
  }

  async update(id: string, certificateData: Partial<Certificate>): Promise<Certificate | null> {
    const updateResult = await this.repository.update(id, certificateData);
    
    if (updateResult.affected === 0) {
      return null;
    }
    
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.repository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async findWithRelations(id: string): Promise<Certificate | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['county', 'property', 'auction']
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Certificate[]> {
    return this.repository.createQueryBuilder('certificate')
      .where('certificate.issueDate >= :startDate', { startDate })
      .andWhere('certificate.issueDate <= :endDate', { endDate })
      .getMany();
  }

  async findByInterestRange(minRate: number, maxRate: number): Promise<Certificate[]> {
    return this.repository.createQueryBuilder('certificate')
      .where('certificate.interestRate >= :minRate', { minRate })
      .andWhere('certificate.interestRate <= :maxRate', { maxRate })
      .getMany();
  }

  async searchCertificates(
    searchParams: {
      countyId?: string;
      status?: CertificateStatus;
      minInterestRate?: number;
      maxInterestRate?: number;
      minFaceValue?: number;
      maxFaceValue?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Certificate[]> {
    const queryBuilder = this.repository.createQueryBuilder('certificate');
    
    if (searchParams.countyId) {
      queryBuilder.andWhere('certificate.countyId = :countyId', { countyId: searchParams.countyId });
    }
    
    if (searchParams.status) {
      queryBuilder.andWhere('certificate.status = :status', { status: searchParams.status });
    }
    
    if (searchParams.minInterestRate) {
      queryBuilder.andWhere('certificate.interestRate >= :minRate', { minRate: searchParams.minInterestRate });
    }
    
    if (searchParams.maxInterestRate) {
      queryBuilder.andWhere('certificate.interestRate <= :maxRate', { maxRate: searchParams.maxInterestRate });
    }
    
    if (searchParams.minFaceValue) {
      queryBuilder.andWhere('certificate.faceValue >= :minValue', { minValue: searchParams.minFaceValue });
    }
    
    if (searchParams.maxFaceValue) {
      queryBuilder.andWhere('certificate.faceValue <= :maxValue', { maxValue: searchParams.maxFaceValue });
    }
    
    if (searchParams.startDate) {
      queryBuilder.andWhere('certificate.issueDate >= :startDate', { startDate: searchParams.startDate });
    }
    
    if (searchParams.endDate) {
      queryBuilder.andWhere('certificate.issueDate <= :endDate', { endDate: searchParams.endDate });
    }
    
    return queryBuilder.getMany();
  }
}

export const certificateRepository = new CertificateRepository();
export default certificateRepository; 