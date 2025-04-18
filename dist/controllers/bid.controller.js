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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidController = void 0;
const common_1 = require("@nestjs/common");
const bid_service_1 = require("../services/bid.service");
const create_bid_dto_1 = require("../dtos/create-bid.dto");
const update_bid_dto_1 = require("../dtos/update-bid.dto");
let BidController = class BidController {
    bidService;
    constructor(bidService) {
        this.bidService = bidService;
    }
    async findAll() {
        return this.bidService.findAll();
    }
    async findById(id) {
        return this.bidService.findById(id);
    }
    async findByAuction(auctionId) {
        return this.bidService.findByAuction(auctionId);
    }
    async findByCertificate(certificateId) {
        return this.bidService.findByCertificate(certificateId);
    }
    async findByUser(userId) {
        return this.bidService.findByUser(userId);
    }
    async create(createBidDto) {
        return this.bidService.create(createBidDto);
    }
    async update(id, updateBidDto) {
        return this.bidService.update(id, updateBidDto);
    }
    async delete(id) {
        return this.bidService.delete(id);
    }
};
exports.BidController = BidController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BidController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('auction/:auctionId'),
    __param(0, (0, common_1.Param)('auctionId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "findByAuction", null);
__decorate([
    (0, common_1.Get)('certificate/:certificateId'),
    __param(0, (0, common_1.Param)('certificateId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "findByCertificate", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bid_dto_1.CreateBidDto]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bid_dto_1.UpdateBidDto]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "delete", null);
exports.BidController = BidController = __decorate([
    (0, common_1.Controller)('bids'),
    __metadata("design:paramtypes", [bid_service_1.BidService])
], BidController);
//# sourceMappingURL=bid.controller.js.map