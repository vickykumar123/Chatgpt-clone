# ChatGPT Clone

## Setup

1. Clone the repository:
   git clone <repoUrl>
2. Install dependencies:
   npm install
3. Start the development server:
   npm run dev

# API Endpoints


1. GET /api/chat
Description: Returns all chats of the user.
2. POST /api/chat
Description: Creates a new chat.
Request Body:
```

{
"chatTitle": "title 1"
}

```
Response: Returns the newly created chatID.
1. GET /api/chat/<chatId>
Description: Returns all messages of a specific chat.
1. POST /api/chat/<chatId>
Description: Adds a message to a specific chat.
Request Body:
```

{
"messages": {
"id": "string",
"createdAt": "any",
"role": "user | assistant",
"content": "string",
"parentId": "string | null",
"messageId": "string | null"
},
"chatId": "string"
}

```
3. POST /api/conversation
Description: Sends a message and gets the AI response in a stream.
Request Body:
```
{
"content": "string",
"role": "system | user | assistant | function | data | tool"
}
```
