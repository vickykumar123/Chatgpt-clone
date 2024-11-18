import { API_URL } from "@/contants";

export const fetchChatMessages = async (chatId: string) => {
  const response = await fetch(`${API_URL}/api/chat/${chatId}`);
  const data = await response.json();
  return data.messages;
};

export const createChatMessage = async (chatId: string, messages: any[], signal?: AbortSignal) => {
  await fetch(`${API_URL}/api/chat/${chatId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, messages }),
    signal,
  });
};
