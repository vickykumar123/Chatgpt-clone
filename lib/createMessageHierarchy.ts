import { Message } from "@/types/message";
import { SetStateAction } from "react";

export const createMessageHierarchy = (messages:Message[],setStructuredMessages: (value: SetStateAction<never[]>) => void ) => {
    const messageMap: any = {};
    const roots: any = [];

    messages.forEach((msg) => {
      messageMap[msg.id] = {...msg, children: []};
    });

    messages.forEach((msg: any) => {
      if (msg.parentId) {
        messageMap[msg.parentId]?.children.push(messageMap[msg.id]);
      } else {
        roots.push(messageMap[msg.id]);
      }
    });

    setStructuredMessages(roots);
  };