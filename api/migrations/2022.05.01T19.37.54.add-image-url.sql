-- ADD image_url column to games table

ALTER TABLE games
ADD COLUMN image_url VARCHAR(1024);
