CREATE TABLE IF NOT EXISTS messages (
    messageId TEXT PRIMARY KEY NOT NULL,
    userId UUID NOT NULL,
    chatId UUID NOT NULL,
    content TEXT NOT NULL,
    parentMessageId TEXT NULL,
    role TEXT DEFAULT 'assistant',	
    createdAt TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_chat FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION get_messages_by_chat(
    user_id_input UUID,
    chat_id_input UUID
) RETURNS TABLE (
    messageid TEXT,
    content TEXT,
    parentMessageid TEXT,
    createdat TIMESTAMP,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        messages.messageid,
        messages.content,
        messages.parentmessageid,
        messages.createdat,
        messages.role
    FROM messages
    WHERE 
        messages.userid = user_id_input
        AND messages.chatid = chat_id_input
    ORDER BY messages.createdat ASC;
END;
$$ LANGUAGE plpgsql;
