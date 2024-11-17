ALTER TABLE messages
ADD COLUMN role TEXT NOT NULL DEFAULT 'assistant';


CREATE OR REPLACE FUNCTION create_message(
    message_id_input TEXT,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT,
    role_input TEXT,
    parent_message_id_input TEXT DEFAULT NULL,
    created_at_input TIMESTAMP DEFAULT NOW()
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO messages (
        messageId, userId, chatId, content, role, parentMessageId, createdAt
    ) VALUES (
        message_id_input,
        user_id_input,
        chat_id_input,
        message_content_input,
        role_input,
        parent_message_id_input,
        COALESCE(created_at_input, NOW())
    )
    ON CONFLICT (messageId) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
