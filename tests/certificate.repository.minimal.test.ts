import { DataSource } from 'typeorm';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../src/generated/prisma'; // Corrected path
import prisma from './test-utils/prisma-client-setup'; // Import the configured Prisma instance

// Create a minimal test to demonstrate that certificate operations work correctly
describe('Certificate Database Integration', () => {
  let dataSource: DataSource;
  let client: Client;
  const dbName = `test_cert_${uuidv4().replace(/-/g, '')}`;
  
  beforeAll(async () => {
    // Connect to postgres to create a test database
    const pgClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'postgres'
    });
    
    await pgClient.connect();
    
    // Drop the test database if it exists
    await pgClient.query(`DROP DATABASE IF EXISTS ${dbName}`);
    await pgClient.query(`CREATE DATABASE ${dbName}`);
    await pgClient.end();
    
    // Connect to the test database
    client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: dbName
    });
    await client.connect();
    
    // Drop all tables if they exist (for isolation)
    await client.query('DROP TABLE IF EXISTS certificates CASCADE');
    await client.query('DROP TABLE IF EXISTS properties CASCADE');
    await client.query('DROP TABLE IF EXISTS auctions CASCADE');
    await client.query('DROP TABLE IF EXISTS counties CASCADE');
    
    // Create tables with deferrable constraints (updated to match entity schema)
    await client.query(`
      CREATE TABLE counties (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        state VARCHAR(255),
        county_code VARCHAR(255),
        website_url VARCHAR(255),
        tax_collector_url VARCHAR(255),
        property_appraiser_url VARCHAR(255),
        description TEXT,
        metadata JSONB,
        latitude DECIMAL(10,6),
        longitude DECIMAL(10,6),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE properties (
        id UUID PRIMARY KEY,
        parcel_id VARCHAR(255) UNIQUE NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zip_code VARCHAR(255) NOT NULL,
        assessed_value DECIMAL(15,2),
        market_value DECIMAL(15,2),
        latitude DECIMAL(12,8),
        longitude DECIMAL(12,8),
        property_type VARCHAR(255),
        zoning VARCHAR(255),
        land_area DECIMAL(12,2),
        building_area DECIMAL(12,2),
        year_built INT,
        owner_name VARCHAR(255),
        description TEXT,
        metadata JSONB,
        county_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_property_county FOREIGN KEY (county_id) 
          REFERENCES counties(id) 
          DEFERRABLE INITIALLY IMMEDIATE
      )
    `);
    
    await client.query(`
      CREATE TABLE auctions (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        auction_date TIMESTAMP NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        status VARCHAR(50) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        registration_url VARCHAR(255),
        metadata JSONB,
        county_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_auction_county FOREIGN KEY (county_id) 
          REFERENCES counties(id) 
          DEFERRABLE INITIALLY IMMEDIATE
      )
    `);
    
    await client.query(`
      CREATE TABLE certificates (
        id UUID PRIMARY KEY,
        county_id UUID NOT NULL,
        property_id UUID NOT NULL,
        auction_id UUID NOT NULL,
        certificate_number VARCHAR(255) NOT NULL,
        face_value DECIMAL(10,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_certificate_county FOREIGN KEY (county_id) 
          REFERENCES counties(id) 
          DEFERRABLE INITIALLY IMMEDIATE,
        CONSTRAINT fk_certificate_property FOREIGN KEY (property_id) 
          REFERENCES properties(id) 
          DEFERRABLE INITIALLY IMMEDIATE,
        CONSTRAINT fk_certificate_auction FOREIGN KEY (auction_id) 
          REFERENCES auctions(id) 
          DEFERRABLE INITIALLY IMMEDIATE
      )
    `);
  });
  
  beforeEach(async () => {
    // Clear data before each test in the correct dependency order using the Prisma client
    await prisma.bid.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.auction.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.user.deleteMany({}); // Assuming a User table exists and might be related
    await prisma.county.deleteMany({});
  });
  
  afterAll(async () => {
    await client.end();
    if (prisma && typeof prisma.$disconnect === 'function') {
      await prisma.$disconnect();
    }
    // Connect back to postgres to drop the test database
    const pgClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'postgres'
    });
    await pgClient.connect();
    await pgClient.query(`DROP DATABASE IF EXISTS ${dbName}`);
    await pgClient.end();
  });
  
  test('should create a county successfully', async () => {
    const countyId = uuidv4();
    
    await client.query(`
      INSERT INTO counties (id, name, state)
      VALUES ($1, $2, $3)
    `, [countyId, 'Test County', 'FL']);
    
    const result = await client.query('SELECT * FROM counties WHERE id = $1', [countyId]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].name).toBe('Test County');
  });
  
  test('should perform certificate operations with correct foreign keys', async () => {
    // Create a county
    const countyId = uuidv4();
    await client.query(`
      INSERT INTO counties (id, name, state)
      VALUES ($1, $2, $3)
    `, [countyId, 'Test County', 'FL']);
    
    // Create a property (with all required fields)
    const propertyId = uuidv4();
    await client.query(`
      INSERT INTO properties (
        id, parcel_id, address, city, state, zip_code, county_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      propertyId,
      'PARCEL-001',
      '123 Test St',
      'Test City',
      'FL',
      '12345',
      countyId
    ]);
    
    // Create an auction (with all required fields)
    const auctionId = uuidv4();
    await client.query(`
      INSERT INTO auctions (
        id, name, auction_date, start_time, end_time, status, county_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      auctionId,
      'Test Auction',
      new Date('2023-01-01T10:00:00Z'),
      '10:00:00',
      '12:00:00',
      'upcoming',
      countyId
    ]);
    
    // Create a certificate
    const certificateId = uuidv4();
    await client.query(`
      INSERT INTO certificates (
        id, county_id, property_id, auction_id, 
        certificate_number, face_value, interest_rate, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      certificateId, 
      countyId, 
      propertyId, 
      auctionId, 
      'CERT-001', 
      1000.00, 
      5.00, 
      'AVAILABLE'
    ]);
    
    // Verify the certificate was created
    const result = await client.query('SELECT * FROM certificates WHERE id = $1', [certificateId]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].certificate_number).toBe('CERT-001');
    // Clean up should happen in beforeEach of next test
  });
}); 