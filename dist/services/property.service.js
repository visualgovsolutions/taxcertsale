"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyService = exports.PropertyService = void 0;
const repositories_1 = require("../repositories");
class PropertyService {
    async findAll() {
        return repositories_1.propertyRepository.findAll();
    }
    async findById(id) {
        return repositories_1.propertyRepository.findById(id);
    }
    async findByParcelId(parcelId) {
        return repositories_1.propertyRepository.findByParcelId(parcelId);
    }
    async findByCounty(countyId) {
        return repositories_1.propertyRepository.findByCounty(countyId);
    }
    async findByAddress(address) {
        return repositories_1.propertyRepository.findByAddress(address);
    }
    async findByOwner(ownerName) {
        return repositories_1.propertyRepository.findByOwner(ownerName);
    }
    async create(propertyData) {
        return repositories_1.propertyRepository.create(propertyData);
    }
    async update(id, propertyData) {
        return repositories_1.propertyRepository.update(id, propertyData);
    }
    async delete(id) {
        return repositories_1.propertyRepository.delete(id);
    }
    async findWithCertificates(id) {
        return repositories_1.propertyRepository.findWithCertificates(id);
    }
    async findWithCounty(id) {
        return repositories_1.propertyRepository.findWithCounty(id);
    }
    async findWithRelations(id) {
        return repositories_1.propertyRepository.findWithRelations(id);
    }
    async searchProperties(searchParams) {
        return repositories_1.propertyRepository.searchProperties(searchParams);
    }
}
exports.PropertyService = PropertyService;
exports.propertyService = new PropertyService();
exports.default = exports.propertyService;
//# sourceMappingURL=property.service.js.map