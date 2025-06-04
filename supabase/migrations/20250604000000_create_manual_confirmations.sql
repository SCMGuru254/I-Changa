CREATE TABLE manual_confirmations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups (id) ON DELETE CASCADE,
    contributor_id UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
    confirmation_message TEXT,
    screenshot_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
