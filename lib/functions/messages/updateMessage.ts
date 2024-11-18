import supabase from "../../supabaseClient";


interface UpdateMessage{
    messageId:string
    content: string,
    createdAt: Date
}

export async function updateMessage({
    messageId, content, createdAt
}:UpdateMessage){
    try {
        const { error: updateError } = await supabase.rpc("update_message_content", {
            message_id: messageId,
            new_content: content,
            created_at_input: createdAt || null,
        }); 

        if(updateError){
            throw updateError
        }

    } catch (error) {
        console.error(error)
        throw new Error("[UNABLE_TO_UPDATE_MESSAGE]")
    }
} 