import {useEffect, useRef, useState} from "react";
import {SiOpenai} from "react-icons/si";
import {HiUser} from "react-icons/hi";
import {BiEdit, BiSave} from "react-icons/bi";

interface MessageProps {
  message: any;
  onUpdate: (id: string, newContent: string) => void;
}

const Message = ({message, onUpdate}: MessageProps) => {
  const {role, content, id, children, childLength} = message;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  const editRef = useRef<HTMLDivElement>(null);
  const isUser = role === "user";

  const handleSave = () => {
    onUpdate(id, editText); // call onUpdate from parent to save
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
      Math.min(childLength - 1, prevIndex + 1)
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
          {childLength > 1 && (
            <div className="mt-2 flex gap-2">
              <button
                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded"
                onClick={handlePrevious}
                disabled={currentChildIndex === 0}
              >
                Previous child
              </button>
              <button
                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded"
                onClick={handleNext}
                disabled={currentChildIndex === childLength - 1}
              >
                Next child
              </button>
            </div>
          )}
        </div>
        {isUser && (
          <div>
            {isEditing && isUser ? (
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
      {childLength > 0 && children[currentChildIndex] && (
        <Message message={children[currentChildIndex]} onUpdate={onUpdate} />
      )}
    </div>
  );
};

export default Message;
