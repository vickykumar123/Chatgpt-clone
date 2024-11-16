import {NextRequest} from "next/server";
import {openai} from "@ai-sdk/openai";
import {CoreMessage, streamText} from "ai";
import {handleError} from "@/lib/apiErrorHandler";

interface Messages {
  messages: CoreMessage[];
}

const chatModel = process.env.OPENAI_CHAT_MODEL;
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    if (!chatModel) {
      throw new Error("Chat model is not configured");
    }
    
    const {messages}: Messages = await request.json();
    console.log(messages)
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid 'messages' format or missing");
    }


    const result = await streamText({
      model: openai(chatModel),
      messages: messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return handleError({
      customErrorMessage: "[CHATBOT_ERROR]",
      error: error as Error,
    });
  }
}
