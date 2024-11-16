import {useEffect, useRef, useState} from "react";
import {SiOpenai} from "react-icons/si";
import {HiUser} from "react-icons/hi";
import {BiEdit, BiSave} from "react-icons/bi";
import {Message as MessageType} from "ai";

interface MessageProps {
  message: MessageType;
  onUpdate: (id: string, newContent: string) => void;
}

const Message = ({message, onUpdate}: MessageProps) => {
  const {role, content: text, id} = message;
  const isUser = role === "user";

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const editRef = useRef<HTMLDivElement>(null);
  const handleSave = () => {
    onUpdate(id, editText);
    setIsEditing(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (editRef.current && !editRef.current.contains(event.target as Node)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${
        isUser ? "dark:bg-gray-800" : "bg-gray-50 dark:bg-[#444654]"
      }`}
      ref={editRef}
    >
      <div className="flex items-center p-4 gap-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/75 text-white">
          {isUser ? <HiUser /> : <SiOpenai />}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              className="w-full p-2 border rounded-md text-black"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <p>{text}</p>
          )}
        </div>
        {isUser && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <button onClick={handleSave}>
                <BiSave className="text-green-500" />
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <BiEdit className="text-gray-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
