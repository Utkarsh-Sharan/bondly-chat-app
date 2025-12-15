import React from "react";
import { useAuthStore } from "../store/useAuth.store.js";

function ChatPage() {
  const { logout } = useAuthStore();

  return (
    <>
      <div>ChatPage</div>

      <button onClick={logout} className="btn btn-primary z-10">
        Logout
      </button>
    </>
  );
}

export default ChatPage;
