import { API_URL } from "@/contants";

export async function createChat() {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({chatTitle: `New Chat ${Date.now()}`}),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new chat");
      }

      const data = await response.json();
      return data
}