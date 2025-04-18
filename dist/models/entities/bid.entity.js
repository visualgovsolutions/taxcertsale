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
exports.Bid = exports.BidStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const certificate_entity_1 = require("./certificate.entity");
const auction_entity_1 = require("./auction.entity");
var BidStatus;
(function (BidStatus) {
    BidStatus["PENDING"] = "pending";
    BidStatus["ACTIVE"] = "active";
    BidStatus["ACCEPTED"] = "accepted";
    BidStatus["REJECTED"] = "rejected";
    BidStatus["CANCELLED"] = "cancelled";
    BidStatus["EXPIRED"] = "expired";
})(BidStatus || (exports.BidStatus = BidStatus = {}));
let Bid = class Bid {
    id;
    user;
    userId;
    certificate;
    certificateId;
    auction;
    auctionId;
    amount;
    interestRate;
    status;
    notes;
    metadata;
    createdAt;
    updatedAt;
};
exports.Bid = Bid;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Bid.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.bids),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Bid.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Bid.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => certificate_entity_1.Certificate, certificate => certificate.bids),
    (0, typeorm_1.JoinColumn)({ name: 'certificate_id' }),
    __metadata("design:type", certificate_entity_1.Certificate)
], Bid.prototype, "certificate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'certificate_id' }),
    __metadata("design:type", String)
], Bid.prototype, "certificateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => auction_entity_1.Auction, auction => auction.bids),
    (0, typeorm_1.JoinColumn)({ name: 'auction_id' }),
    __metadata("design:type", auction_entity_1.Auction)
], Bid.prototype, "auction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auction_id' }),
    __metadata("design:type", String)
], Bid.prototype, "auctionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Bid.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Bid.prototype, "interestRate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BidStatus,
        default: BidStatus.PENDING,
    }),
    __metadata("design:type", String)
], Bid.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Bid.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Bid.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Bid.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Bid.prototype, "updatedAt", void 0);
exports.Bid = Bid = __decorate([
    (0, typeorm_1.Entity)('bids')
], Bid);
//# sourceMappingURL=bid.entity.js.map