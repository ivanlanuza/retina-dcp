-- CreateTable
CREATE TABLE `ProductLocations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productid` INTEGER NOT NULL,
    `locationid` INTEGER NOT NULL,
    `isactive` BOOLEAN NOT NULL DEFAULT true,
    `inventorycount` INTEGER NOT NULL DEFAULT 0,
    `isdeleted` BOOLEAN NOT NULL DEFAULT false,
    `userid` INTEGER NULL,
    `accountid` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryAdjustments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productid` INTEGER NOT NULL,
    `locationid` INTEGER NOT NULL,
    `oldinventorycount` INTEGER NOT NULL,
    `adjustmentqty` INTEGER NOT NULL,
    `newinventorycount` INTEGER NOT NULL,
    `isdeleted` BOOLEAN NOT NULL DEFAULT false,
    `userid` INTEGER NULL,
    `accountid` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductLocations` ADD CONSTRAINT `ProductLocations_productid_fkey` FOREIGN KEY (`productid`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductLocations` ADD CONSTRAINT `ProductLocations_locationid_fkey` FOREIGN KEY (`locationid`) REFERENCES `Locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductLocations` ADD CONSTRAINT `ProductLocations_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductLocations` ADD CONSTRAINT `ProductLocations_accountid_fkey` FOREIGN KEY (`accountid`) REFERENCES `Accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustments` ADD CONSTRAINT `InventoryAdjustments_productid_fkey` FOREIGN KEY (`productid`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustments` ADD CONSTRAINT `InventoryAdjustments_locationid_fkey` FOREIGN KEY (`locationid`) REFERENCES `Locations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustments` ADD CONSTRAINT `InventoryAdjustments_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustments` ADD CONSTRAINT `InventoryAdjustments_accountid_fkey` FOREIGN KEY (`accountid`) REFERENCES `Accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
