"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const initial_data_seed_1 = require("../seeds/initial-data.seed");
async function runSeed() {
    try {
        // Initialize the database connection
        if (!database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.initialize();
            console.log('Database connection established');
        }
        // Run seed data
        await (0, initial_data_seed_1.seed)(database_1.AppDataSource);
        console.log('Seed completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error while seeding the database:', error);
        process.exit(1);
    }
}
runSeed();
//# sourceMappingURL=seed.js.map