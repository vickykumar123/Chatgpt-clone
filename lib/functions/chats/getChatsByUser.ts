import { USER_ID } from "@/contants";
import supabase from "@/lib/supabaseClient";

export async function getChatsByUser(){
    try {
        const { data, error } = await supabase.rpc('get_chats_by_user', {
            user_id_input: USER_ID,
        });
      
        if(error){
          throw error
        }

        return data

    } catch (error) {
        console.error(error);
        throw new Error("[UNABLE_TO_GET_CHAT_BY_USER]")
    }
}