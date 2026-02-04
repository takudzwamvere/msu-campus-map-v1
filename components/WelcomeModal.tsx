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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-800 animate-in fade-in zoom-in duration-300">
        
        {/* Header decoration */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
               <h2 className="text-2xl font-bold text-white mb-2">Welcome to MSU Map</h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                 Explore the Gweru campus interactively. Here is a quick guide to the building color codes used on the map.
               </p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
             <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Map Legend</div>
             <div className="grid grid-cols-1 gap-2">
               {CATEGORY_STYLES.map((cat) => (
                 <div key={cat.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${cat.styles.bg} ${cat.styles.color} flex items-center justify-center border border-white/10`}>
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={cat.styles.icon} />
                       </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-200">{cat.name}</div>
                      {/* Optional: Add example keywords if needed, e.g. "Hostels, Halls" */}
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            Start Exploring
          </button>
        </div>

        {/* Close button top right */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  );
}
