CREATE OR REPLACE FUNCTION get_chats_by_user(
    user_id_input UUID
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT chats.id, chats.title, chats.createdat -- Qualified column names
    FROM chats
    WHERE chats.userid = user_id_input -- Qualified column name
    ORDER BY chats.createdat DESC;
END;
$$ LANGUAGE plpgsql;