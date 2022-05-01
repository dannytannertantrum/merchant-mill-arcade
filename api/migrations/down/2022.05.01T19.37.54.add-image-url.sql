-- REMOVE image_url column to games table

ALTER TABLE games
DROP COLUMN image_url;
