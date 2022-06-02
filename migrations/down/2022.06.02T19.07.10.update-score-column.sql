-- ALTER COLUMN score back to character varying

ALTER TABLE scores
ALTER COLUMN score TYPE VARCHAR(50) USING (score::VARCHAR(50));
