export default function LoadingMessage() {
  return (
    <div className="mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center flex-shrink-0">
          <i className="fas fa-robot text-white text-sm"></i>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-200 max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
              <span className="text-sm text-slate-500">Đang soạn câu trả lời...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
