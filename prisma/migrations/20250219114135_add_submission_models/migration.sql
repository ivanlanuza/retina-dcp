-- DropForeignKey
ALTER TABLE `DTR` DROP FOREIGN KEY `DTR_userId_fkey`;

-- DropIndex
DROP INDEX `DTR_userId_date_key` ON `DTR`;

-- CreateTable
CREATE TABLE `SurveySubmissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isdeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyAnswers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `answerValue` JSON NOT NULL,
    `submissionId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `isdeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SurveySubmissions` ADD CONSTRAINT `SurveySubmissions_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Surveys`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveySubmissions` ADD CONSTRAINT `SurveySubmissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswers` ADD CONSTRAINT `SurveyAnswers_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `SurveySubmissions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswers` ADD CONSTRAINT `SurveyAnswers_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `SurveyQuestions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
