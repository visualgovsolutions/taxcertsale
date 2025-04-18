"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countyRepository = void 0;
const database_1 = require("../config/database");
const entities_1 = require("../models/entities");
class CountyRepository {
    repository;
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(entities_1.County);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByName(name) {
        return this.repository.findOneBy({ name });
    }
    async findByState(state) {
        return this.repository.findBy({ state });
    }
    async create(countyData) {
        const county = this.repository.create(countyData);
        return this.repository.save(county);
    }
    async update(id, countyData) {
        const updateResult = await this.repository.update(id, countyData);
        if (updateResult.affected === 0) {
            return null;
        }
        return this.findById(id);
    }
    async delete(id) {
        const deleteResult = await this.repository.delete(id);
        return deleteResult.affected ? deleteResult.affected > 0 : false;
    }
    async findWithProperties(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['properties']
        });
    }
    async findWithCertificates(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['certificates']
        });
    }
    async findWithAuctions(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['auctions']
        });
    }
}
exports.countyRepository = new CountyRepository();
exports.default = exports.countyRepository;
//# sourceMappingURL=county.repository.js.map