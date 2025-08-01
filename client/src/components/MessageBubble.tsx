import { Message } from "@shared/schema";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
  onCopy?: () => void;
  onLike?: () => void;
}

export default function MessageBubble({ message, onCopy, onLike }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const timestamp = format(new Date(message.timestamp), "HH:mm", { locale: vi });

  if (isUser) {
    return (
      <div className="mb-6">
        <div className="flex items-start space-x-3 justify-end">
          <div className="flex-1">
            <div className="bg-medical-blue rounded-2xl rounded-tr-md px-4 py-3 shadow-sm max-w-3xl ml-auto">
              <p className="text-white leading-relaxed">{message.content}</p>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center space-x-2">
                <i className="fas fa-check text-healthcare-green text-xs"></i>
                <span className="text-xs text-slate-500">Đã gửi</span>
              </div>
              <span className="text-xs text-slate-500">{timestamp}</span>
            </div>
          </div>
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-user text-slate-600 text-sm"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center flex-shrink-0">
          <i className="fas fa-robot text-white text-sm"></i>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-200 max-w-3xl">
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-slate-800 leading-relaxed mb-2 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-slate-500">{timestamp}</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onCopy}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                title="Sao chép"
              >
                <i className="fas fa-copy text-xs"></i>
              </button>
              <button 
                onClick={onLike}
                className="text-slate-400 hover:text-healthcare-green transition-colors p-1"
                title="Hữu ích"
              >
                <i className="fas fa-thumbs-up text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
