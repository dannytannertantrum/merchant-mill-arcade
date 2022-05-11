-- CREATE TABLE scores

CREATE TABLE IF NOT EXISTS scores (
    id uuid DEFAULT gen_random_uuid(),
    game uuid REFERENCES games (id),
    initials VARCHAR(3) NOT NULL,
    score VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
