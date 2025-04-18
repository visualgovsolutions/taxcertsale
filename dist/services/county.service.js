"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countyService = exports.CountyService = void 0;
const repositories_1 = require("../repositories");
class CountyService {
    async findAll() {
        return repositories_1.countyRepository.findAll();
    }
    async findById(id) {
        return repositories_1.countyRepository.findById(id);
    }
    async findByName(name) {
        return repositories_1.countyRepository.findByName(name);
    }
    async findByState(state) {
        return repositories_1.countyRepository.findByState(state);
    }
    async create(countyData) {
        return repositories_1.countyRepository.create(countyData);
    }
    async update(id, countyData) {
        return repositories_1.countyRepository.update(id, countyData);
    }
    async delete(id) {
        return repositories_1.countyRepository.delete(id);
    }
    async findWithProperties(id) {
        return repositories_1.countyRepository.findWithProperties(id);
    }
    async findWithCertificates(id) {
        return repositories_1.countyRepository.findWithCertificates(id);
    }
    async findWithAuctions(id) {
        return repositories_1.countyRepository.findWithAuctions(id);
    }
}
exports.CountyService = CountyService;
exports.countyService = new CountyService();
exports.default = exports.countyService;
//# sourceMappingURL=county.service.js.map