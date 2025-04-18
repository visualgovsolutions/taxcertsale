import { AppDataSource } from '../config/database';
import { seed } from '../seeds/initial-data.seed';

async function runSeed() {
  try {
    // Initialize the database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');
    }
    
    // Run seed data
    await seed(AppDataSource);
    
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error while seeding the database:', error);
    process.exit(1);
  }
}

runSeed(); 