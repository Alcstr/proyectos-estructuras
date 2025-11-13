import React, { useState } from "react";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

export const ChatbotPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Hola, soy el asistente EmoAI 😊 Estoy aquí para escucharte. ¿Cómo te sientes hoy?",
    },
  ]);
  const [input, setInput] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      from: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Respuesta simulada: más adelante aquí llamaremos a la API de IA
    const botMessage: Message = {
      id: Date.now() + 1,
      from: "bot",
      text:
        "Gracias por compartir eso. Recuerda que es válido sentirte así. " +
        "¿Te gustaría que hagamos un ejercicio de respiración o que te dé algunas recomendaciones?",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 400);

    setInput("");
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 flex flex-col h-[360px]">
      <h2 className="text-lg font-semibold mb-2">Chatbot terapéutico</h2>
      <p className="text-xs text-slate-300 mb-3">
        Conversación privada y confidencial. En la versión completa, este chatbot usará IA avanzada
        para darte respuestas más personalizadas.
      </p>

      <div
        className="flex-1 overflow-y-auto space-y-2 pr-1"
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
          className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-4 py-2"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};
