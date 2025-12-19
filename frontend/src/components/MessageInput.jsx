import { useRef, useState } from "react";
import { useKeyboardSounds } from "../hooks/useKeyboardSounds.js";
import { useChatStore } from "../store/useChat.store.js";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSounds();
  const [text, setText] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const {sendMessage, isSoundEnabled} = useChatStore();

  return <div>MessageInput</div>;
}

export default MessageInput;
