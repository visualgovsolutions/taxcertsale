"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidRepository = void 0;
const database_1 = require("../config/database");
const bid_entity_1 = require("../models/entities/bid.entity");
class BidRepository {
    repository;
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(bid_entity_1.Bid);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByAuction(auctionId) {
        return this.repository.find({ where: { auctionId } });
    }
    async findByCertificate(certificateId) {
        return this.repository.find({ where: { certificateId } });
    }
    async findByUser(userId) {
        return this.repository.find({ where: { userId } });
    }
    async create(bidData) {
        const bid = this.repository.create(bidData);
        return this.repository.save(bid);
    }
    async update(id, bidData) {
        const updateResult = await this.repository.update(id, bidData);
        if (updateResult.affected === 0) {
            return null;
        }
        return this.findById(id);
    }
    async delete(id) {
        const deleteResult = await this.repository.delete(id);
        return deleteResult.affected ? deleteResult.affected > 0 : false;
    }
    async findActiveByAuction(auctionId) {
        return this.repository.find({ where: { auctionId, status: bid_entity_1.BidStatus.ACTIVE } });
    }
}
exports.bidRepository = new BidRepository();
exports.default = exports.bidRepository;
//# sourceMappingURL=bid.repository.js.map