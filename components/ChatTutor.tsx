import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from "@google/genai";

const ChatTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'أهلاً بك! أنا زيكو 🤖، خبير Ethereum الخاص بك. اسألني أي شيء عن الخصوصية، التعدين، أو كيف تعمل المحفظة!',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSession.current = createChatSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatSession.current, userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-eth-card rounded-xl border border-gray-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center gap-3">
        <div className="bg-eth p-2 rounded-full">
          <Bot className="text-black w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white">المعلم الذكي (زيكو)</h3>
          <p className="text-xs text-gray-400">مدعوم بواسطة Gemini AI</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-eth'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-black" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-700 text-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="flex flex-row-reverse items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-eth flex items-center justify-center">
                <Bot size={16} className="text-black" />
              </div>
              <div className="bg-gray-700 p-3 rounded-2xl rounded-tl-none">
                <Loader2 className="animate-spin text-eth" size={20} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل عن Ethereum، التعدين، أو الخصوصية..."
            className="flex-1 bg-gray-900 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-eth focus:ring-1 focus:ring-eth transition placeholder-gray-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-eth hover:bg-eth-dark disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold p-3 rounded-lg transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTutor;
