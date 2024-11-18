import {NextRequest, NextResponse} from "next/server";
import {handleError} from "@/lib/apiErrorHandler";
import { createChat } from "@/lib/functions/chats/createChat";
import { getChatsByUser } from "@/lib/functions/chats/getChatsByUser";


export async function GET(){
  try {
    const data = await getChatsByUser()
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
   const data = createChat(chatTitle)
return NextResponse.json({chatId:data})

  } catch (error) {
    return handleError({
      customErrorMessage: "[CHAT_CREATION_ERROR]",
      error: error as Error,
    });
  }
}
