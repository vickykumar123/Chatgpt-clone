"use client";
import {getUserChatList} from "@/lib/query/getUserChatList";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {
  AiOutlineMessage,
  AiOutlinePlus,
  AiOutlineUser,
  AiOutlineSetting,
} from "react-icons/ai";
import {BiLinkExternal} from "react-icons/bi";
import {FiMessageSquare} from "react-icons/fi";
import {MdLogout} from "react-icons/md";

const Sidebar = () => {
  const [chatList, setChatList] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getChatList() {
      try {
        setIsLoading(true);
        const list = await getUserChatList();
        setChatList(list);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getChatList();
  }, []);

  return (
    <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
      <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-1 flex-shrink-0 border border-white/20">
          <AiOutlinePlus className="h-4 w-4" />
          New chat
        </a>
        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
          {!isLoading &&
            chatList?.length! > 0 &&
            chatList?.map((chat) => (
              <div
                className="flex flex-col gap-2 pb-2 text-gray-100 text-sm"
                key={chat.id}
              >
                <Link
                  href={chat.id}
                  className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group"
                >
                  <FiMessageSquare className="h-4 w-4" />
                  <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                    {chat.title}
                    <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <AiOutlineMessage className="h-4 w-4" />
          Clear conversations
        </a>
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <AiOutlineUser className="h-4 w-4" />
          My plan
        </a>
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <AiOutlineSetting className="h-4 w-4" />
          Settings
        </a>
        <a
          href="#"
          target="_blank"
          className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
        >
          <BiLinkExternal className="h-4 w-4" />
          Get help
        </a>
        <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
          <MdLogout className="h-4 w-4" />
          Log out
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
