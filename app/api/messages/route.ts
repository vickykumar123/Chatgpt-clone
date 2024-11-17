import { USER_ID } from "@/contants";
import supabase from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = USER_ID;
    const chatId = searchParams.get("chatId");

    if (!userId || !chatId) {
        return NextResponse.json(
            { error: "Missing required parameters: userId or chatId" },
            { status: 400 }
        );
    }

    try {
        const { data, error } = await supabase.rpc("get_messages_by_chat", {
            user_id_input: userId,
            chat_id_input: chatId,
        });

        if (error) {
            console.error("Error fetching messages:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ messages: data });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { messages, chatId } = await request.json();

    // Return early if no messages
    if (!messages || messages.length === 0) {
        return NextResponse.json({ message: "No messages to process" });
    }

    // Sort messages by `createdAt` to ensure order
    const sortedMessages = messages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Process the latest message
    const latestMessage = sortedMessages[sortedMessages.length - 1];
    const parentMessage = sortedMessages.length > 1 ? sortedMessages[sortedMessages.length - 2] : null;


    try {
        // Check if the message already exists
        const { data: existingMessage, error: fetchError } = await supabase
            .from("messages")
            .select("id")
            .eq("messageid", latestMessage.id)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Error fetching existing message:", fetchError);
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        if (existingMessage) {
            // Update message content if it already exists
            const { error: updateError } = await supabase.rpc("update_message_content", {
                message_id: latestMessage.id,
                new_content: latestMessage.content,
                created_at_input: latestMessage.createdAt || null,
            });

            if (updateError) {
                console.error("Error updating message:", updateError);
                return NextResponse.json({ error: updateError.message }, { status: 500 });
            }

            return NextResponse.json({ message: "Message updated successfully" });
        } else {
            // Insert new message
            const { error: insertError } = await supabase.rpc("create_message", {
                message_id_input: latestMessage.messageid || latestMessage.id,
                user_id_input: USER_ID,
                chat_id_input: chatId,  // Pass chat_id_input here
                message_content_input: latestMessage.content,
                parent_message_id_input: parentMessage ? parentMessage.id : null,
                created_at_input: latestMessage.createdAt || null,
                role_input: latestMessage.role
            });

            if (insertError) {
                console.error("Error creating message:", insertError);
                return NextResponse.json({ error: insertError.message }, { status: 500 });
            }

            return NextResponse.json({ message: "Message created successfully" });
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Unexpected error occurred" }, { status: 500 });
    }
}
