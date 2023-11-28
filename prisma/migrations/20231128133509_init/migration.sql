/*
  Warnings:

  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email`,
    ADD COLUMN `username` VARCHAR(255) NULL,
    MODIFY `password` VARCHAR(255) NULL,
    MODIFY `access_token` VARCHAR(255) NULL,
    MODIFY `role` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `author` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `url` VARCHAR(1024) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` VARCHAR(1024) NULL,
    `text` MEDIUMTEXT NULL,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `rating` INTEGER NULL,
    `bookmark` INTEGER NULL,
    `source` VARCHAR(1024) NULL,
    `cover` VARCHAR(255) NULL,
    `text_length` INTEGER NULL,
    `author_id` INTEGER NULL,
    `series_id` INTEGER NULL,
    `created_at` INTEGER NULL,
    `updated_at` INTEGER NULL,
    `last_read` INTEGER NULL,

    INDEX `idx-book-author_id`(`author_id`),
    INDEX `idx-book-series_id`(`series_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book_tag` (
    `book_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,

    INDEX `idx-book_tag-book_id`(`book_id`),
    INDEX `idx-book_tag-tag_id`(`tag_id`),
    PRIMARY KEY (`book_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(255) NULL,
    `path` VARCHAR(255) NULL,
    `book_id` INTEGER NOT NULL,

    INDEX `idx-image-book_id`(`book_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migration` (
    `version` VARCHAR(180) NOT NULL,
    `apply_time` INTEGER NULL,

    PRIMARY KEY (`version`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `series` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `url` VARCHAR(1024) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `fk-book-author_id` FOREIGN KEY (`author_id`) REFERENCES `author`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `fk-book-series_id` FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `book_tag` ADD CONSTRAINT `fk-book_tag-book_id` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `book_tag` ADD CONSTRAINT `fk-book_tag-tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `fk-image-book_id` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
