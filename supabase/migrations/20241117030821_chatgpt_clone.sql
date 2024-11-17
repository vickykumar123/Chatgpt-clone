CREATE OR REPLACE FUNCTION get_messages_by_chat(
    user_id_input UUID,
    chat_id_input UUID
) RETURNS TABLE (
    id UUID,
    messageid TEXT,
    content TEXT,
    parentMessageid TEXT,
    createdat TIMESTAMP,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        messages.id,
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