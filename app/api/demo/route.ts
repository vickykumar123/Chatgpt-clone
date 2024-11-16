import supabase from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(){
    const { data, error } = await supabase.rpc('create_chat', {
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        chat_title: 'New chat title',
    });
    
    if (error) {
        console.error('Error creating chat:', error);
    } else {
        console.log('New Chat ID:', data);
    }

    return NextResponse.json(data)
}