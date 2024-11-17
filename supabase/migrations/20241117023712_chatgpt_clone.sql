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
