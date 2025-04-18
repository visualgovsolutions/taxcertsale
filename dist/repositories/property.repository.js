"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyRepository = void 0;
const typeorm_1 = require("typeorm");
const database_1 = require("../config/database");
const entities_1 = require("../models/entities");
class PropertyRepository {
    repository;
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(entities_1.Property);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByParcelId(parcelId) {
        return this.repository.findOneBy({ parcelId });
    }
    async findByCounty(countyId) {
        return this.repository.findBy({ countyId });
    }
    async findByAddress(address) {
        return this.repository.findBy({ address: (0, typeorm_1.ILike)(`%${address}%`) });
    }
    async findByOwner(ownerName) {
        return this.repository.findBy({ ownerName: (0, typeorm_1.ILike)(`%${ownerName}%`) });
    }
    async create(propertyData) {
        const property = this.repository.create(propertyData);
        return this.repository.save(property);
    }
    async update(id, propertyData) {
        const updateResult = await this.repository.update(id, propertyData);
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
    async searchProperties(searchParams) {
        const queryBuilder = this.repository.createQueryBuilder('property');
        if (searchParams.countyId) {
            queryBuilder.andWhere('property.countyId = :countyId', { countyId: searchParams.countyId });
        }
        if (searchParams.address) {
            queryBuilder.andWhere('property.address ILIKE :address', { address: `%${searchParams.address}%` });
        }
        if (searchParams.parcelId) {
            queryBuilder.andWhere('property.parcelId ILIKE :parcelId', { parcelId: `%${searchParams.parcelId}%` });
        }
        if (searchParams.ownerName) {
            queryBuilder.andWhere('property.ownerName ILIKE :ownerName', { ownerName: `%${searchParams.ownerName}%` });
        }
        if (searchParams.propertyType) {
            queryBuilder.andWhere('property.propertyType = :propertyType', { propertyType: searchParams.propertyType });
        }
        if (searchParams.zoning) {
            queryBuilder.andWhere('property.zoning = :zoning', { zoning: searchParams.zoning });
        }
        if (searchParams.minLandArea) {
            queryBuilder.andWhere('property.landArea >= :minLandArea', { minLandArea: searchParams.minLandArea });
        }
        if (searchParams.maxLandArea) {
            queryBuilder.andWhere('property.landArea <= :maxLandArea', { maxLandArea: searchParams.maxLandArea });
        }
        if (searchParams.minBuildingArea) {
            queryBuilder.andWhere('property.buildingArea >= :minBuildingArea', { minBuildingArea: searchParams.minBuildingArea });
        }
        if (searchParams.maxBuildingArea) {
            queryBuilder.andWhere('property.buildingArea <= :maxBuildingArea', { maxBuildingArea: searchParams.maxBuildingArea });
        }
        return queryBuilder.getMany();
    }
}
exports.propertyRepository = new PropertyRepository();
exports.default = exports.propertyRepository;
//# sourceMappingURL=property.repository.js.map