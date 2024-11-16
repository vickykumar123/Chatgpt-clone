"use client";
import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import {useParams} from "next/navigation";
import {useState} from "react";

export default function ConversationPage() {
  const params = useParams();
  return <Chat />;
}