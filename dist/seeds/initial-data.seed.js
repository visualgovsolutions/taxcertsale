"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialDataSeed = void 0;
exports.seed = seed;
const user_entity_1 = require("../models/entities/user.entity");
const user_entity_2 = require("../models/entities/user.entity");
const county_entity_1 = require("../models/entities/county.entity");
class InitialDataSeed {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async run() {
        await this.seedUsers();
        await this.seedCounties();
        // Uncomment to seed more data
        // await this.seedPropertiesAndCertificates();
    }
    async seedUsers() {
        const userRepository = this.connection.getRepository(user_entity_1.User);
        // Check if users already exist
        const existingUsers = await userRepository.count();
        if (existingUsers > 0) {
            console.log('Users already seeded, skipping...');
            return;
        }
        // Create admin user
        const adminUser = new user_entity_1.User();
        adminUser.email = 'admin@example.com';
        adminUser.firstName = 'Admin';
        adminUser.lastName = 'User';
        adminUser.role = user_entity_2.UserRole.ADMIN;
        adminUser.verifiedAt = new Date();
        // Create staff user
        const staffUser = new user_entity_1.User();
        staffUser.email = 'staff@example.com';
        staffUser.firstName = 'Staff';
        staffUser.lastName = 'User';
        staffUser.role = user_entity_2.UserRole.INVESTOR; // Use INVESTOR role for staff for now
        staffUser.verifiedAt = new Date();
        // Create investor user
        const investorUser = new user_entity_1.User();
        investorUser.email = 'investor@example.com';
        investorUser.firstName = 'Investor';
        investorUser.lastName = 'User';
        investorUser.role = user_entity_2.UserRole.INVESTOR; // Use INVESTOR role for investor for now
        investorUser.verifiedAt = new Date();
        // Save users
        await userRepository.save([adminUser, staffUser, investorUser]);
        console.log('Users seeded successfully');
    }
    async seedCounties() {
        const countyRepository = this.connection.getRepository(county_entity_1.County);
        // Check if counties already exist
        const existingCounties = await countyRepository.count();
        if (existingCounties > 0) {
            console.log('Counties already seeded, skipping...');
            return;
        }
        // Florida counties data
        const countyData = [
            {
                name: 'Miami-Dade',
                state: 'Florida',
                countyCode: 'FL-13',
                websiteUrl: 'https://www.miamidade.gov',
                taxCollectorUrl: 'https://www.miamidade.gov/global/service.page?Mduid_service=ser1495746415127761',
                propertyAppraiserUrl: 'https://www.miamidade.gov/pa/',
                description: 'Miami-Dade County is a county located in the southeastern part of the U.S. state of Florida.',
                latitude: 25.5516,
                longitude: -80.6327
            },
            {
                name: 'Broward',
                state: 'Florida',
                countyCode: 'FL-06',
                websiteUrl: 'https://www.broward.org',
                taxCollectorUrl: 'https://broward.county-taxes.com/public',
                propertyAppraiserUrl: 'https://web.bcpa.net/',
                description: 'Broward County is a county located in the southeastern part of the U.S. state of Florida.',
                latitude: 26.1901,
                longitude: -80.3659
            },
            {
                name: 'Palm Beach',
                state: 'Florida',
                countyCode: 'FL-50',
                websiteUrl: 'https://discover.pbcgov.org',
                taxCollectorUrl: 'https://www.pbctax.com/',
                propertyAppraiserUrl: 'https://www.pbcgov.org/papa/',
                description: 'Palm Beach County is a county located in the southeastern part of the U.S. state of Florida.',
                latitude: 26.6515,
                longitude: -80.2767
            },
            {
                name: 'Hillsborough',
                state: 'Florida',
                countyCode: 'FL-29',
                websiteUrl: 'https://www.hillsboroughcounty.org',
                taxCollectorUrl: 'https://hillsborough.county-taxes.com/public',
                propertyAppraiserUrl: 'https://www.hcpafl.org/',
                description: 'Hillsborough County is a county located in the west central portion of the U.S. state of Florida.',
                latitude: 27.9904,
                longitude: -82.3018
            },
            {
                name: 'Orange',
                state: 'Florida',
                countyCode: 'FL-48',
                websiteUrl: 'https://www.orangecountyfl.net',
                taxCollectorUrl: 'https://www.octaxcol.com/',
                propertyAppraiserUrl: 'https://www.ocpafl.org/',
                description: 'Orange County is a county located in the central portion of the U.S. state of Florida.',
                latitude: 28.4845,
                longitude: -81.2518
            }
        ];
        // Create county entities
        const counties = countyData.map(data => {
            const county = new county_entity_1.County();
            Object.assign(county, data);
            return county;
        });
        // Save counties
        await countyRepository.save(counties);
        console.log('Counties seeded successfully');
    }
    async seedPropertiesAndCertificates() {
        // This can be implemented to seed properties, auctions, and certificates
        // For a larger application, we recommend separating this into different methods
        console.log('Property and certificate seeding not implemented yet');
    }
}
exports.InitialDataSeed = InitialDataSeed;
// Function to execute seeds
async function seed(connection) {
    const seeder = new InitialDataSeed(connection);
    await seeder.run();
}
//# sourceMappingURL=initial-data.seed.js.map