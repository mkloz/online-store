-- AlterTable
ALTER TABLE `review` ADD COLUMN `author_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
