"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyService = exports.countyService = exports.certificateService = exports.auctionService = void 0;
var auction_service_1 = require("./auction.service");
Object.defineProperty(exports, "auctionService", { enumerable: true, get: function () { return __importDefault(auction_service_1).default; } });
var certificate_service_1 = require("./certificate.service");
Object.defineProperty(exports, "certificateService", { enumerable: true, get: function () { return __importDefault(certificate_service_1).default; } });
var county_service_1 = require("./county.service");
Object.defineProperty(exports, "countyService", { enumerable: true, get: function () { return __importDefault(county_service_1).default; } });
var property_service_1 = require("./property.service");
Object.defineProperty(exports, "propertyService", { enumerable: true, get: function () { return __importDefault(property_service_1).default; } });
//# sourceMappingURL=index.js.map