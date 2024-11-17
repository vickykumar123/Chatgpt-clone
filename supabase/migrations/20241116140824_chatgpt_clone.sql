CREATE OR REPLACE FUNCTION create_message(
    message_id_input UUID,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT,
    parent_message_id_input UUID DEFAULT NULL
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
    messageId UUID,
    userId UUID,
    chatId UUID,
    content TEXT,
    parentMessageId UUID,
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
