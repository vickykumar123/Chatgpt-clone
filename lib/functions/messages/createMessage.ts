import { USER_ID } from "@/contants";
import supabase from "../../supabaseClient";
import { Message } from "@/types/message";

interface CreateMessage{
    latestMessage:Message,
    parentMessage:Message | null,
    chatId:string
}


export async function createMessage({
    latestMessage,parentMessage,chatId
}:CreateMessage) {
    try {
        const { error: insertError } = await supabase.rpc("create_message", {
            message_id_input: latestMessage.messageId || latestMessage.id,
            user_id_input: USER_ID,
            chat_id_input: chatId,  // Pass chat_id_input here
            message_content_input: latestMessage.content,
            parent_message_id_input: parentMessage ? parentMessage.id : null,
            created_at_input: latestMessage.createdAt || null,
            role_input: latestMessage.role
        });

        if(insertError){
            throw insertError
        }

    } catch (error) {
        console.error(error)
        throw new Error("[UNABLE_TO_CREATE_MESSAGE]")
    }
}