"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidService = exports.BidService = void 0;
const bid_repository_1 = require("../repositories/bid.repository");
class BidService {
    async findAll() {
        return bid_repository_1.bidRepository.findAll();
    }
    async findById(id) {
        return bid_repository_1.bidRepository.findById(id);
    }
    async findByAuction(auctionId) {
        return bid_repository_1.bidRepository.findByAuction(auctionId);
    }
    async findByCertificate(certificateId) {
        return bid_repository_1.bidRepository.findByCertificate(certificateId);
    }
    async findByUser(userId) {
        return bid_repository_1.bidRepository.findByUser(userId);
    }
    async create(bidData) {
        // Add business logic for bid validation here if needed
        return bid_repository_1.bidRepository.create(bidData);
    }
    async update(id, bidData) {
        return bid_repository_1.bidRepository.update(id, bidData);
    }
    async delete(id) {
        return bid_repository_1.bidRepository.delete(id);
    }
    async findActiveByAuction(auctionId) {
        return bid_repository_1.bidRepository.findActiveByAuction(auctionId);
    }
}
exports.BidService = BidService;
exports.bidService = new BidService();
exports.default = exports.bidService;
//# sourceMappingURL=bid.service.js.map