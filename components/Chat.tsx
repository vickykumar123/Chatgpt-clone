import {useEffect, useRef, useState, useCallback} from "react";
import {FiSend} from "react-icons/fi";
import {useChat} from "ai/react";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import Message from "./Message";
import {API_URL} from "@/contants";
import {useParams} from "next/navigation";
import debounce from "lodash/debounce";

const Chat = () => {
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const [initialMessages, setInitialMessages] = useState([]);

  console.log(initialMessages);

  async function getMessages() {
    const response = await fetch(
      `${API_URL}/api/messages?chatId=${params.chatId}`
    );

    const data = await response.json();
    setInitialMessages(data.messages);
  }

  useEffect(() => {
    getMessages();
  }, []);

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

  // Debounced createMessage function
  const createMessage = useCallback(
    debounce(async () => {
      console.log(messages);
      await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({messages, chatId: params.chatId}),
      });
    }, 500),
    [messages, params.chatId]
  );

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({behavior: "smooth"});
    }
    createMessage();
  }, [messages, createMessage]);

  const onUpdateMessage = async (id: string, newContent: string) => {
    // Update the message in the state
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages]; // Create a copy of the array

      for (let i = 0; i < updatedMessages.length; i++) {
        if (updatedMessages[i].id === id) {
          updatedMessages[i] = {...updatedMessages[i], content: newContent};
          break; // Exit the loop after the update
        }
      }

      return updatedMessages; // Return the updated array
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
      <div className="relative h-full w-full transition-width flex flex-col items-stretch flex-1">
        <div className="flex-1 overflow-scroll">
          <div className="h-full dark:bg-gray-800">
            <div>
              {messages.length > 0 && (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
                    Model: Dummy Model
                  </div>
                  {messages.map((message) => (
                    <Message
                      key={message.id}
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
