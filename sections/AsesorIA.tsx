
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { createChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import Spinner from '../components/Spinner';

const AsesorIA: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(createChat());
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chat || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Lo siento, no pude procesar tu pregunta en este momento.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">Asesor Experto IA</h1>
        <p className="text-gray-400">Pregúntale a Johana (IA) cualquier duda sobre tatuajes.</p>
      </div>

      <div className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Inicia la conversación. Pregunta sobre cuidados, diseños, dolor, etc.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-800'}`}>
                  <p style={{whiteSpace: 'pre-wrap'}}>{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="max-w-md p-3 rounded-lg bg-gray-800">
                        <Spinner size="sm" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Escribe tu pregunta aquí..."
          className="flex-grow bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleSendMessage} disabled={loading || !userInput.trim()} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition disabled:bg-indigo-800 disabled:cursor-not-allowed">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default AsesorIA;
