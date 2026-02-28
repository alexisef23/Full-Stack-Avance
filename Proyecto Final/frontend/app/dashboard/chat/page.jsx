'use client';

import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/apiClient';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: '¡Hola! Soy tu entrenador de fitness con IA. Analiza tu historial y te doy feedback personalizado. ¿Cómo va tu entrenamiento? 💪',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Agregar mensaje del usuario
    setMessages((prev) => [...prev, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/chat/message', {
        message: input,
      });

      const aiMessage = response.data.data.aiMessage;
      setMessages((prev) => [...prev, { type: 'ai', text: aiMessage }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al comunicarse con la IA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4">
      <h1 className="text-4xl font-bold text-neon-purple mb-6">Chat de Entrenamiento</h1>

      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto bg-slate-900 rounded-lg p-4 mb-4 space-y-4 border border-slate-800">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-neon-blue text-black'
                  : 'bg-slate-800 text-slate-100 border border-neon-purple'
              }`}
            >
              <p className="text-sm md:text-base">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-neon-purple text-slate-100 px-4 py-3 rounded-lg">
              <p className="text-sm">Analizando tu historial...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="¿Cómo voy con mi progreso? 💪"
          className="flex-1 bg-slate-800 border-2 border-slate-700 rounded px-4 py-2 text-slate-100 focus:outline-none focus:border-neon-purple"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-secondary disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
