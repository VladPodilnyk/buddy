CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id VARCHAR(64) NOT NULL,
    participant_id VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    created_at BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
