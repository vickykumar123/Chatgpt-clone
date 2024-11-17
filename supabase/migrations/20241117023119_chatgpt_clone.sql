CREATE OR REPLACE FUNCTION create_message(
    message_id_input TEXT,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT,
    parent_message_id_input TEXT DEFAULT NULL,
    created_at_input TIMESTAMP DEFAULT NOW()
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO messages (
        messageId, userId, chatId, content, parentMessageId, createdAt
    ) VALUES (
        message_id_input,
        user_id_input,
        chat_id_input,
        message_content_input,
        parent_message_id_input,
        COALESCE(created_at_input, NOW())
    )
    ON CONFLICT (messageId) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_message_content(
    message_id TEXT,
    new_content TEXT,
    created_at_input TIMESTAMP DEFAULT NOW()
)
RETURNS VOID AS $$
BEGIN
    UPDATE messages
    SET 
        content = CONCAT(content, new_content),
        createdAt = COALESCE(created_at_input, NOW())
    WHERE messageId = message_id;
END;
$$ LANGUAGE plpgsql;

