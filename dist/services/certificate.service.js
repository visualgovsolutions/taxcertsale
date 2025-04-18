"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateService = exports.CertificateService = void 0;
const repositories_1 = require("../repositories");
const entities_1 = require("../models/entities");
class CertificateService {
    async findAll() {
        return repositories_1.certificateRepository.findAll();
    }
    async findById(id) {
        return repositories_1.certificateRepository.findById(id);
    }
    async findByCertificateNumber(certificateNumber) {
        return repositories_1.certificateRepository.findByCertificateNumber(certificateNumber);
    }
    async findByCounty(countyId) {
        return repositories_1.certificateRepository.findByCounty(countyId);
    }
    async findByAuction(auctionId) {
        return repositories_1.certificateRepository.findByAuction(auctionId);
    }
    async findByProperty(propertyId) {
        return repositories_1.certificateRepository.findByProperty(propertyId);
    }
    async findByStatus(status) {
        return repositories_1.certificateRepository.findByStatus(status);
    }
    async create(certificateData) {
        // Set default status if not provided
        if (!certificateData.status) {
            certificateData.status = entities_1.CertificateStatus.AVAILABLE;
        }
        return repositories_1.certificateRepository.create(certificateData);
    }
    async update(id, certificateData) {
        return repositories_1.certificateRepository.update(id, certificateData);
    }
    async delete(id) {
        return repositories_1.certificateRepository.delete(id);
    }
    async findWithRelations(id) {
        return repositories_1.certificateRepository.findWithRelations(id);
    }
    async markAsSold(id, holderId) {
        const certificate = await this.findById(id);
        if (!certificate) {
            return null;
        }
        certificate.status = entities_1.CertificateStatus.SOLD;
        certificate.soldDate = new Date();
        if (holderId) {
            certificate.holderId = holderId;
        }
        return repositories_1.certificateRepository.update(id, certificate);
    }
    async markAsRedeemed(id, redemptionAmount, earningsAmount) {
        const certificate = await this.findById(id);
        if (!certificate) {
            return null;
        }
        certificate.status = entities_1.CertificateStatus.REDEEMED;
        certificate.redeemedDate = new Date();
        certificate.redemptionAmount = redemptionAmount;
        if (earningsAmount) {
            certificate.earningsAmount = earningsAmount;
        }
        return repositories_1.certificateRepository.update(id, certificate);
    }
    async markAsExpired(id) {
        const certificate = await this.findById(id);
        if (!certificate) {
            return null;
        }
        certificate.status = entities_1.CertificateStatus.EXPIRED;
        return repositories_1.certificateRepository.update(id, certificate);
    }
    async searchCertificates(searchParams) {
        return repositories_1.certificateRepository.searchCertificates(searchParams);
    }
}
exports.CertificateService = CertificateService;
exports.certificateService = new CertificateService();
exports.default = exports.certificateService;
//# sourceMappingURL=certificate.service.js.map