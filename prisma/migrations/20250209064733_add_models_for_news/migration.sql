-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountid` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `newsinfo` TEXT NULL,
    `visibility` ENUM('ALL', 'LIMITED') NOT NULL DEFAULT 'ALL',
    `ispublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsUsers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountid` INTEGER NOT NULL,
    `newsid` INTEGER NOT NULL,
    `userid` INTEGER NOT NULL,
    `status` ENUM('SENT', 'OPENED', 'READ') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_accountid_fkey` FOREIGN KEY (`accountid`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsUsers` ADD CONSTRAINT `NewsUsers_accountid_fkey` FOREIGN KEY (`accountid`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsUsers` ADD CONSTRAINT `NewsUsers_newsid_fkey` FOREIGN KEY (`newsid`) REFERENCES `News`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsUsers` ADD CONSTRAINT `NewsUsers_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
