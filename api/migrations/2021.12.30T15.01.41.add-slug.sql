-- Add slug column to games table

ALTER TABLE games
ADD COLUMN slug VARCHAR(500) NOT NULL;
