-- CreateTable
CREATE TABLE `Surveys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `allowMultiple` BOOLEAN NOT NULL DEFAULT false,
    `openFrom` DATETIME(3) NULL,
    `openUntil` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL,
    `scopeType` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isdeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyQuestions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyId` INTEGER NOT NULL,
    `question` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `options` LONGTEXT NULL,
    `externalid` INTEGER NULL,
    `sortOrder` INTEGER NULL,
    `isMandatory` BOOLEAN NOT NULL DEFAULT false,
    `geofence` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isdeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Surveys` ADD CONSTRAINT `Surveys_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyQuestions` ADD CONSTRAINT `SurveyQuestions_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Surveys`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
