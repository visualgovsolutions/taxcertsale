-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "description" TEXT,
ADD COLUMN     "end_time" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'County Tax Certificate Auction',
ADD COLUMN     "registration_url" TEXT,
ADD COLUMN     "start_time" TEXT;
