import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Smile, Paperclip, Mic, Send, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const ChatFooter = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  const socketRef = useRef(
    io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    })
  );

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // LOAD USER + TOKEN ON MOUNT
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  // LISTEN FOR INCOMING MESSAGES ONCE
  useEffect(() => {
    socketRef.current.on("server-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.off("server-message");
    };
  }, []);

  // SEND MESSAGE
  const handleSend = () => {
    if (!token || !user) {
      toast.error("You must be logged in to send messages");
      navigate("/sign-in");
      return;
    }

    if (!message.trim()) return;

    socketRef.current.emit("server-message", message);
    setMessage("");
  };

  // EMOJI HANDLER
  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    textareaRef.current.focus();
  };

  return (
    <div className="w-full bg-zinc-800 border-t border-gray-700 sticky bottom-0 z-10">
      {/* EMOJI PICKER */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-2 md:left-4 z-20">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            lazyLoadEmojis
            theme="dark"
          />
          <button
            className="absolute top-1 right-1 text-gray-400 hover:text-white"
            onClick={() => setShowEmojiPicker(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* INPUT AREA */}
      <div className="flex items-center gap-2 p-2">
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smile className="w-6 h-6" />
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          placeholder="Type a message"
          className="flex-1 resize-none bg-zinc-700 rounded-full px-4 py-2 
                     text-white outline-none placeholder-gray-400 max-h-40 overflow-y-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button className="text-gray-400 hover:text-white">
          <Paperclip className="w-6 h-6" />
        </button>

        {message.trim() === "" ? (
          <button className="text-gray-400 hover:text-white">
            <Mic className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            className="text-gray-400 hover:text-white"
          >
            <Send className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatFooter;
