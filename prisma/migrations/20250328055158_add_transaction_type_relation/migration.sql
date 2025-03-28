-- AlterTable
ALTER TABLE `InventoryAdjustments` ADD COLUMN `transactionTypeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProductLocations` ADD COLUMN `transactionTypeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ProductLocations` ADD CONSTRAINT `ProductLocations_transactionTypeId_fkey` FOREIGN KEY (`transactionTypeId`) REFERENCES `TransactionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustments` ADD CONSTRAINT `InventoryAdjustments_transactionTypeId_fkey` FOREIGN KEY (`transactionTypeId`) REFERENCES `TransactionType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
