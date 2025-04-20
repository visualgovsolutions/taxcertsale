import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1623456789000 implements MigrationInterface {
  name = 'CreateInitialTables1623456789000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Explicitly drop all tables and types if they exist (failsafe)
    await queryRunner.query(`DROP TABLE IF EXISTS "bids" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "certificates" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "auctions" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "properties" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "counties" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE`);
    
    await queryRunner.query(`DROP TYPE IF EXISTS bid_status_enum CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS certificate_status_enum CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS auction_status_enum CASCADE`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum CASCADE`);

    // Create users table
    await queryRunner.query(`
      CREATE TYPE user_role_enum AS ENUM ('admin', 'staff', 'investor', 'user');
      
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL UNIQUE,
        "password" varchar NOT NULL,
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "phone_number" varchar,
        "role" user_role_enum NOT NULL DEFAULT 'user',
        "is_verified" boolean NOT NULL DEFAULT false,
        "verification_token" varchar,
        "reset_password_token" varchar,
        "reset_password_expires" TIMESTAMP,
        "preferences" jsonb,
        "metadata" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Create counties table
    await queryRunner.query(`
      CREATE TABLE "counties" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL UNIQUE,
        "state" varchar,
        "county_code" varchar,
        "website_url" varchar,
        "tax_collector_url" varchar,
        "property_appraiser_url" varchar,
        "description" text,
        "metadata" jsonb,
        "latitude" decimal(10,6),
        "longitude" decimal(10,6),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Create properties table
    await queryRunner.query(`
      CREATE TABLE "properties" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "parcel_id" varchar NOT NULL UNIQUE,
        "address" varchar NOT NULL,
        "city" varchar,
        "state" varchar,
        "zip_code" varchar,
        "latitude" decimal(10,6),
        "longitude" decimal(10,6),
        "land_area" decimal(10,2),
        "property_type" varchar,
        "zoning" varchar,
        "building_area" decimal(10,2),
        "owner_name" varchar,
        "description" text,
        "metadata" jsonb,
        "county_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_properties_county" FOREIGN KEY ("county_id") REFERENCES "counties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `);

    // Create auctions table
    await queryRunner.query(`
      CREATE TYPE auction_status_enum AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
      
      CREATE TABLE "auctions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "auction_date" date NOT NULL,
        "start_time" time,
        "end_time" time,
        "status" auction_status_enum NOT NULL DEFAULT 'upcoming',
        "description" text,
        "location" varchar,
        "registration_url" varchar,
        "metadata" jsonb,
        "county_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_auctions_county" FOREIGN KEY ("county_id") REFERENCES "counties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `);

    // Create certificates table
    await queryRunner.query(`
      CREATE TYPE certificate_status_enum AS ENUM ('available', 'sold', 'redeemed', 'expired');
      
      CREATE TABLE "certificates" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "certificate_number" varchar NOT NULL UNIQUE,
        "face_value" decimal(10,2) NOT NULL,
        "interest_rate" decimal(5,2) NOT NULL,
        "issue_date" date NOT NULL,
        "status" certificate_status_enum NOT NULL DEFAULT 'available',
        "sold_date" date,
        "redeemed_date" date,
        "redemption_amount" decimal(10,2),
        "earnings_amount" decimal(10,2),
        "holder_id" varchar,
        "metadata" jsonb,
        "auction_id" uuid NOT NULL,
        "property_id" uuid NOT NULL,
        "county_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_certificates_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_certificates_property" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_certificates_county" FOREIGN KEY ("county_id") REFERENCES "counties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `);

    // Create bids table
    await queryRunner.query(`
      CREATE TYPE bid_status_enum AS ENUM ('placed', 'accepted', 'rejected', 'outbid', 'winning');
      
      CREATE TABLE "bids" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "amount" decimal(10,2) NOT NULL,
        "interest_rate" decimal(5,2),
        "status" bid_status_enum NOT NULL DEFAULT 'placed',
        "bid_time" TIMESTAMP NOT NULL,
        "ip_address" varchar,
        "metadata" jsonb,
        "user_id" uuid NOT NULL,
        "certificate_id" uuid NOT NULL,
        "auction_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_bids_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_bids_certificate" FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_bids_auction" FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_properties_county_id" ON "properties" ("county_id");
      CREATE INDEX "IDX_properties_parcel_id" ON "properties" ("parcel_id");
      CREATE INDEX "IDX_auctions_county_id" ON "auctions" ("county_id");
      CREATE INDEX "IDX_auctions_auction_date" ON "auctions" ("auction_date");
      CREATE INDEX "IDX_certificates_auction_id" ON "certificates" ("auction_id");
      CREATE INDEX "IDX_certificates_property_id" ON "certificates" ("property_id");
      CREATE INDEX "IDX_certificates_county_id" ON "certificates" ("county_id");
      CREATE INDEX "IDX_certificates_certificate_number" ON "certificates" ("certificate_number");
      CREATE INDEX "IDX_bids_user_id" ON "bids" ("user_id");
      CREATE INDEX "IDX_bids_certificate_id" ON "bids" ("certificate_id");
      CREATE INDEX "IDX_bids_auction_id" ON "bids" ("auction_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "bids"`);
    await queryRunner.query(`DROP TABLE "certificates"`);
    await queryRunner.query(`DROP TABLE "auctions"`);
    await queryRunner.query(`DROP TABLE "properties"`);
    await queryRunner.query(`DROP TABLE "counties"`);
    await queryRunner.query(`DROP TABLE "users"`);
    
    // Drop enum types
    await queryRunner.query(`DROP TYPE "bid_status_enum"`);
    await queryRunner.query(`DROP TYPE "certificate_status_enum"`);
    await queryRunner.query(`DROP TYPE "auction_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
} 