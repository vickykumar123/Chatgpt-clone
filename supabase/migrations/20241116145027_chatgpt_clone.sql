CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    messageId TEXT,
    userId UUID NOT NULL,
    chatId UUID NOT NULL,
    content TEXT NOT NULL,
    parentMessageId TEXT NULL,
    createdAt TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_chat FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION create_message(
    message_id_input TEXT,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT,
    parent_message_id_input TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO messages (messageId, userId, chatId, content, parentMessageId, createdAt)
    VALUES (message_id_input, user_id_input, chat_id_input, message_content_input, parent_message_id_input, now());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_messages_by_chat(
    chat_id_input UUID,
    user_id_input UUID
)
RETURNS TABLE (
    messageId TEXT,
    userId UUID,
    chatId UUID,
    content TEXT,
    parentMessageId TEXT,
    createdAt TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT messageId, userId, chatId, content, parentMessageId, createdAt
    FROM messages
    WHERE chatId = chat_id_input AND userId = user_id_input
    ORDER BY createdAt ASC;
END;
$$ LANGUAGE plpgsql;

