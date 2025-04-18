"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compliance_service_1 = require("../services/compliance/compliance.service");
const authMiddleware_1 = require("../middleware/authMiddleware"); // Use relative imports
// import { UserRole } from '../models/UserRole'; // Remove UserRole import
const router = express_1.default.Router();
// Remove pool reference
// const pool = getPostgresPool();
// Use the singleton service getter instead of direct instantiation
const complianceService = (0, compliance_service_1.getComplianceService)();
// Middleware for all compliance routes: authentication and role check
// Pass roles as strings
router.use(authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRole)(['ADMIN', 'COUNTY_ADMIN']));
// --- Routes ---
// GET /compliance/1099-int/:year
router.get('/1099-int/:year', async (req, res) => {
    try {
        // Ensure year parameter exists before parsing
        const yearString = req.params.year;
        if (!yearString) {
            return res.status(400).send({ message: 'Missing year parameter.' });
        }
        const year = parseInt(yearString, 10);
        if (isNaN(year)) {
            return res.status(400).send({ message: 'Invalid year parameter. Must be a number.' });
        }
        const reportBuffer = await complianceService.generate1099Int(year);
        if (reportBuffer instanceof Buffer) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=1099-INT-${year}.pdf`);
            return res.send(reportBuffer);
        }
        else {
            // reportBuffer is expected to be an error string here based on service definition
            return res.status(500).send({ message: 'Failed to generate 1099-INT report', error: reportBuffer });
        }
    }
    catch (error) {
        console.error('Error in GET /compliance/1099-int/:year :', error);
        // Type assertion for error message
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        return res.status(500).send({ message: 'Error generating 1099-INT report', error: errorMessage });
    }
});
// GET /compliance/chapter197-report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get('/chapter197-report', async (req, res) => {
    try {
        const { startDate: startDateString, endDate: endDateString } = req.query;
        if (!startDateString || !endDateString || typeof startDateString !== 'string' || typeof endDateString !== 'string') {
            return res.status(400).send({ message: 'Missing or invalid startDate or endDate query parameters.' });
        }
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).send({ message: 'Invalid date format for startDate or endDate. Use YYYY-MM-DD.' });
        }
        const reportBuffer = await complianceService.generateChapter197Report(startDate, endDate);
        // Assuming CSV for now
        if (reportBuffer instanceof Buffer) {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=chapter197-report-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv`);
            return res.send(reportBuffer);
        }
        else {
            // reportBuffer is expected to be an error string here
            return res.status(500).send({ message: 'Failed to generate Chapter 197 report', error: reportBuffer });
        }
    }
    catch (error) {
        console.error('Error in GET /compliance/chapter197-report:', error);
        // Type assertion for error message
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error occurred';
        return res.status(500).send({ message: 'Error generating Chapter 197 report', error: errorMessage });
    }
});
exports.default = router;
//# sourceMappingURL=compliance.routes.js.map