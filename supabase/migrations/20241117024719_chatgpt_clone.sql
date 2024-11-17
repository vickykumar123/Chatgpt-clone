CREATE OR REPLACE FUNCTION get_messages_by_chat(
    user_id_input UUID,
    chat_id_input UUID
) RETURNS TABLE (
    id UUID,
    messageid TEXT,
    content TEXT,
    parentMessageid TEXT,
    createdat TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        messageid,
        content,
        parentMessageid,
        createdat
    FROM messages
    WHERE 
        userid = user_id_input
        AND chatid = chat_id_input
    ORDER BY createdAt ASC;
END;
$$ LANGUAGE plpgsql;
