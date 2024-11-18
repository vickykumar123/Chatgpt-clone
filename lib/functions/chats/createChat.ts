import { USER_ID } from "@/contants";
import supabase from "@/lib/supabaseClient";

export async function createChat(chatTitle:string){
    try {
        const { data, error } = await supabase.rpc('create_chat', {
            user_id_input: USER_ID,
            chat_title_input: chatTitle,
        });

        if(error){
            throw error
        }

        return data

    } catch (error) {
        console.error(error);
        throw new Error("[UNABLE_TO_CREATE_CHAT]")
    }
}