import { certificateRepository } from '../repositories';
import { Certificate, CertificateStatus } from '../models/entities';

export class CertificateService {
  async findAll(): Promise<Certificate[]> {
    return certificateRepository.findAll();
  }

  async findById(id: string): Promise<Certificate | null> {
    return certificateRepository.findById(id);
  }

  async findByCertificateNumber(certificateNumber: string): Promise<Certificate | null> {
    return certificateRepository.findByCertificateNumber(certificateNumber);
  }

  async findByCounty(countyId: string): Promise<Certificate[]> {
    return certificateRepository.findByCounty(countyId);
  }

  async findByAuction(auctionId: string): Promise<Certificate[]> {
    return certificateRepository.findByAuction(auctionId);
  }

  async findByProperty(propertyId: string): Promise<Certificate[]> {
    return certificateRepository.findByProperty(propertyId);
  }

  async findByStatus(status: CertificateStatus): Promise<Certificate[]> {
    return certificateRepository.findByStatus(status);
  }

  async create(certificateData: Partial<Certificate>): Promise<Certificate> {
    // Set default status if not provided
    if (!certificateData.status) {
      certificateData.status = CertificateStatus.AVAILABLE;
    }
    
    return certificateRepository.create(certificateData);
  }

  async update(id: string, certificateData: Partial<Certificate>): Promise<Certificate | null> {
    return certificateRepository.update(id, certificateData);
  }

  async delete(id: string): Promise<boolean> {
    return certificateRepository.delete(id);
  }

  async findWithRelations(id: string): Promise<Certificate | null> {
    return certificateRepository.findWithRelations(id);
  }

  async markAsSold(id: string, holderId?: string): Promise<Certificate | null> {
    const certificate = await this.findById(id);
    
    if (!certificate) {
      return null;
    }
    
    certificate.status = CertificateStatus.SOLD;
    certificate.soldDate = new Date();
    
    if (holderId) {
      certificate.holderId = holderId;
    }
    
    return certificateRepository.update(id, certificate);
  }

  async markAsRedeemed(id: string, redemptionAmount: number, earningsAmount?: number): Promise<Certificate | null> {
    const certificate = await this.findById(id);
    
    if (!certificate) {
      return null;
    }
    
    certificate.status = CertificateStatus.REDEEMED;
    certificate.redeemedDate = new Date();
    certificate.redemptionAmount = redemptionAmount;
    
    if (earningsAmount) {
      certificate.earningsAmount = earningsAmount;
    }
    
    return certificateRepository.update(id, certificate);
  }

  async markAsExpired(id: string): Promise<Certificate | null> {
    const certificate = await this.findById(id);
    
    if (!certificate) {
      return null;
    }
    
    certificate.status = CertificateStatus.EXPIRED;
    
    return certificateRepository.update(id, certificate);
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
    return certificateRepository.searchCertificates(searchParams);
  }
}

export const certificateService = new CertificateService();
export default certificateService; 