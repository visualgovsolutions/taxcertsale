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
exports.Certificate = exports.CertificateStatus = void 0;
const typeorm_1 = require("typeorm");
const county_entity_1 = require("./county.entity");
const property_entity_1 = require("./property.entity");
const auction_entity_1 = require("./auction.entity");
const bid_entity_1 = require("./bid.entity");
var CertificateStatus;
(function (CertificateStatus) {
    CertificateStatus["AVAILABLE"] = "available";
    CertificateStatus["SOLD"] = "sold";
    CertificateStatus["REDEEMED"] = "redeemed";
    CertificateStatus["EXPIRED"] = "expired";
})(CertificateStatus || (exports.CertificateStatus = CertificateStatus = {}));
let Certificate = class Certificate {
    id;
    certificateNumber;
    auction;
    auctionId;
    property;
    propertyId;
    county;
    countyId;
    faceValue;
    interestRate;
    issueDate;
    status;
    soldDate;
    redeemedDate;
    redemptionAmount;
    earningsAmount;
    holderId;
    metadata;
    bids;
    createdAt;
    updatedAt;
};
exports.Certificate = Certificate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Certificate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Certificate.prototype, "certificateNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auction_entity_1.Auction, auction => auction.certificates),
    (0, typeorm_1.JoinColumn)({ name: 'auction_id' }),
    __metadata("design:type", auction_entity_1.Auction)
], Certificate.prototype, "auction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auction_id' }),
    __metadata("design:type", String)
], Certificate.prototype, "auctionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, property => property.certificates),
    (0, typeorm_1.JoinColumn)({ name: 'property_id' }),
    __metadata("design:type", property_entity_1.Property)
], Certificate.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'property_id' }),
    __metadata("design:type", String)
], Certificate.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => county_entity_1.County, county => county.certificates),
    (0, typeorm_1.JoinColumn)({ name: 'county_id' }),
    __metadata("design:type", county_entity_1.County)
], Certificate.prototype, "county", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'county_id' }),
    __metadata("design:type", String)
], Certificate.prototype, "countyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Certificate.prototype, "faceValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Certificate.prototype, "interestRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Certificate.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CertificateStatus,
        default: CertificateStatus.AVAILABLE
    }),
    __metadata("design:type", String)
], Certificate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Certificate.prototype, "soldDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Certificate.prototype, "redeemedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Certificate.prototype, "redemptionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Certificate.prototype, "earningsAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Certificate.prototype, "holderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Certificate.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bid_entity_1.Bid, bid => bid.certificate),
    __metadata("design:type", Array)
], Certificate.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Certificate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Certificate.prototype, "updatedAt", void 0);
exports.Certificate = Certificate = __decorate([
    (0, typeorm_1.Entity)('certificates')
], Certificate);
//# sourceMappingURL=certificate.entity.js.map