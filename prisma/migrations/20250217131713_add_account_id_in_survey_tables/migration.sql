/*
  Warnings:

  - Added the required column `accountId` to the `SurveyQuestions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Surveys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SurveyQuestions` ADD COLUMN `accountId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Surveys` ADD COLUMN `accountId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Surveys` ADD CONSTRAINT `Surveys_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyQuestions` ADD CONSTRAINT `SurveyQuestions_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
