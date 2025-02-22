/*
  Warnings:

  - You are about to drop the `UserAccessRights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLocations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserAccessRights` DROP FOREIGN KEY `UserAccessRights_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAccessRights` DROP FOREIGN KEY `UserAccessRights_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocations` DROP FOREIGN KEY `UserLocations_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocations` DROP FOREIGN KEY `UserLocations_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocations` DROP FOREIGN KEY `UserLocations_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocations` DROP FOREIGN KEY `UserLocations_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `UserLocations` DROP FOREIGN KEY `UserLocations_userId_fkey`;

-- DropTable
DROP TABLE `UserAccessRights`;

-- DropTable
DROP TABLE `UserLocations`;
