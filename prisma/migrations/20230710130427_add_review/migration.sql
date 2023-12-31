-- CreateTable
CREATE TABLE `review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(3000) NOT NULL,
    `stars` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `article_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TRIGGER update_rating_insert
AFTER INSERT ON review
FOR EACH ROW
BEGIN
  UPDATE article
  SET rating = (
    SELECT AVG(stars)
    FROM review
    WHERE article_id = NEW.article_id
  )
  WHERE id = NEW.article_id;
END;

CREATE TRIGGER update_rating_update
AFTER UPDATE ON review
FOR EACH ROW
BEGIN
  UPDATE article
  SET rating = (
    SELECT AVG(stars)
    FROM review
    WHERE article_id = NEW.article_id
  )
  WHERE id = NEW.article_id;
END;

CREATE TRIGGER update_rating_delete
AFTER DELETE ON review
FOR EACH ROW
BEGIN
  UPDATE article
  SET rating = (
    SELECT AVG(stars)
    FROM review
    WHERE article_id = OLD.article_id
  )
  WHERE id = OLD.article_id;
END;
-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
