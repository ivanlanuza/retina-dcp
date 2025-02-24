/*
  Warnings:

  - You are about to drop the column `location` on the `DTR` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DTR` DROP COLUMN `location`,
    ADD COLUMN `locationid` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `DTR` ADD CONSTRAINT `DTR_locationid_fkey` FOREIGN KEY (`locationid`) REFERENCES `Locations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
