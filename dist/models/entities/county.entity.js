"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.County = void 0;
const typeorm_1 = require("typeorm");
const auction_entity_1 = require("./auction.entity");
const property_entity_1 = require("./property.entity");
const certificate_entity_1 = require("./certificate.entity");
let County = class County {
    id;
    name;
    state;
    countyCode;
    websiteUrl;
    taxCollectorUrl;
    propertyAppraiserUrl;
    description;
    metadata;
    latitude;
    longitude;
    properties;
    certificates;
    auctions;
    createdAt;
    updatedAt;
};
exports.County = County;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], County.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], County.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], County.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], County.prototype, "countyCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], County.prototype, "websiteUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], County.prototype, "taxCollectorUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], County.prototype, "propertyAppraiserUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], County.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], County.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], County.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], County.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_entity_1.Property, property => property.county),
    __metadata("design:type", Array)
], County.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => certificate_entity_1.Certificate, certificate => certificate.county),
    __metadata("design:type", Array)
], County.prototype, "certificates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => auction_entity_1.Auction, auction => auction.county),
    __metadata("design:type", Array)
], County.prototype, "auctions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], County.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], County.prototype, "updatedAt", void 0);
exports.County = County = __decorate([
    (0, typeorm_1.Entity)('counties')
], County);
//# sourceMappingURL=county.entity.js.map