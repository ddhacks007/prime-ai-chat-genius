import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Image, Video, Music, File } from "lucide-react";
import { cn } from "@/lib/utils";
import FileUpload, { UploadedFile } from "@/components/FileUpload";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  attachments?: UploadedFile[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm PrimeAI, your intelligent assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachedFiles([]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let responseContent = "I understand your message. As PrimeAI, I'm here to help you with any questions or tasks you have.";
      
      if (userMessage.attachments && userMessage.attachments.length > 0) {
        const fileTypes = userMessage.attachments.map(f => f.type);
        const uniqueTypes = [...new Set(fileTypes)];
        responseContent = `I can see you've shared ${userMessage.attachments.length} file${userMessage.attachments.length > 1 ? 's' : ''} with me (${uniqueTypes.join(', ')}). While I can see the files you've uploaded, I'm currently a demo version and can't process them yet. In a full implementation, I would be able to analyze images, transcribe audio, and understand video content. What would you like to know about these files?`;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-3 h-3" />;
      case 'video':
        return <Video className="w-3 h-3" />;
      case 'audio':
        return <Music className="w-3 h-3" />;
      default:
        return <File className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PrimeAI
            </h1>
            <p className="text-sm text-muted-foreground">
              Your intelligent assistant
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.isUser ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.isUser 
                  ? "bg-chat-user-bubble shadow-glow" 
                  : "bg-chat-ai-bubble border border-border"
              )}>
                {message.isUser ? (
                  <User className="w-4 h-4 text-chat-user-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-chat-ai-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl",
                  message.isUser
                    ? "bg-chat-user-bubble text-chat-user-foreground rounded-br-md"
                    : "bg-chat-ai-bubble text-chat-ai-foreground border border-border rounded-bl-md"
                )}
              >
                {message.content && (
                  <p className="text-sm leading-relaxed mb-2">{message.content}</p>
                )}
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="space-y-2">
                    {message.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="bg-background/50 rounded-lg p-2 border border-border/50"
                      >
                        {attachment.type === 'image' && attachment.preview ? (
                          <div className="max-w-[300px]">
                            <img
                              src={attachment.preview}
                              alt={attachment.file.name}
                              className="w-full h-auto rounded-md max-h-[200px] object-cover"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {attachment.file.name}
                            </p>
                          </div>
                        ) : attachment.type === 'video' && attachment.preview ? (
                          <div className="max-w-[300px]">
                            <video
                              src={attachment.preview}
                              controls
                              className="w-full h-auto rounded-md max-h-[200px]"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {attachment.file.name}
                            </p>
                          </div>
                        ) : attachment.type === 'audio' ? (
                          <div className="flex items-center gap-2 max-w-[300px]">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              {getFileIcon(attachment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {attachment.file.name}
                              </p>
                              <audio
                                src={URL.createObjectURL(attachment.file)}
                                controls
                                className="w-full mt-1"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 max-w-[300px]">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              {getFileIcon(attachment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {attachment.file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-chat-ai-bubble border border-border flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-chat-ai-foreground" />
              </div>
              <div className="bg-chat-ai-bubble text-chat-ai-foreground px-4 py-3 rounded-2xl rounded-bl-md border border-border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-gradient-glow">
        <div className="max-w-4xl mx-auto">
          {/* File Upload */}
          <FileUpload
            files={attachedFiles}
            onFilesChange={setAttachedFiles}
            disabled={isTyping}
          />
          
          <div className="flex gap-3 items-end mt-2">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="min-h-[50px] bg-chat-input border-border focus:ring-primary resize-none"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
              className="h-[50px] px-6 bg-gradient-primary hover:opacity-90 shadow-glow transition-all duration-300"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;