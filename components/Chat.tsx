import {useEffect, useRef, useState} from "react";
import {FiSend} from "react-icons/fi";
import {useChat} from "ai/react";
import useAutoResizeTextArea from "@/hooks/useAutoResizeTextArea";
import Message from "./Message";
import {useParams} from "next/navigation";
import {debounce} from "lodash";
import {createChatMessage, fetchChatMessages} from "@/lib/query/messages";
import {createMessageHierarchy} from "@/lib/createMessageHierarchy";

const Chat = () => {
  const textAreaRef = useAutoResizeTextArea();
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const [structuredMessages, setStructuredMessages] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    messages,
    reload,
  } = useChat({
    api: "/api/conversation",
    initialMessages: [],
    onFinish(message, options) {
      // Only fetch messages if new data is expected
      setTimeout(fetchMessages, 2000);
    },
  });

  const fetchMessages = async () => {
    try {
      const data = await fetchChatMessages(params.chatId as string);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const createMessage = debounce(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await createChatMessage(
        params.chatId as string,
        messages,
        abortController.signal
      );
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error in createMessage:", error);
      }
    }
  }, 500);

  useEffect(() => {
    const initialize = async () => {
      await fetchMessages();
      setIsFirstLoad(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      createMessageHierarchy(messages as any, setStructuredMessages);
    }
  }, [messages]);

  useEffect(() => {
    if (!isFirstLoad) {
      createMessage();
    }
    // Smooth scrolling debounced to avoid multiple triggers
    const scrollToBottom = debounce(() => {
      bottomOfChatRef.current?.scrollIntoView({behavior: "smooth"});
    }, 100);
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
      e.preventDefault();
    }
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

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="relative h-full w-full transition-width flex flex-col items-stretch flex-1">
        <div className="flex-1 overflow-scroll overflow-x-hidden">
          <div className="h-svh dark:bg-gray-800">
            <div>
              {structuredMessages.length > 0 && (
                <div className="flex flex-col items-center text-sm bg-gray-800">
                  <div className="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">
                    Model: Dummy Model
                  </div>
                  {structuredMessages.map((message: any) => (
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
        <div className="bottom-0 left-0 w-full border-t dark:border-white/20 bg-white dark:bg-gray-800 pt-2">
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
