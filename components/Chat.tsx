import {useEffect, useRef} from "react";
import {FiSend} from "react-icons/fi";
import {useChat} from "ai/react";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import Message from "./Message";
import {API_URL} from "@/contants";
import {useParams} from "next/navigation";

const initialMessages = [
  {
    id: "86dd4992-042d-4fc4-aeb3-24a98fd6efbf",
    messageid: "C0iiuWz",
    content: "Hello",
    parentmessageid: null,
    createdat: "2024-11-17T03:04:57.739",
    role: "user",
  },
  {
    id: "24aa4e52-812a-4e87-bae0-6a00da329f95",
    messageid: "7NAQl2V",
    content: "Hello! How can I assist you today",
    parentmessageid: "C0iiuWz",
    createdat: "2024-11-17T03:05:00.906",
    role: "assistant",
  },
  {
    id: "1ca75caa-f781-4d17-88cc-737a947eb470",
    messageid: "z5rHfwm",
    content: "I am cool",
    parentmessageid: "7NAQl2V",
    createdat: "2024-11-17T03:05:18.367",
    role: "user",
  },
  {
    id: "9db098d3-33cc-446c-963b-df94de69db1c",
    messageid: "UeVFn0y",
    content:
      "I’m an AI language model created by OpenAI, designed to assist with a wide range of questions and topics. How can I help you today?",
    parentmessageid: "z5rHfwm",
    createdat: "2024-11-17T03:05:19.574",
    role: "assistant",
  },
  {
    id: "6ab9b839-14a0-4a0f-810c-f46f900b5c46",
    messageid: "5jnw5LQ",
    content: "That's great to hear! What makes you feel cool today?",
    parentmessageid: "z5rHfwm",
    createdat: "2024-11-17T03:05:48.973",
    role: "assistant",
  },
];

const Chat = () => {
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    reload,
  } = useChat({
    api: "/api/conversation",
    initialMessages,
  });
  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({behavior: "smooth"});
    }
    createMessage();
  }, [messages]);

  const createMessage = async () => {
    await fetch(`${API_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({messages, chatId: params.chatId}),
    });
  };

  const onUpdateMessage = async (id: string, newContent: string) => {
    // Update the message in the state
    setMessages((prevMessages) => {
      const updatedMessages = [];

      for (let msg of prevMessages) {
        if (msg.id === id) {
          // Update the message content
          updatedMessages.push({...msg, content: newContent});
          break;
        } else {
          // Otherwise, keep the message as is
          updatedMessages.push(msg);
        }
      }

      return updatedMessages;
    });
    reload();
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
      e.preventDefault();
    }
  };

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="h-full dark:bg-gray-800">
            <div>
              {messages.length > 0 && (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
                    Model: Dummy Model
                  </div>
                  {messages.map((message, index) => (
                    <Message
                      key={index}
                      message={message}
                      onUpdate={onUpdateMessage}
                    />
                  ))}
                  <div ref={bottomOfChatRef}></div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t dark:border-white/20 bg-white dark:bg-gray-800 pt-2">
          <form
            className="flex flex-row gap-3 last:mb-2 mx-2 md:mx-4"
            onSubmit={sendMessage}
          >
            <div className="relative flex flex-col h-full flex-1 items-stretch">
              {error && (
                <div className="mb-2">
                  <span className="text-red-500 text-sm">{error.message}</span>
                </div>
              )}
              <div className="flex flex-col w-full py-2 flex-grow relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow">
                <textarea
                  ref={textAreaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeypress}
                  placeholder="Send a message..."
                  className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 dark:bg-transparent pl-2"
                  style={{
                    height: "24px",
                    maxHeight: "200px",
                    overflowY: "hidden",
                  }}
                ></textarea>
                <button
                  disabled={isLoading || input.trim() === ""}
                  type="submit"
                  className="absolute p-1 rounded-md bottom-2 right-2 bg-transparent disabled:bg-gray-500"
                >
                  <FiSend className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
