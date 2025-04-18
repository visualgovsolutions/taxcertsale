import { Certificate } from '../models/entities';
import { CertificateStatus } from '../models/entities/certificate.entity';
declare class CertificateRepository {
    private repository;
    constructor();
    findAll(): Promise<Certificate[]>;
    findById(id: string): Promise<Certificate | null>;
    findByCertificateNumber(certificateNumber: string): Promise<Certificate | null>;
    findByCounty(countyId: string): Promise<Certificate[]>;
    findByAuction(auctionId: string): Promise<Certificate[]>;
    findByProperty(propertyId: string): Promise<Certificate[]>;
    findByStatus(status: CertificateStatus): Promise<Certificate[]>;
    create(certificateData: Partial<Certificate>): Promise<Certificate>;
    update(id: string, certificateData: Partial<Certificate>): Promise<Certificate | null>;
    delete(id: string): Promise<boolean>;
    findWithRelations(id: string): Promise<Certificate | null>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Certificate[]>;
    findByInterestRange(minRate: number, maxRate: number): Promise<Certificate[]>;
    searchCertificates(searchParams: {
        countyId?: string;
        status?: CertificateStatus;
        minInterestRate?: number;
        maxInterestRate?: number;
        minFaceValue?: number;
        maxFaceValue?: number;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Certificate[]>;
}
export declare const certificateRepository: CertificateRepository;
export default certificateRepository;
