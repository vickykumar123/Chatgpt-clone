-- Function: create_message
CREATE OR REPLACE FUNCTION create_message(
    message_id_input UUID,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO messages (messageid, userid, chatid, content, createdat)
    VALUES (message_id_input, user_id_input, chat_id_input, message_content_input, now());
END;
$$ LANGUAGE plpgsql;

-- Function: update_message
CREATE OR REPLACE FUNCTION update_message(
    message_id_input UUID,
    updated_content_input TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE messages
    SET content = updated_content_input, created_at = now()
    WHERE messages.messageid = message_id_input;
END;
$$ LANGUAGE plpgsql;

-- Function: get_messages_by_chat
CREATE OR REPLACE FUNCTION get_messages_by_chat(
    chat_id_input UUID,
    user_id_input UUID
)
RETURNS TABLE (
    messageid UUID,
    userid UUID,
    chatid UUID,
    content TEXT,
    createdat TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT messages.messageid, messages.userid, messages.chatid, messages.content, messages.createdat
    FROM messages
    WHERE messages.chatid = chat_id_input AND messages.userid = user_id_input
    ORDER BY messages.createdat ASC;
END;
$$ LANGUAGE plpgsql;

-- Function: create_chat
CREATE OR REPLACE FUNCTION create_chat(
    user_id_input UUID,
    chat_title_input TEXT
)
RETURNS UUID AS $$
DECLARE
    new_chat_id UUID;
BEGIN
    new_chat_id := uuid_generate_v4();
    INSERT INTO chats (id, userid, title, createdat)
    VALUES (new_chat_id, user_id_input, chat_title_input, now());
    RETURN new_chat_id;
END;
$$ LANGUAGE plpgsql;
