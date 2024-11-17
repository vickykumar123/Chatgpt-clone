CREATE OR REPLACE FUNCTION create_message(
    message_id_input TEXT,
    user_id_input UUID,
    chat_id_input UUID,
    message_content_input TEXT,
    parent_message_id_input TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Check if the messageId already exists
    IF EXISTS (SELECT 1 FROM messages WHERE messages.messageid = message_id_input) THEN
        -- Do nothing if the messageId already exists
        RETURN;
    END IF;

    -- Check if parentMessageId is the same as messageId
    IF message_id_input = parent_message_id_input THEN
        -- Log a notice and skip the insertion
        RAISE NOTICE 'Skipping insertion: Parent message ID cannot be the same as message ID: %', message_id_input;
        RETURN;
    END IF;

    -- Insert the message into the table
    INSERT INTO messages (messages.messageid, messages.userid, messages.chatid, messages.content, messages.parentmessageid, messages.createdat)
    VALUES (
        message_id_input,
        user_id_input,
        chat_id_input,
        message_content_input,
        parent_message_id_input,
        now()
    );
END;
$$ LANGUAGE plpgsql;
