"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAuctionTables1693152000000 = void 0;
class CreateAuctionTables1693152000000 {
    async up(queryRunner) {
        // Counties table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS counties (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        state VARCHAR(2) NOT NULL,
        county_code VARCHAR(50),
        website VARCHAR(255),
        description TEXT,
        contact_info JSONB,
        metadata JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
        // Auctions table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auctions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        auction_date DATE NOT NULL,
        start_time TIME,
        end_time TIME,
        status VARCHAR(20) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        registration_url VARCHAR(255),
        metadata JSONB,
        county_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT fk_county FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
      );
    `);
        // Properties table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        parcel_id VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        zip_code VARCHAR(10),
        latitude VARCHAR(30),
        longitude VARCHAR(30),
        description TEXT,
        property_type VARCHAR(50),
        owner_name VARCHAR(100),
        assessed_value DECIMAL(15, 2),
        market_value DECIMAL(15, 2),
        metadata JSONB,
        county_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT fk_county FOREIGN KEY (county_id) REFERENCES counties(id) ON DELETE CASCADE
      );
    `);
        // Certificates table
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        certificate_number VARCHAR(100) NOT NULL,
        face_value DECIMAL(15, 2) NOT NULL,
        interest_rate DECIMAL(10, 2) NOT NULL,
        issue_date DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        holder_name VARCHAR(100),
        redemption_date DATE,
        redemption_amount DECIMAL(15, 2),
        notes VARCHAR(255),
        metadata JSONB,
        property_id UUID NOT NULL,
        auction_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
        CONSTRAINT fk_auction FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
      );
    `);
        // Create indexes for better performance
        await queryRunner.query(`CREATE INDEX idx_auction_date ON auctions(auction_date);`);
        await queryRunner.query(`CREATE INDEX idx_auction_status ON auctions(status);`);
        await queryRunner.query(`CREATE INDEX idx_county_name ON counties(name);`);
        await queryRunner.query(`CREATE INDEX idx_property_parcel ON properties(parcel_id);`);
        await queryRunner.query(`CREATE INDEX idx_property_county ON properties(county_id);`);
        await queryRunner.query(`CREATE INDEX idx_certificate_number ON certificates(certificate_number);`);
        await queryRunner.query(`CREATE INDEX idx_certificate_status ON certificates(status);`);
        await queryRunner.query(`CREATE INDEX idx_certificate_property ON certificates(property_id);`);
        await queryRunner.query(`CREATE INDEX idx_certificate_auction ON certificates(auction_id);`);
    }
    async down(queryRunner) {
        // Drop tables in reverse order to respect foreign key constraints
        await queryRunner.query(`DROP TABLE IF EXISTS certificates;`);
        await queryRunner.query(`DROP TABLE IF EXISTS properties;`);
        await queryRunner.query(`DROP TABLE IF EXISTS auctions;`);
        await queryRunner.query(`DROP TABLE IF EXISTS counties;`);
    }
}
exports.CreateAuctionTables1693152000000 = CreateAuctionTables1693152000000;
//# sourceMappingURL=1693152000000-CreateAuctionTables.js.map