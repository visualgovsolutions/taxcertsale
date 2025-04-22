-- AlterTable
ALTER TABLE "counties" ADD COLUMN     "county_code" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "property_appraiser_url" TEXT,
ADD COLUMN     "tax_collector_url" TEXT,
ADD COLUMN     "website_url" TEXT;
