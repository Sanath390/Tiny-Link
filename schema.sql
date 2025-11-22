CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_clicked TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_short_code ON links(short_code);