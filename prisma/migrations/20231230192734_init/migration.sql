-- CreateTable
CREATE TABLE `author` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(1024) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(1024) NULL,
    `text` MEDIUMTEXT NULL,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `rating` INTEGER NULL,
    `source` VARCHAR(1024) NULL,
    `cover` VARCHAR(255) NULL,
    `text_length` INTEGER NULL,
    `author_id` INTEGER NULL,
    `series_id` INTEGER NULL,
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
CREATE TABLE `media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `book_id` INTEGER NOT NULL,

    INDEX `idx-media-book_id`(`book_id`),
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
    `name` VARCHAR(255) NOT NULL,
    `url` VARCHAR(1024) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `salt` VARCHAR(255) NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
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
ALTER TABLE `media` ADD CONSTRAINT `fk-media-book_id` FOREIGN KEY (`book_id`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
