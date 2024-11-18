export interface Message{
    id: string,
    createdAt:any,
    role: 'user' | 'assistant',
    content: string,
    parentId: string | null,
    messageId?: string | null       
}