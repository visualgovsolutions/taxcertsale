"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const compliance_routes_1 = __importDefault(require("./compliance.routes"));
const auctions_routes_1 = __importDefault(require("./auctions.routes"));
const router = (0, express_1.Router)();
// Health check route
router.use('/health', health_1.default);
// Compliance routes
router.use('/compliance', compliance_routes_1.default);
// Auction routes
router.use('/auctions', auctions_routes_1.default);
// Root endpoint
router.get('/', (_req, res) => {
    res.status(200).json({
        message: 'Florida Tax Certificate Sale API',
        documentation: '/api-docs', // Placeholder for future API docs link
    });
});
// Add other routes here
// e.g., router.use('/users', userRouter);
exports.default = router;
//# sourceMappingURL=index.js.map