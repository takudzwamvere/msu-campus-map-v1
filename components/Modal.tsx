"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border border-white/10 max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 rounded-2xl">
        <div className="px-6 py-4 flex items-end justify-end border-b border-white/5">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="px-6 py-4 bg-[#27272a]/50 border-t border-white/5 flex justify-center">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold tracking-wide rounded-lg transition-all shadow-lg active:scale-95"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
