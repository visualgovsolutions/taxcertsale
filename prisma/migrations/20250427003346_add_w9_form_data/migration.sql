-- AlterTable
ALTER TABLE "auctions" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';

-- AlterTable
ALTER TABLE "counties" ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "primary_color" TEXT;

-- CreateTable
CREATE TABLE "w9_form_data" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "county_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessName" TEXT,
    "taxClassification" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "account_numbers" TEXT,
    "ssn" TEXT,
    "ein" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "file_url" TEXT,
    "approved_by" TEXT,
    "rejection_reason" TEXT,
    "submission_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approval_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "w9_form_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "w9_form_data_user_id_county_id_key" ON "w9_form_data"("user_id", "county_id");

-- AddForeignKey
ALTER TABLE "w9_form_data" ADD CONSTRAINT "w9_form_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "w9_form_data" ADD CONSTRAINT "w9_form_data_county_id_fkey" FOREIGN KEY ("county_id") REFERENCES "counties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
