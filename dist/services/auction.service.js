"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auctionService = exports.AuctionService = void 0;
const repositories_1 = require("../repositories");
const entities_1 = require("../models/entities");
class AuctionService {
    async findAll() {
        return repositories_1.auctionRepository.findAll();
    }
    async findById(id) {
        return repositories_1.auctionRepository.findById(id);
    }
    async findByCounty(countyId) {
        return repositories_1.auctionRepository.findByCounty(countyId);
    }
    async findByStatus(status) {
        return repositories_1.auctionRepository.findByStatus(status);
    }
    async findUpcoming() {
        return repositories_1.auctionRepository.findUpcoming();
    }
    async findActive() {
        return repositories_1.auctionRepository.findActive();
    }
    async findCompleted() {
        return repositories_1.auctionRepository.findCompleted();
    }
    async findByDateRange(startDate, endDate) {
        return repositories_1.auctionRepository.findByDateRange(startDate, endDate);
    }
    async create(auctionData) {
        // Set default status if not provided
        if (!auctionData.status) {
            auctionData.status = entities_1.AuctionStatus.UPCOMING;
        }
        return repositories_1.auctionRepository.create(auctionData);
    }
    async update(id, auctionData) {
        return repositories_1.auctionRepository.update(id, auctionData);
    }
    async delete(id) {
        return repositories_1.auctionRepository.delete(id);
    }
    async findWithCertificates(id) {
        return repositories_1.auctionRepository.findWithCertificates(id);
    }
    async findWithCounty(id) {
        return repositories_1.auctionRepository.findWithCounty(id);
    }
    async findWithRelations(id) {
        return repositories_1.auctionRepository.findWithRelations(id);
    }
    async activateAuction(id) {
        return repositories_1.auctionRepository.activateAuction(id);
    }
    async completeAuction(id) {
        return repositories_1.auctionRepository.completeAuction(id);
    }
    async cancelAuction(id) {
        return repositories_1.auctionRepository.cancelAuction(id);
    }
}
exports.AuctionService = AuctionService;
exports.auctionService = new AuctionService();
exports.default = exports.auctionService;
//# sourceMappingURL=auction.service.js.map