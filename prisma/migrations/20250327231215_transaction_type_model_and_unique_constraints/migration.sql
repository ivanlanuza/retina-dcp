/*
  Warnings:

  - A unique constraint covering the columns `[accountid,productid,locationid]` on the table `InventoryAdjustments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountid,productid,locationid]` on the table `ProductLocations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `TransactionType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `accountId` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` INTEGER NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedById` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `InventoryAdjustments_accountid_productid_locationid_key` ON `InventoryAdjustments`(`accountid`, `productid`, `locationid`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductLocations_accountid_productid_locationid_key` ON `ProductLocations`(`accountid`, `productid`, `locationid`);

-- AddForeignKey
ALTER TABLE `TransactionType` ADD CONSTRAINT `TransactionType_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionType` ADD CONSTRAINT `TransactionType_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionType` ADD CONSTRAINT `TransactionType_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
