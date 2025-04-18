"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRepository = void 0;
const database_1 = require("../config/database");
const entities_1 = require("../models/entities");
class CertificateRepository {
    repository;
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(entities_1.Certificate);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByCertificateNumber(certificateNumber) {
        return this.repository.findOneBy({ certificateNumber });
    }
    async findByCounty(countyId) {
        return this.repository.findBy({ countyId });
    }
    async findByAuction(auctionId) {
        return this.repository.findBy({ auctionId });
    }
    async findByProperty(propertyId) {
        return this.repository.findBy({ propertyId });
    }
    async findByStatus(status) {
        return this.repository.findBy({ status });
    }
    async create(certificateData) {
        const certificate = this.repository.create(certificateData);
        return this.repository.save(certificate);
    }
    async update(id, certificateData) {
        const updateResult = await this.repository.update(id, certificateData);
        if (updateResult.affected === 0) {
            return null;
        }
        return this.findById(id);
    }
    async delete(id) {
        const deleteResult = await this.repository.delete(id);
        return deleteResult.affected ? deleteResult.affected > 0 : false;
    }
    async findWithRelations(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['county', 'property', 'auction']
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.repository.createQueryBuilder('certificate')
            .where('certificate.issueDate >= :startDate', { startDate })
            .andWhere('certificate.issueDate <= :endDate', { endDate })
            .getMany();
    }
    async findByInterestRange(minRate, maxRate) {
        return this.repository.createQueryBuilder('certificate')
            .where('certificate.interestRate >= :minRate', { minRate })
            .andWhere('certificate.interestRate <= :maxRate', { maxRate })
            .getMany();
    }
    async searchCertificates(searchParams) {
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
exports.certificateRepository = new CertificateRepository();
exports.default = exports.certificateRepository;
//# sourceMappingURL=certificate.repository.js.map