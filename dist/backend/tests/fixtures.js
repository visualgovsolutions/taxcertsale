"use strict";
/**
 * Test fixtures for use across tests
 *
 * This file contains sample data and helper functions for testing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestData = exports.generateTestToken = exports.testCertificates = exports.testProperties = exports.testUsers = void 0;
// Sample user data
exports.testUsers = {
    admin: {
        email: 'admin@example.com',
        password: 'adminPassword123',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
    },
    regularUser: {
        email: 'user@example.com',
        password: 'userPassword123',
        role: 'user',
        firstName: 'Regular',
        lastName: 'User',
    },
    investor: {
        email: 'investor@example.com',
        password: 'investorPassword123',
        role: 'investor',
        firstName: 'Test',
        lastName: 'Investor',
    }
};
// Sample property data
exports.testProperties = [
    {
        parcelId: 'ABC123456',
        address: {
            street: '123 Main St',
            city: 'Orlando',
            state: 'FL',
            zipCode: '32801',
        },
        taxAmount: 1500.25,
        certificateId: 'CERT-001',
    },
    {
        parcelId: 'DEF789012',
        address: {
            street: '456 Oak Ave',
            city: 'Tampa',
            state: 'FL',
            zipCode: '33601',
        },
        taxAmount: 2345.67,
        certificateId: 'CERT-002',
    },
];
// Sample tax certificate data
exports.testCertificates = [
    {
        certificateId: 'CERT-001',
        parcelId: 'ABC123456',
        faceValue: 1500.25,
        interestRate: 18,
        issueDate: new Date('2023-05-15'),
        status: 'available',
    },
    {
        certificateId: 'CERT-002',
        parcelId: 'DEF789012',
        faceValue: 2345.67,
        interestRate: 16.5,
        issueDate: new Date('2023-05-15'),
        status: 'sold',
    },
];
// Helper function to generate a JWT token for testing
const generateTestToken = (user) => {
    // This is a placeholder - in real implementation, we'd use JWT library
    return `test.token.${user.role}`;
};
exports.generateTestToken = generateTestToken;
// Helper function to create test data in database
const seedTestData = async () => {
    // This is a placeholder - in real implementation, we'd insert data into test database
    console.log('Seeding test data');
    return {
        users: exports.testUsers,
        properties: exports.testProperties,
        certificates: exports.testCertificates,
    };
};
exports.seedTestData = seedTestData;
//# sourceMappingURL=fixtures.js.map