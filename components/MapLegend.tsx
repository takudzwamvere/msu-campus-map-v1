"use client";

import { useState } from "react";
import { CATEGORY_STYLES } from "../constants/campus-styles";

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-28 right-4 z-[1000] flex flex-col items-end pointer-events-none">
      {/* Legend Panel */}
      <div 
        className={`bg-[#18181b]/95 backdrop-blur-md border border-white/10 p-4 min-w-[220px] text-white shadow-2xl rounded-none mb-4 transition-all duration-300 origin-bottom-right pointer-events-auto ${
            isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-90 translate-y-10 pointer-events-none absolute bottom-0 right-0"
        }`}
      >
         <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Index</h3>
            <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>

         <div className="space-y-3">
            {CATEGORY_STYLES.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3 group">
                {/* 
                    Using inline style or explicit classes. 
                    cat.styles.fill typically has "bg-indigo-500".
                    We want a light background container too. 
                    Let's use the 'bg' prop from styles if available, or derive it safely.
                    Actually, checking campus-styles.ts: styles has { color, bg, border, fill, icon }
                    color: text-indigo-600
                    bg: bg-indigo-100
                    fill: bg-indigo-500
                */}
                <div 
                    className={`w-7 h-7 rounded-sm flex items-center justify-center bg-white/5 relative`}
                    // We can apply specific colors via style if tailwind purge is an issue, 
                    // but since they are in constants file, they should be safe if that file is scanned.
                    // However, to be safe and "restore color", let's use the explicit props.
                >
                     <div className={`w-full h-full rounded-sm flex items-center justify-center opacity-20 ${cat.styles.fill} absolute inset-0`}></div>
                     <svg className={`w-3.5 h-3.5 relative ${cat.styles.color.replace('text-', 'text-')}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d={cat.styles.icon} />
                     </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors">{cat.name}</span>
                    <span className="text-[9px] text-gray-500 uppercase">{cat.keywords[0]}</span>
                </div>
            </div>
            ))}
         </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-none shadow-lg flex items-center justify-center transition-all duration-300 pointer-events-auto border border-white/10 ${
            isOpen 
            ? "bg-[#27272a] text-gray-400 rotate-90" 
            : "bg-[#18181b] text-white hover:bg-[#27272a] hover:scale-105"
        }`}
      >
        {isOpen ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
      </button>
    </div>
  );
}
