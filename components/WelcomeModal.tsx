import { useState, useEffect } from "react";
import { CATEGORY_STYLES } from "../constants/campus-styles";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-[#18181b] shadow-2xl w-full max-w-[460px] relative border border-white/10 animate-in fade-in zoom-in duration-300 p-8 text-center">
        
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Welcome to MSU Map</h2>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[90%] mx-auto">
          Explore the campus interactively. Navigate through buildings, find lecture halls, and discover services.
        </p>

        {/* Summary Box */}
        <div className="bg-[#27272a] p-5 mb-8 text-left border border-white/5">
           <div className="text-sm text-gray-300 mb-4 font-medium">The <span className="text-cyan-400 font-bold">Category Index</span> shows building types:</div>
           
           {/* Color Bar Summary */}
           <div className="flex w-full h-4 mb-2">
              {CATEGORY_STYLES.map((cat, i) => (
                <div key={i} className={`h-full flex-1 ${cat.styles.fill || 'bg-gray-500'}`} title={cat.name} />
              ))}
           </div>
           
           <div className="flex justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wider">
               <span>{CATEGORY_STYLES[0].name}</span>
               <span>{CATEGORY_STYLES[CATEGORY_STYLES.length - 1].name}</span>
           </div>
        </div>

        <p className="text-gray-500 text-xs mb-6">
          Untoggle layers in <span className="text-cyan-400 font-bold cursor-default">Layers</span> to filter specific views.
        </p>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-[15px] font-bold transition-all shadow-lg active:scale-[0.98] tracking-wide"
        >
          Start Exploring
        </button>

      </div>
    </div>
  );
}
