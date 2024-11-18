import { USER_ID } from "@/contants";
import supabase from "../../supabaseClient";

export async function getMessagesByChat(chatId:string) {
    try {
        const { data:messages, error } = await supabase.rpc("get_messages_by_chat", {
            user_id_input: USER_ID,
            chat_id_input: chatId,
        });

        if(error){
            throw error
        }

    return messages

    } catch (error) {
        console.error(error)
        throw new Error("[UNABLE_TO_GET_MESSAGES_BY_CHAT]")
    }
}