import React, { useState } from "react";
import { sendMessageToBot } from "../services/api";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I’m your TransactPro AI Assistant!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageToBot(input);

      const botMessage = {
        sender: "bot",
        text: res.data.reply
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to fetch data. Please try again." }
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 25,
          right: 25,
          width: 65,
          height: 65,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          boxShadow: "0 8px 20px rgba(79, 70, 229, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "26px",
          color: "white",
          zIndex: 9999,
          transition: "transform 0.2s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 25,
            width: 340,
            height: 450,
            background: "#ffffff",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "white",
              padding: "12px 16px",
              fontWeight: "600",
              fontSize: 16
            }}
          >
            TransactPro AI Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: "auto",
              fontSize: 14,
              background: "#f9fafb"
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: 10
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 16,
                    maxWidth: "75%",
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                        : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "black"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{ fontStyle: "italic", fontSize: 12 }}>
                🤖 Thinking...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              padding: 10,
              borderTop: "1px solid #eee",
              background: "#fff"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your spending..."
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #ddd",
                outline: "none",
                marginRight: 8
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;