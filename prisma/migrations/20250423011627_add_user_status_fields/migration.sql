-- AlterTable
ALTER TABLE "users" ADD COLUMN     "kycStatus" TEXT DEFAULT 'Pending',
ADD COLUMN     "status" TEXT DEFAULT 'Pending KYC';
