/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
DROP COLUMN "slug";

-- CreateTable
CREATE TABLE "Translation" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryTranslation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryTranslation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Translation_lang_model_modelId_field_key" ON "Translation"("lang", "model", "modelId", "field");

-- CreateIndex
CREATE INDEX "_CategoryTranslation_B_index" ON "_CategoryTranslation"("B");

-- AddForeignKey
ALTER TABLE "_CategoryTranslation" ADD CONSTRAINT "_CategoryTranslation_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTranslation" ADD CONSTRAINT "_CategoryTranslation_B_fkey" FOREIGN KEY ("B") REFERENCES "Translation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
