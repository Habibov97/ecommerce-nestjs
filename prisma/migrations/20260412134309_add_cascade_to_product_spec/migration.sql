-- DropForeignKey
ALTER TABLE "ProductSpecValue" DROP CONSTRAINT "ProductSpecValue_productSpecId_fkey";

-- AddForeignKey
ALTER TABLE "ProductSpecValue" ADD CONSTRAINT "ProductSpecValue_productSpecId_fkey" FOREIGN KEY ("productSpecId") REFERENCES "ProductSpec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
