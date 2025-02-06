/*
  Warnings:

  - You are about to drop the `UserLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserLocation` DROP FOREIGN KEY `UserLocation_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocation` DROP FOREIGN KEY `UserLocation_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocation` DROP FOREIGN KEY `UserLocation_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocation` DROP FOREIGN KEY `UserLocation_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocation` DROP FOREIGN KEY `UserLocation_userId_fkey`;

-- DropTable
DROP TABLE `UserLocation`;

-- CreateTable
CREATE TABLE `UserLocations` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserLocations` ADD CONSTRAINT `UserLocations_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLocations` ADD CONSTRAINT `UserLocations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLocations` ADD CONSTRAINT `UserLocations_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLocations` ADD CONSTRAINT `UserLocations_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLocations` ADD CONSTRAINT `UserLocations_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
