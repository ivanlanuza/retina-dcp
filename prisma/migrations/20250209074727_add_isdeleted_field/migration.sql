-- AlterTable
ALTER TABLE `Accounts` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Agencies` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `AnswerOptions` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Answers` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Brands` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Categories` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Classes` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `CompetitorBrands` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Competitors` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Customers` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Forms` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Locations` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `News` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `NewsUsers` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Products` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Questions` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Roles` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Subcategories` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Subclasses` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Submissions` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Suppliers` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Teams` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `UserLocations` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `isdeleted` BOOLEAN NOT NULL DEFAULT false;
