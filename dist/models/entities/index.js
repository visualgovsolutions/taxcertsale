"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = exports.Bid = exports.Auction = exports.Certificate = exports.Property = exports.County = exports.User = void 0;
const user_entity_1 = require("./user.entity");
const county_entity_1 = require("./county.entity");
const property_entity_1 = require("./property.entity");
const certificate_entity_1 = require("./certificate.entity");
const auction_entity_1 = require("./auction.entity");
const bid_entity_1 = require("./bid.entity");
// Export all entities
var user_entity_2 = require("./user.entity");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_entity_2.User; } });
var county_entity_2 = require("./county.entity");
Object.defineProperty(exports, "County", { enumerable: true, get: function () { return county_entity_2.County; } });
var property_entity_2 = require("./property.entity");
Object.defineProperty(exports, "Property", { enumerable: true, get: function () { return property_entity_2.Property; } });
var certificate_entity_2 = require("./certificate.entity");
Object.defineProperty(exports, "Certificate", { enumerable: true, get: function () { return certificate_entity_2.Certificate; } });
var auction_entity_2 = require("./auction.entity");
Object.defineProperty(exports, "Auction", { enumerable: true, get: function () { return auction_entity_2.Auction; } });
var bid_entity_2 = require("./bid.entity");
Object.defineProperty(exports, "Bid", { enumerable: true, get: function () { return bid_entity_2.Bid; } });
// Add entities to this array for TypeORM connection
exports.entities = [
    user_entity_1.User,
    county_entity_1.County,
    property_entity_1.Property,
    certificate_entity_1.Certificate,
    auction_entity_1.Auction,
    bid_entity_1.Bid
];
//# sourceMappingURL=index.js.map