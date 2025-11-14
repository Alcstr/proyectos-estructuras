import React, { useState } from "react";
import { sendChatMessage } from "./api";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

interface ChatbotPanelProps {
  token: string;
}

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ token }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Hola, soy el asistente EmoAI 😊 Estoy aquí para escucharte. ¿Cómo te sientes hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
    const userMessage: Message = {
      id: Date.now(),
      from: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const { reply } = await sendChatMessage(token, text);
      const botMessage: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: reply,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al contactar al chatbot");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 flex flex-col h-[420px]">
      <h2 className="text-lg font-semibold mb-2">Chatbot terapéutico</h2>
      <p className="text-xs text-slate-300 mb-3">
        Conversación privada y confidencial. Este chatbot está diseñado para acompañarte
        emocionalmente, no para sustituir ayuda profesional.
      </p>

      <div
        className="flex-1 overflow-y-auto space-y-2 pr-2 chat-scroll"
        aria-label="Historial de chat"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                msg.from === "user"
                  ? "bg-indigo-500 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-50 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-[11px] text-red-400 mt-1">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSend}
        className="mt-3 flex items-center gap-2"
        aria-label="Enviar mensaje al chatbot"
      >
        <input
          type="text"
          className="flex-1 rounded-full bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Escribe aquí cómo te sientes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 text-white text-xs font-medium px-4 py-2"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};
