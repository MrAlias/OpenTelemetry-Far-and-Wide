-- Existing disposable demo volumes predate the real timeout/fallback scenario.
ALTER TABLE products ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 42;
