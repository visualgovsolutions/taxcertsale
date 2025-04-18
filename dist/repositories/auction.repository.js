"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auctionRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const entities_1 = require("../models/entities");
class AuctionRepository {
    repository;
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(entities_1.Auction);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByCounty(countyId) {
        return this.repository.findBy({ countyId });
    }
    async findByStatus(status) {
        return this.repository.findBy({ status });
    }
    async findUpcoming() {
        return this.repository.find({
            where: { status: entities_1.AuctionStatus.UPCOMING },
            order: { auctionDate: 'ASC' }
        });
    }
    async findActive() {
        return this.repository.find({
            where: { status: entities_1.AuctionStatus.ACTIVE },
            order: { auctionDate: 'ASC' }
        });
    }
    async findCompleted() {
        return this.repository.find({
            where: { status: entities_1.AuctionStatus.COMPLETED },
            order: { auctionDate: 'DESC' }
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.repository.find({
            where: { auctionDate: (0, typeorm_1.Between)(startDate, endDate) },
            order: { auctionDate: 'ASC' }
        });
    }
    async findUpcomingByDateRange(startDate, endDate) {
        return this.repository.find({
            where: {
                auctionDate: (0, typeorm_1.Between)(startDate, endDate),
                status: entities_1.AuctionStatus.UPCOMING
            },
            order: { auctionDate: 'ASC' }
        });
    }
    async findBeforeDate(date) {
        return this.repository.find({
            where: { auctionDate: (0, typeorm_1.LessThanOrEqual)(date) },
            order: { auctionDate: 'DESC' }
        });
    }
    async findAfterDate(date) {
        return this.repository.find({
            where: { auctionDate: (0, typeorm_1.MoreThanOrEqual)(date) },
            order: { auctionDate: 'ASC' }
        });
    }
    async create(auctionData) {
        const auction = this.repository.create(auctionData);
        return this.repository.save(auction);
    }
    async update(id, auctionData) {
        const updateResult = await this.repository.update(id, auctionData);
        if (updateResult.affected === 0) {
            return null;
        }
        return this.findById(id);
    }
    async delete(id) {
        const deleteResult = await this.repository.delete(id);
        return deleteResult.affected ? deleteResult.affected > 0 : false;
    }
    async findWithCertificates(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['certificates']
        });
    }
    async findWithCounty(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['county']
        });
    }
    async findWithRelations(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['county', 'certificates']
        });
    }
    async activateAuction(id) {
        const auction = await this.findById(id);
        if (!auction) {
            return null;
        }
        auction.status = entities_1.AuctionStatus.ACTIVE;
        return this.repository.save(auction);
    }
    async completeAuction(id) {
        const auction = await this.findById(id);
        if (!auction) {
            return null;
        }
        auction.status = entities_1.AuctionStatus.COMPLETED;
        return this.repository.save(auction);
    }
    async cancelAuction(id) {
        const auction = await this.findById(id);
        if (!auction) {
            return null;
        }
        auction.status = entities_1.AuctionStatus.CANCELLED;
        return this.repository.save(auction);
    }
}
exports.auctionRepository = new AuctionRepository();
exports.default = exports.auctionRepository;
//# sourceMappingURL=auction.repository.js.map