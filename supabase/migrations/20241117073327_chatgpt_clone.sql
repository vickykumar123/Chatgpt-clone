CREATE OR REPLACE FUNCTION create_message(
    message_id_input TEXT,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT,
    created_at_input TIMESTAMP DEFAULT NOW(),
    role_input TEXT DEFAULT 'user',  -- Added a default value for role_input
    parent_message_id_input TEXT DEFAULT NULL  -- Added missing comma before this line
)
RETURNS VOID AS $$
BEGIN
    -- Skip if message ID already exists
    IF EXISTS (SELECT 1 FROM messages WHERE messageid = message_id_input) THEN
        RETURN;
    END IF;

    -- Skip if parentMessageId equals messageId
    IF message_id_input = parent_message_id_input THEN
        RAISE NOTICE 'Parent ID cannot match message ID';
        RETURN;
    END IF;

    -- Insert the message into the table
    INSERT INTO messages (messageid, userid, chatid, content, parentmessageid, createdat, role)
    VALUES (
        message_id_input,
        user_id_input,
        chat_id_input,
        message_content_input,
        parent_message_id_input,
        created_at_input,
        role_input
    );
END;
$$ LANGUAGE plpgsql;
