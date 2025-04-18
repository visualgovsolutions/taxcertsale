"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInitialSchema1625140000000 = void 0;
class CreateInitialSchema1625140000000 {
    name = 'CreateInitialSchema1625140000000';
    async up(queryRunner) {
        // Create counties table
        await queryRunner.query(`
      CREATE TABLE "counties" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "state" character varying(2) NOT NULL,
        "description" text,
        "website" character varying(255),
        "contactInfo" jsonb,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_counties_name" UNIQUE ("name"),
        CONSTRAINT "PK_counties" PRIMARY KEY ("id")
      )
    `);
        // Create properties table
        await queryRunner.query(`
      CREATE TABLE "properties" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "parcelId" character varying(100) NOT NULL,
        "address" character varying(255),
        "city" character varying(100),
        "zipCode" character varying(10),
        "assessedValue" numeric(12,2),
        "latitude" double precision,
        "longitude" double precision,
        "propertyType" character varying(50),
        "description" text,
        "metadata" jsonb,
        "countyId" UUID,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_properties_parcelId" UNIQUE ("parcelId"),
        CONSTRAINT "PK_properties" PRIMARY KEY ("id")
      )
    `);
        // Create auctions table
        await queryRunner.query(`
      CREATE TABLE "auctions" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "auctionDate" TIMESTAMP,
        "startTime" TIME,
        "endTime" TIME,
        "status" character varying(20) NOT NULL DEFAULT 'scheduled',
        "description" text,
        "location" character varying(255),
        "registrationUrl" character varying(255),
        "metadata" jsonb,
        "countyId" UUID,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_auctions" PRIMARY KEY ("id")
      )
    `);
        // Create certificates table
        await queryRunner.query(`
      CREATE TABLE "certificates" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "certificateNumber" character varying(100) NOT NULL,
        "faceValue" numeric(12,2) NOT NULL,
        "interestRate" numeric(5,2),
        "issueDate" TIMESTAMP,
        "expirationDate" TIMESTAMP,
        "redemptionDate" TIMESTAMP,
        "status" character varying(20) NOT NULL DEFAULT 'active',
        "notes" text,
        "metadata" jsonb,
        "countyId" UUID,
        "propertyId" UUID,
        "auctionId" UUID,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_certificates_certificateNumber" UNIQUE ("certificateNumber"),
        CONSTRAINT "PK_certificates" PRIMARY KEY ("id")
      )
    `);
        // Add foreign key constraints
        await queryRunner.query(`
      ALTER TABLE "properties" 
      ADD CONSTRAINT "FK_properties_counties" 
      FOREIGN KEY ("countyId") REFERENCES "counties"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "auctions" 
      ADD CONSTRAINT "FK_auctions_counties" 
      FOREIGN KEY ("countyId") REFERENCES "counties"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "certificates" 
      ADD CONSTRAINT "FK_certificates_counties" 
      FOREIGN KEY ("countyId") REFERENCES "counties"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "certificates" 
      ADD CONSTRAINT "FK_certificates_properties" 
      FOREIGN KEY ("propertyId") REFERENCES "properties"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "certificates" 
      ADD CONSTRAINT "FK_certificates_auctions" 
      FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        // Create uuid-ossp extension if it doesn't exist (for uuid_generate_v4())
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }
    async down(queryRunner) {
        // Drop all foreign key constraints first
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_certificates_auctions"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_certificates_properties"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_certificates_counties"`);
        await queryRunner.query(`ALTER TABLE "auctions" DROP CONSTRAINT "FK_auctions_counties"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_properties_counties"`);
        // Drop tables
        await queryRunner.query(`DROP TABLE "certificates"`);
        await queryRunner.query(`DROP TABLE "auctions"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TABLE "counties"`);
    }
}
exports.CreateInitialSchema1625140000000 = CreateInitialSchema1625140000000;
//# sourceMappingURL=1625140000000-CreateInitialSchema.js.map