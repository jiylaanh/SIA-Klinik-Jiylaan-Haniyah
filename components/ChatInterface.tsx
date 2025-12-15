import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, AlertCircle } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToAI } from '../services/geminiService';
import { SUGGESTED_PROMPTS } from '../constants';

interface ChatInterfaceProps {
  initialInput?: { text: string; timestamp: number } | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialInput }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Selamat datang di Sistem Informasi Akuntansi Klinik. Saya adalah mesin AI inti yang siap membantu Anda dalam validasi transaksi, penjurnalan, dan pelaporan keuangan sesuai standar PSAK. Silakan masukkan data transaksi atau pertanyaan akuntansi Anda.",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle incoming initial input (e.g., from "Entri Baru" shortcut)
  useEffect(() => {
    if (initialInput) {
      setInputText(initialInput.text);
      // Small delay to ensure view transition is complete before focusing
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(initialInput.text.length, initialInput.text.length);
        }
      }, 100);
    }
  }, [initialInput]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const streamResult = await sendMessageToAI(text);
      
      const responseMessageId = (Date.now() + 1).toString();
      
      // Initialize empty bot message
      setMessages((prev) => [
        ...prev,
        {
          id: responseMessageId,
          role: 'model',
          text: '',
          timestamp: new Date(),
          isStreaming: true
        }
      ]);

      let fullText = '';
      
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === responseMessageId 
              ? { ...msg, text: fullText }
              : msg
          )
        );
      }
      
      // Finalize message
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === responseMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "Maaf, terjadi kesalahan sistem saat memproses permintaan Anda. Mohon periksa koneksi atau coba lagi.",
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Bot className="text-emerald-600" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">SIA Core Assistant</h2>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Online & Ready (PSAK Compliant)
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex gap-3 max-w-3xl ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-200' : 'bg-emerald-600'
                }`}
              >
                {msg.role === 'user' ? (
                  <User size={20} className="text-slate-600" />
                ) : (
                  <Bot size={20} className="text-white" />
                )}
              </div>

              <div
                className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-slate-800 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-mono text-xs md:text-sm'
                }`}
              >
                {msg.text}
                {msg.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse align-middle"></span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        {messages.length < 3 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-4 items-end max-w-5xl mx-auto">
           <button title="Lampirkan Dokumen" className="p-3 text-slate-400 hover:text-emerald-600 transition-colors">
              <FileText size={20} />
           </button>
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Jelaskan transaksi atau tanyakan prosedur akuntansi..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none min-h-[50px] max-h-[150px]"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 text-[10px] text-slate-400 bg-white px-1 rounded">
                AI Core
            </div>
          </div>
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading || !inputText.trim()}
            className={`p-3 rounded-xl transition-all ${
              isLoading || !inputText.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
             <AlertCircle size={10} />
             Validasi otomatis diaktifkan. Semua output AI harus diverifikasi sebelum posting buku besar.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;