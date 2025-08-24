-- CreateTable
CREATE TABLE `message_threads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_phone_number` VARCHAR(255) NOT NULL,
    `thread_id` VARCHAR(255) NOT NULL,
    `status` ENUM('ACTIVE', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
