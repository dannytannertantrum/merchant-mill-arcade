-- ADD COLUMN is_deleted to scores table

ALTER TABLE scores
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
