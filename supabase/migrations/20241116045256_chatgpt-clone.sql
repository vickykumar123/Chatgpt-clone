CREATE TABLE IF NOT EXISTS messages (
    messageId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL,
    chatId UUID NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT now()
);
