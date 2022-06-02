-- ALTER COLUMN score to be BIGINT
-- https://stackoverflow.com/questions/13170570/change-type-of-varchar-field-to-integer-cannot-be-cast-automatically-to-type-i

ALTER TABLE scores
ALTER COLUMN score TYPE BIGINT USING (trim(score)::BIGINT);
