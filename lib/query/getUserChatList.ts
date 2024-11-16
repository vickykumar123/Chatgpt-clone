import { API_URL } from "@/contants";

export async function getUserChatList(){
    const response = await fetch(`${API_URL}/api/chat`)
    if(!response.ok){
        throw new Error("Unable to fetch the chat list")
    }

    return response.json()
}