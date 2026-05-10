"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Plus,
  Paperclip,
  History,
  MessageSquare,
  Search,
  Sparkles,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  useAIChat, 
  useAIConversations, 
  useAIConversation
} from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { cn } from "@/lib/utils";

export default function AITutorPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: convsData, isLoading: convsLoading } = useAIConversations();
  const { data: activeConvData, isLoading: activeConvLoading } = useAIConversation(activeConversationId || "");
  const chatMutation = useAIChat();

  const conversations = convsData?.data || [];

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
         scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, chatMutation.isPending]);

  // Sync messages when active conversation changes
  useEffect(() => {
    if (activeConvData?.data) {
      setMessages(activeConvData.data.messages);
      setSuggestedQuestions([]);
    } else if (!activeConversationId) {
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm your AI Mentor. I can help you understand complex concepts, debug your code, or plan your study schedule. What's on your mind today?",
        createdAt: new Date().toISOString()
      }]);
      setSuggestedQuestions([]);
    }
  }, [activeConvData, activeConversationId]);

  const handleSendMessage = async (msgOverride?: string) => {
    const text = msgOverride || input;
    if (!text.trim() || chatMutation.isPending) return;

    const userMsg = {
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    
    chatMutation.mutate({
      message: text,
      conversationId: activeConversationId || undefined
    }, {
      onSuccess: (response) => {
        if (!activeConversationId) {
          setActiveConversationId(response.data.conversationId);
        }
        
        const aiMsg = {
          role: 'assistant',
          content: response.data.answer,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
        setSuggestedQuestions(response.data.suggestedNextQuestions || []);
      },
      onError: () => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I apologize, but I encountered an error. Please try again or refresh the page.",
          createdAt: new Date().toISOString()
        }]);
      }
    });
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm your AI Mentor. What would you like to learn about today?",
      createdAt: new Date().toISOString()
    }]);
    setSuggestedQuestions([]);
  };

  return (
    <div className="h-[calc(100vh-80px-64px)] flex flex-col animate-in fade-in duration-500">
      <div className="flex-1 flex overflow-hidden lms-card overflow-hidden">
        {/* History Sidebar */}
        <aside className="w-80 border-r border-border bg-card flex flex-col hidden lg:flex">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
             <h2 className="text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                <History className="h-3.5 w-3.5" />
                Session History
             </h2>
             <Button variant="ghost" size="icon" onClick={startNewChat} className="h-8 w-8 hover:bg-primary/5 hover:text-primary transition-colors">
                <Plus className="h-4 w-4" />
             </Button>
          </div>
          <ScrollArea className="flex-1">
             <div className="p-3 space-y-1">
                {convsLoading ? (
                   <div className="p-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary/40" /></div>
                ) : conversations.map((conv) => (
                   <button
                     key={conv.id}
                     onClick={() => setActiveConversationId(conv.id)}
                     className={cn(
                       "w-full p-3 rounded-lg text-left transition-all text-xs group",
                       activeConversationId === conv.id ? "bg-primary/5 text-primary border border-primary/10 font-bold" : "text-muted-foreground hover:bg-muted"
                     )}
                   >
                      <div className="flex items-center gap-3">
                         <MessageSquare className="h-4 w-4 shrink-0 opacity-50" />
                         <span className="truncate">{conv.title || "Untitled Session"}</span>
                      </div>
                   </button>
                ))}
                {!convsLoading && conversations.length === 0 && (
                   <p className="text-[10px] text-muted-foreground text-center py-8 font-bold uppercase tracking-widest">No previous sessions</p>
                )}
             </div>
          </ScrollArea>
          <div className="p-4 border-t border-border bg-muted/20">
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                <Info className="h-3.5 w-3.5" />
                <span>AI may provide inaccuracies.</span>
             </div>
          </div>
        </aside>

        {/* Chat Main */}
        <main className="flex-1 flex flex-col relative bg-background">
          {/* Header */}
          <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card">
             <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                   <Bot className="h-5 w-5" />
                </div>
                <div>
                   <h1 className="text-sm font-bold">AI Mentor</h1>
                   <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none mt-1">Live Intelligence</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="font-bold text-[10px] uppercase tracking-widest h-8 px-3">Clear</Button>
                <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase tracking-widest h-8 px-3">Export</Button>
             </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-hidden relative">
             <ScrollArea className="h-full" ref={scrollRef}>
                <div className="max-w-3xl mx-auto p-6 space-y-8">
                   {messages.map((m, i) => (
                     <div key={i} className={cn("flex gap-4", m.role === 'user' ? 'flex-row-reverse' : '')}>
                        <div className={cn(
                           "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-border",
                           m.role === 'assistant' ? 'bg-primary/5 text-primary' : 'bg-muted text-muted-foreground'
                        )}>
                           {m.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <div className={cn("flex flex-col gap-1.5", m.role === 'user' ? 'items-end' : '')}>
                           <div className={cn(
                              "px-4 py-3 text-sm leading-relaxed lms-card shadow-sm border-border whitespace-pre-wrap",
                              m.role === 'user' 
                                ? 'bg-primary text-primary-foreground border-primary/10 rounded-2xl rounded-tr-none font-medium' 
                                : 'bg-card rounded-2xl rounded-tl-none font-medium text-foreground'
                           )}>
                              {m.content}
                           </div>
                           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                              {new Date(m.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                     </div>
                   ))}

                   {chatMutation.isPending && (
                     <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-border animate-pulse">
                           <Bot className="h-4 w-4" />
                        </div>
                        <div className="lms-card px-4 py-3 bg-card border-border flex items-center gap-3 rounded-2xl rounded-tl-none">
                           <Loader2 className="h-4 w-4 animate-spin text-primary/40" />
                           <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Thinking...</span>
                        </div>
                     </div>
                   )}

                   {suggestedQuestions.length > 0 && !chatMutation.isPending && (
                     <div className="flex flex-col gap-3 pt-4 ml-12">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                           <Sparkles className="h-3 w-3 text-primary" /> Recommended Follow-ups
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {suggestedQuestions.map((q) => (
                             <button 
                               key={q} 
                               className="px-4 py-2 rounded-lg text-xs font-semibold bg-muted border border-border hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                               onClick={() => handleSendMessage(q)}
                             >
                               {q}
                             </button>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
             </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-border bg-card">
             <div className="max-w-3xl mx-auto flex items-end gap-3">
                <div className="flex-1 bg-muted/30 border border-border rounded-xl p-1.5 focus-within:border-primary/40 transition-all flex items-end">
                   <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground hover:text-primary rounded-lg">
                      <Paperclip className="h-4.5 w-4.5" />
                   </Button>
                   <textarea 
                     rows={1}
                     placeholder="Message your AI mentor..." 
                     className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2.5 text-sm font-medium resize-none max-h-40 min-h-[44px]"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSendMessage();
                       }
                     }}
                   />
                </div>
                <Button 
                   onClick={() => handleSendMessage()}
                   disabled={!input.trim() || chatMutation.isPending}
                   className="h-11 w-11 p-0 rounded-xl shrink-0 shadow-lg shadow-primary/10"
                >
                   {chatMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}
