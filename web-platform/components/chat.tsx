"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Send, ChefHat, User, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/interfaces/type";
import { getErrorMessage } from "@/lib/utils";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  

  const scrollContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    fetch("/api/chat")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data.slice(-20));
        }
      })
      .catch(err => console.error("Помилка завантаження історії:", err));
  }, []);

 
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userContent = input;
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", content: userContent }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ content: userContent }),
      });
      
      const data = await res.json();
      
      // Додаємо відповідь AI та оновлюємо локальний кеш
      setMessages(prev => [...prev, data].slice(-20));
    } catch (err) {
      console.error("Очищення чату:", getErrorMessage(err))
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm("Видалити всю історію переписки?")) return;
    try {
      await fetch("/api/chat", { method: "DELETE" });
      setMessages([]);
      } catch (err) {
      console.error(getErrorMessage(err))
      }
  };

  return (

    <div className="flex flex-col h-150 w-full max-w-2xl mx-auto border rounded-2xl bg-white shadow-xl overflow-hidden font-sans border-slate-200">
      

      <div className="flex-none p-4 border-b bg-slate-50/80 backdrop-blur-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <ChefHat className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Шеф V-Fridge</h3>
            <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> онлайн
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearHistory} 
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full"
          title="Очистити чат"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

  
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/30 scroll-smooth custom-scrollbar"
      >
        {messages.map((m, i) => {
          const isAI = m.role === "assistant" || m.role === "model";
          return (
            <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-3 max-w-[88%] ${isAI ? "flex-row" : "flex-row-reverse"}`}>
                <Avatar className="h-8 w-8 shrink-0 border shadow-sm">
                  <AvatarFallback className={isAI ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-600"}>
                    {isAI ? <ChefHat size={14} /> : <User size={14} />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col gap-1 ${isAI ? "items-start" : "items-end"}`}>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                    isAI 
                      ? "bg-white border-slate-100 rounded-tl-none text-slate-700" 
                      : "bg-orange-500 text-white border-orange-400 rounded-tr-none"
                  }`}>
                    <div className={`prose prose-sm max-w-none wrap-break-word ${isAI ? "text-slate-700" : "prose-invert text-white"}`}>
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-normal">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          strong: ({ children }) => (
                            <span className={`font-bold ${isAI ? "text-orange-600" : "text-white underline underline-offset-2 decoration-orange-300"}`}>
                              {children}
                            </span>
                          ),
                          li: ({ children }) => <li className="ml-1">{children}</li>
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex justify-start items-center gap-2 text-slate-400 text-xs animate-pulse">
            <div className="bg-white border border-slate-100 p-2 px-3 rounded-xl rounded-tl-none flex items-center gap-2 shadow-sm">
              <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
              <span className="font-medium">Шеф готує відповідь...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex-none p-4 bg-white border-t flex gap-2 shrink-0">
        <Input 
          className="rounded-xl border-slate-200 focus:ring-orange-500 h-11 transition-all placeholder:text-slate-400"
          placeholder="Спитайте рецепт або що приготувати..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="rounded-xl bg-orange-500 hover:bg-orange-600 h-11 w-11 p-0 shrink-0 transition-transform active:scale-95 shadow-md shadow-orange-200"
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </form>
    </div>
  );
}