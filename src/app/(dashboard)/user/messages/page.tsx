"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare,
  Search,
  MoreVertical,
  Send,
  Phone,
  Video,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversations, useChat, useSendMessage, MessageContact, ChatMessage } from "@/hooks/useStudentData";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { useAuth } from "@/lib/auth-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: session } = useAuth();
  const currentUserId = session?.user?.id;

  const { data: convoData, isLoading: convoLoading, isError: convoError, refetch: refetchConvos } = useConversations();
  const contacts: MessageContact[] = convoData?.data || [];

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const otherUserId = activeContact?.id || '';

  const { data: chatData } = useChat(otherUserId);
  const messages: ChatMessage[] = chatData?.data || [];

  const sendMessage = useSendMessage();

  // Set active contact to first one on load
  useEffect(() => {
    if (contacts.length > 0 && !activeContactId) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!messageInput.trim() || !otherUserId) return;
    sendMessage.mutate({ receiverId: otherUserId, content: messageInput });
    setMessageInput("");
  };

  if (convoLoading) return <Loading />;
  if (convoError) return <ErrorState onRetry={() => refetchConvos()} />;

  return (
    <div className="h-[calc(100vh-80px-64px)] flex flex-col animate-in fade-in duration-500">
      <PageHeader 
        title="Messages" 
        subtitle="Communicate with instructors and support."
      />

      <div className="saas-card p-0 flex-1 flex overflow-hidden border">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r flex flex-col bg-muted/10 shrink-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 h-10 rounded-[0.625rem] bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold">No conversations yet.</p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className={`w-full text-left p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b last:border-0 ${
                    activeContact?.id === contact.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={contact.image} />
                      <AvatarFallback className="font-bold">{contact.name?.split(' ').map(n => n[0]).join('') || '?'}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="text-sm font-bold truncate pr-2">{contact.name}</p>
                      {contact.lastMessage && (
                        <p className="text-[10px] text-muted-foreground font-medium shrink-0">
                          {new Date(contact.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">{contact.lastMessage?.content || 'No messages yet'}</p>
                      {contact.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-background">
          {!activeContact ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="font-bold text-lg">Select a conversation</p>
                <p className="text-sm text-muted-foreground mt-1">Choose from your contacts to start messaging.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center bg-muted/5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={activeContact.image} />
                    <AvatarFallback className="font-bold">{activeContact.name?.split(' ').map(n => n[0]).join('') || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-bold text-sm">{activeContact.name}</h2>
                    <p className="text-xs text-muted-foreground font-medium capitalize">{activeContact.role?.toLowerCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.5rem] text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.5rem] text-muted-foreground">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[0.5rem] text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm py-12">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex flex-col gap-2 max-w-[80%] ${isMine ? 'items-end self-end ml-auto' : 'items-start'}`}>
                        <div className={`p-3 rounded-[0.625rem] text-sm font-medium ${
                          isMine 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t bg-muted/5">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-[0.5rem] shrink-0 text-muted-foreground hover:bg-muted">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input 
                    placeholder="Type your message..." 
                    className="h-12 rounded-[0.625rem] bg-background shadow-sm flex-1"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && messageInput.trim()) {
                        handleSend();
                      }
                    }}
                  />
                  <Button 
                    className="h-12 w-12 rounded-[0.625rem] shrink-0 font-bold"
                    onClick={handleSend}
                    disabled={!messageInput.trim() || sendMessage.isPending}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
