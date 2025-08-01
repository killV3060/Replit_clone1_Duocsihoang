import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import MessageBubble from "./MessageBubble";
import LoadingMessage from "./LoadingMessage";
import { useToast } from "@/hooks/use-toast";

interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch chat history
  const { data: chatHistory, isLoading } = useQuery<{ messages: Message[] }>({
    queryKey: ["/api/chat", sessionId],
    enabled: !!sessionId,
  });

  const messages = chatHistory?.messages || [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent: string): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat", {
        message: messageContent,
        sessionId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", sessionId] });
      setMessage("");
      scrollToBottom();
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể gửi tin nhắn",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage || trimmedMessage.length > 500) {
      return;
    }

    sendMessageMutation.mutate(trimmedMessage);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);
    
    // Auto-resize
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào clipboard",
    });
  };

  const insertQuickMessage = (quickMessage: string) => {
    setMessage(quickMessage);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-medical-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
      {/* Chat Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-medical-blue to-trust-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Chào mừng đến với Dược Sĩ Hoàng</h2>
            <p className="text-slate-600 max-w-md mx-auto">Tôi là Hoàng, trợ lý AI thông minh có thể giúp bạn trả lời mọi câu hỏi về bất kỳ lĩnh vực nào!</p>
            
            <div className="mt-6 space-y-2">
              <p className="text-sm font-medium text-slate-700">Tôi có thể giúp bạn:</p>
              <ul className="space-y-1 text-slate-600 text-sm">
                <li className="flex items-center justify-center space-x-2">
                  <i className="fas fa-check text-healthcare-green text-xs"></i>
                  <span>Trả lời mọi câu hỏi kiến thức</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <i className="fas fa-check text-healthcare-green text-xs"></i>
                  <span>Giải thích và phân tích vấn đề</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <i className="fas fa-check text-healthcare-green text-xs"></i>
                  <span>Tư vấn và đưa ra gợi ý</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <i className="fas fa-check text-healthcare-green text-xs"></i>
                  <span>Hỗ trợ học tập và nghiên cứu</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg: Message) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onCopy={() => handleCopyMessage(msg.content)}
          />
        ))}

        {/* Loading Message */}
        {sendMessageMutation.isPending && <LoadingMessage />}
      </div>

      {/* Chat Input Area */}
      <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="mb-4 hidden sm:flex flex-wrap gap-2">
            <button 
              onClick={() => insertQuickMessage("Giải thích cho tôi về lịch sử Việt Nam")}
              className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
            >
              <i className="fas fa-book mr-1"></i>
              Lịch sử
            </button>
            <button 
              onClick={() => insertQuickMessage("Hướng dẫn học lập trình Python")}
              className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
            >
              <i className="fas fa-code mr-1"></i>
              Lập trình
            </button>
            <button 
              onClick={() => insertQuickMessage("Tư vấn về kinh doanh và khởi nghiệp")}
              className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
            >
              <i className="fas fa-briefcase mr-1"></i>
              Kinh doanh
            </button>
          </div>

          {/* Main Input Area */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Hỏi tôi bất kỳ điều gì bạn muốn biết..."
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 pr-12 focus:border-medical-blue focus:ring-2 focus:ring-medical-blue/20 focus:outline-none text-slate-800 placeholder-slate-500 max-h-32 overflow-y-auto"
                  disabled={sendMessageMutation.isPending}
                />
                
                {/* Character limit indicator */}
                <div className={`absolute bottom-2 right-12 text-xs ${
                  message.length > 450 ? 'text-red-500' : 'text-slate-400'
                }`}>
                  {message.length}/500
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={!message.trim() || message.length > 500 || sendMessageMutation.isPending}
                className="bg-medical-blue hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl px-6 py-3 transition-all duration-200 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md"
              >
                <i className="fas fa-paper-plane"></i>
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </div>
          </form>

          {/* Disclaimer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 max-w-2xl mx-auto">
              <i className="fas fa-info-circle mr-1"></i>
              Thông tin được cung cấp chỉ mang tính chất tham khảo. Luôn kiểm chứng thông tin từ các nguồn đáng tin cậy khi cần thiết.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
