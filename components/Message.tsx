import {SiOpenai} from "react-icons/si";
import {HiUser} from "react-icons/hi";
import {BiEdit, BiSave} from "react-icons/bi";
import {useEditableMessage} from "@/hooks/useEditableMessage"; // Import the custom hook
import {useState} from "react";

interface MessageProps {
  message: any;
  onUpdate?: (id: string, newContent: string) => void;
}

const Message = ({message, onUpdate}: MessageProps) => {
  const {role, content, id, children = []} = message; // Default children to an empty array
  const isUser = role === "user";

  const {isEditing, editText, editRef, setEditText, setIsEditing, handleSave} =
    useEditableMessage({content, id, onUpdate});

  const [currentChildIndex, setCurrentChildIndex] = useState(0);

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
            {currentChildIndex + 1} / {children.length}
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
        </div>
      )}
    </div>
  );
};

export default Message;
