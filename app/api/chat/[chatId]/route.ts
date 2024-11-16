import { USER_ID } from "@/contants";
import { handleError } from "@/lib/apiErrorHandler";
import supabase from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

interface Params{
    chatId:string
}

export async function GET(_:any,  {params}: any){
    try {
        const param = await params as Params
        if(!param.chatId){
            return handleError({
                customErrorMessage:"chatId is required",
                statusCode:400
            })
        }

        const { data, error } = await supabase.rpc('get_messages_by_chat', {
            chat_id_input: param.chatId,
            user_id_input: USER_ID,
        });

        if(error){
            throw error
        }

        return NextResponse.json(data)
    } catch (error) {
      return handleError({
        customErrorMessage:"[UNABLE_TO_GET_MESSAGE_BY_CHAT_ID]",
        error: error as Error
      })  
    }
}