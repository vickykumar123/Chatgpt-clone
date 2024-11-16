CREATE OR REPLACE FUNCTION public.create_chat(
    user_id UUID,
    content TEXT
)
RETURNS UUID AS $$
DECLARE
    new_chat_id UUID;
BEGIN
    new_chat_id := uuid_generate_v4();
    INSERT INTO messages (messageId, userId, chatId, content)
    VALUES (uuid_generate_v4(), user_id, new_chat_id, content);

    RETURN new_chat_id;
END;
$$ LANGUAGE plpgsql;