CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL,
  phone      VARCHAR(30),
  message    TEXT          NOT NULL,
  ip         VARCHAR(64),
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS is_read    BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS handled    BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reply_sent BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages (created_at DESC);
