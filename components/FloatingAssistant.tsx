import React, { useState, useRef, useEffect } from "react";
import { getAssistantResponse } from "../services/geminiService";
import { ChatMessage } from "../types";

const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to AES. I can assist you with information regarding asbestos removal, soil remediation, and chemical decontamination. How can I help today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    const response = await getAssistantResponse(userMsg, messages);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response || "No response" },
    ]);
    setIsLoading(false);
<<<<<<< HEAD
=======

    // Envio automático para API Node.js
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: userMsg,
          assistant_response: response || "No response"
        })
      });
    } catch (err) {
      // Apenas log, não interrompe UX
      console.error("Erro ao salvar mensagem no banco:", err);
    }
>>>>>>> a900954 (feat: integração automática com NeonDB e API Node.js)
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-lg shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-aes-navy p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-aes-cyan w-10 h-10 rounded flex items-center justify-center text-sm font-black">
                  AES
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight uppercase">
                    Technical Assistant
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/60 tracking-widest uppercase">
                      Expert System
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-5 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded ${
                    msg.role === "user"
                      ? "bg-aes-cyan text-white shadow-lg shadow-aes-cyan/10"
                      : "bg-white border border-slate-200 text-slate-800"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded">
                  <div className="flex gap-1.5">
                    <div
                      className="w-1.5 h-1.5 bg-aes-cyan rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-aes-cyan rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-aes-cyan rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-slate-100 bg-white flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inquire about hazard types..."
              className="flex-grow bg-slate-100 border-none rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-aes-cyan"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-aes-navy text-white w-12 h-12 rounded flex items-center justify-center hover:bg-aes-cyan transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-4 px-6 py-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 ${isOpen ? "bg-aes-navy text-white" : "bg-aes-cyan text-white"}`}
      >
        <div className="flex flex-col items-start leading-none uppercase">
          <span className="text-[10px] tracking-[0.2em] font-black opacity-70 mb-1">
            Hazmat AI
          </span>
          <span className="font-bold text-xs">
            {isOpen ? "Close System" : "Open Assistant"}
          </span>
        </div>
        <div className="w-px h-6 bg-white/20" />
        <span className="text-xl">{isOpen ? "✕" : "💬"}</span>
      </button>
    </div>
  );
};

export default FloatingAssistant;
