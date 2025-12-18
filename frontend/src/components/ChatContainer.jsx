import React, { useEffect } from "react";
import { useChatStore } from "../store/useChat.store.js";
import { useAuthStore } from "../store/useAuth.store.js";
import ChatHeader from "./ChatHeader.jsx";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceHolder.jsx";

function ChatContainer() {
  const { messages, getMessagesByUserId, selectedUser } = useChatStore();
  const {authUser} = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {messages.length > 0 ? (
          <p>some message</p>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullname} />
        )}
      </div>
    </>
  );
}

export default ChatContainer;
