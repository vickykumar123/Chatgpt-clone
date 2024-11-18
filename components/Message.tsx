import {useEffect, useRef, useState} from "react";
import {SiOpenai} from "react-icons/si";
import {HiUser} from "react-icons/hi";
import {BiEdit, BiSave} from "react-icons/bi";

interface MessageProps {
  message: any;
  onUpdate?: (id: string, newContent: string) => void; // Update function
}

const Message = ({message, onUpdate}: MessageProps) => {
  const {role, content, id, children = []} = message; // Default children to an empty array
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const [currentChildIndex, setCurrentChildIndex] = useState(0); // Track navigation within children
  const editRef = useRef<HTMLDivElement>(null);
  const isUser = role === "user";

  console.log(children);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(id, editText); // Call the onUpdate function to update the message
    }
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

  const handlePrevious = () => {
    setCurrentChildIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentChildIndex((prevIndex) =>
      Math.min(children.length - 1, prevIndex + 1)
    );
  };

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
            <p>{content}</p>
          )}
        </div>
        {children.length > 1 && (
          <div className="flex justify-between mt-2 space-x-2">
            <button
              onClick={handlePrevious}
              disabled={currentChildIndex === 0}
              className={`px-3 py-1 rounded ${
                currentChildIndex === 0
                  ? "bg-gray-300 text-gray-600"
                  : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentChildIndex === children.length - 1}
              className={`px-3 py-1 rounded ${
                currentChildIndex === children.length - 1
                  ? "bg-gray-300 text-gray-600"
                  : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
        {isUser && (
          <div>
            {isEditing ? (
              <button onClick={handleSave}>
                <BiSave />
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}>
                <BiEdit />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recursive child rendering */}
      {children.length > 0 && (
        <div className="" key={message.id}>
          <Message
            message={children[currentChildIndex]}
            onUpdate={onUpdate} // Pass the update handler to the child
          />
          {/* Show navigation only if there are more than 1 child messages */}
        </div>
      )}
    </div>
  );
};

export default Message;
