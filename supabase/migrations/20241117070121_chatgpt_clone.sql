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
        messages.id,
        messages.messageid,
        messages.content,
        messages.parentmessageid,
        messages.createdat
    FROM messages
    WHERE 
        messages.userid = user_id_input
        AND messages.chatid = chat_id_input
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


CREATE OR REPLACE FUNCTION create_message(
    message_id_input TEXT,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT,
    parent_message_id_input TEXT DEFAULT NULL,
    created_at_input TIMESTAMP DEFAULT NOW(),
    role_input TEXT DEFAULT 'user'  -- Added a default value for role_input
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO messages (
        messageid, userid, chatid, content, role, parentMessageid, createdat
    ) VALUES (
        message_id_input,
        user_id_input,
        chat_id_input,
        message_content_input,
        role_input,
        parent_message_id_input,
        COALESCE(created_at_input, NOW())
    )
    ON CONFLICT (messageid) DO NOTHING;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION update_message_content(
    message_id TEXT,
    new_content TEXT,
    created_at_input TIMESTAMP DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Update the message content with the new content
    UPDATE messages
    SET content = new_content, -- Replace the content
        createdAt = COALESCE(created_at_input, createdAt)
    WHERE messageId = message_id;
END;
$$ LANGUAGE plpgsql;
