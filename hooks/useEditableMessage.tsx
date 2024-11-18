import {useState, useRef, useEffect} from "react";

interface UseEditableMessageProps {
  content: string;
  id: string;
  onUpdate?: (id: string, newContent: string) => void;
}

export const useEditableMessage = ({
  content,
  id,
  onUpdate,
}: UseEditableMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const editRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(id, editText);
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

  return {
    isEditing,
    editText,
    editRef,
    setEditText,
    setIsEditing,
    handleSave,
  };
};
