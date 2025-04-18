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
exports.Auction = exports.AuctionStatus = void 0;
const typeorm_1 = require("typeorm");
const certificate_entity_1 = require("./certificate.entity");
const county_entity_1 = require("./county.entity");
const bid_entity_1 = require("./bid.entity");
var AuctionStatus;
(function (AuctionStatus) {
    AuctionStatus["UPCOMING"] = "upcoming";
    AuctionStatus["ACTIVE"] = "active";
    AuctionStatus["COMPLETED"] = "completed";
    AuctionStatus["CANCELLED"] = "cancelled";
})(AuctionStatus || (exports.AuctionStatus = AuctionStatus = {}));
let Auction = class Auction {
    id;
    name;
    auctionDate;
    startTime;
    endTime;
    status;
    description;
    location;
    registrationUrl;
    metadata;
    countyId;
    county;
    certificates;
    bids;
    createdAt;
    updatedAt;
};
exports.Auction = Auction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Auction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Auction.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auction_date', type: 'date' }),
    __metadata("design:type", Date)
], Auction.prototype, "auctionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'time' }),
    __metadata("design:type", String)
], Auction.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'time', nullable: true }),
    __metadata("design:type", String)
], Auction.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AuctionStatus,
        default: AuctionStatus.UPCOMING,
    }),
    __metadata("design:type", String)
], Auction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Auction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Auction.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_url', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Auction.prototype, "registrationUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Auction.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'county_id' }),
    __metadata("design:type", String)
], Auction.prototype, "countyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => county_entity_1.County, county => county.auctions),
    (0, typeorm_1.JoinColumn)({ name: 'county_id' }),
    __metadata("design:type", county_entity_1.County)
], Auction.prototype, "county", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => certificate_entity_1.Certificate, certificate => certificate.auction),
    __metadata("design:type", Array)
], Auction.prototype, "certificates", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bid_entity_1.Bid, bid => bid.auction),
    __metadata("design:type", Array)
], Auction.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Auction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Auction.prototype, "updatedAt", void 0);
exports.Auction = Auction = __decorate([
    (0, typeorm_1.Entity)('auctions')
], Auction);
//# sourceMappingURL=auction.entity.js.map