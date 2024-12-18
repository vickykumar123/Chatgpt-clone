CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL,
    title TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    messageId TEXT,
    userId UUID NOT NULL,
    chatId UUID NOT NULL,
    content TEXT NOT NULL,
    parentMessageId TEXT NULL,
    role TEXT DEFAULT 'assistant',	
    createdAt TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_chat FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE
);



