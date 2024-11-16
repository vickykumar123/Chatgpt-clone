import {NextRequest, NextResponse} from "next/server";
import {handleError} from "@/lib/apiErrorHandler";
import supabase from "@/lib/supabaseClient";
import { USER_ID } from "@/contants";


export async function GET(){
  try {
    const { data, error } = await supabase.rpc('get_chats_by_user', {
      user_id_input: USER_ID,
  });

  if(error){
    throw error
  }

  return NextResponse.json(data)
  } catch (error) {
    return handleError({
      customErrorMessage:"[UNABLE_TO_GET_USER_CHAT]",
      error:error as Error
    })
  }
}



export async function POST(request: NextRequest) {
  try {
    const {chatTitle} = await request.json()
    if(!chatTitle){
      return handleError({
        customErrorMessage:"chatTitle is required",
        statusCode:400
      })
    }
    const { data, error } = await supabase.rpc('create_chat', {
      user_id_input: USER_ID,
      chat_title_input: chatTitle,
  });

  if(error){
    throw error
  }

return NextResponse.json({chatId:data})

  } catch (error) {
    return handleError({
      customErrorMessage: "[CHAT_CREATION_ERROR]",
      error: error as Error,
    });
  }
}
