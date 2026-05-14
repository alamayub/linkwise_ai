/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { chatStream } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.message) {
        setInput(e.detail.message);
      }
    };

    window.addEventListener('open-linkwise-chat', handleOpenChat);
    return () => window.removeEventListener('open-linkwise-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Create history format for Gemini API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      let assistantMessage = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      const stream = chatStream(userMessage, history);
      for await (const chunk of stream) {
        assistantMessage += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantMessage;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[440px] max-w-[calc(100vw-32px)] h-[700px] max-h-[calc(100vh-140px)] bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-white/10 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-900 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-[80px] rounded-full -mr-16 -mt-16" />
              <div className="flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Bot size={26} className="text-brand-light" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg tracking-tight">Intelligence Node</h3>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Synchronized
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-3 rounded-2xl transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-slate-50/50 dark:bg-slate-900/30">
              {messages.length === 0 && (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 bg-brand/5 text-brand rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-brand/10">
                    <MessageSquare size={36} />
                  </div>
                  <h4 className="text-xl font-display font-black mb-3 dark:text-white">Awaiting Commands</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">
                    Ask me about business extraction, market position, or strategic improvements.
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 border-slate-800 text-white' 
                      : 'bg-white dark:bg-slate-800 text-brand border-slate-100 dark:border-white/5'
                  }`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`p-5 rounded-[32px] max-w-[85%] text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none font-medium'
                  }`}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 text-brand rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5">
                    <Bot size={18} />
                  </div>
                  <div className="p-5 rounded-[32px] rounded-tl-none bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-brand" />
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Processing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire about entity x..."
                  className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand dark:text-white dark:placeholder-slate-500 outline-none transition-all"
                  id="chat-input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-14 h-14 bg-brand text-white rounded-[22px] flex items-center justify-center hover:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand/20 active:scale-95"
                  id="send-message"
                >
                  <Send size={24} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[22px] flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-slate-950 text-white rotate-90' : 'bg-brand text-white shadow-brand/20'
        }`}
        id="toggle-chat"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
}
