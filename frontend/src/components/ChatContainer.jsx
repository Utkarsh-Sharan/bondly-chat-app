import React, { useEffect } from "react";
import { useChatStore } from "../store/useChat.store.js";
import { useAuthStore } from "../store/useAuth.store.js";
import ChatHeader from "./ChatHeader.jsx";

function ChatContainer() {
  const { messages, getMessagesByUserId, selectedUser } = useChatStore();
  const {authUser} = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatHeader />
    </>
  );
}

export default ChatContainer;
