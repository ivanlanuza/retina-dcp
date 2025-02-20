-- AlterTable
ALTER TABLE `SurveyAnswers` ADD COLUMN `accountId` INTEGER NULL,
    ADD COLUMN `surveyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `SurveySubmissions` ADD COLUMN `accountId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SurveySubmissions` ADD CONSTRAINT `SurveySubmissions_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswers` ADD CONSTRAINT `SurveyAnswers_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Surveys`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswers` ADD CONSTRAINT `SurveyAnswers_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
