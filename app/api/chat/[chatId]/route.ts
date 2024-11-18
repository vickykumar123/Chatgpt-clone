import { handleError } from "@/lib/apiErrorHandler";
import { createMessage } from "@/lib/functions/messages/createMessage";
import { getMessagesByChat } from "@/lib/functions/messages/getMessagesByChat";
import { updateMessage } from "@/lib/functions/messages/updateMessage";
import supabase from "@/lib/supabaseClient";
import { Message } from "@/types/message";
import { NextRequest, NextResponse } from "next/server";

interface Params{
    chatId:string
}

export async function GET(_:any,  {params}: any){
    try {
        const param = await params as Params
        const chatId = param.chatId
        if(!param.chatId){
            return handleError({
                customErrorMessage:"chatId is required",
                statusCode:400
            })
        }

        const messages = await getMessagesByChat(chatId)
        
        const responseData = messages.map((data:any)=>{
            return {
                id: data.messageid,
            createdAt: data.createdat,
            role:data.role,
            content:data.content,
            parentId: data.parentmessageid
            }
        })

        return NextResponse.json({ messages: responseData});
    } catch (error) {
      return handleError({
        customErrorMessage:"[UNABLE_TO_GET_MESSAGE_BY_CHAT_ID]",
        error: error as Error
      })  
    }
}



export async function POST(request: NextRequest) {
    const { messages, chatId }:{messages:Message[], chatId:string} = await request.json();
    // Return early if no messages
    if (!messages || messages.length === 0) {
        return NextResponse.json({ message: "No messages to process" });
    }


    // Process the latest message
    const latestMessage = messages[messages.length - 1];
    const parentMessage = messages.length > 1 ? messages[messages.length - 2] : null;

  

    try {
        // Check if the message already exists
        const { data: existingMessage, error: fetchError } = await supabase
            .from("messages")
            .select("messageid")
            .eq("messageid", latestMessage.id)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            return handleError({
                customErrorMessage: fetchError.message,
                statusCode:500
            })
        }

        if (existingMessage) {
            // Update message content if it already exists
            await updateMessage({
                messageId:existingMessage.messageid,
                content: latestMessage.content,
                createdAt: latestMessage.createdAt
            })
        
            return NextResponse.json({ message: "Message updated successfully" });
        } else {
            // Insert new message
            await createMessage({
                latestMessage,parentMessage,chatId
            })

            return NextResponse.json({ message: "Message created successfully" });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
    }
}