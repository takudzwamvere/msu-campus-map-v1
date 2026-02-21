"use client";

import { useState } from "react";
import { CATEGORY_STYLES } from "../constants/campus-styles";

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-end p-4 pb-20 md:pb-4 gap-3">
      {/* Legend Panel */}
      <div
        className={`bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] p-4 min-w-[200px] text-white shadow-2xl shadow-black/50 rounded-2xl transition-all duration-300 origin-bottom-right pointer-events-auto ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none h-0 overflow-hidden p-0 border-0"
        }`}
      >
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/[0.06]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Map Legend</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-white transition-colors p-0.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-2.5">
          {CATEGORY_STYLES.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${cat.styles.fill}`}>
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d={cat.styles.icon} />
                </svg>
              </div>
              <span className="text-xs text-gray-300 font-medium">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Credits */}
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <p className="text-[10px] text-gray-600 flex items-center gap-1">
            Made with <span className="text-red-500">♥</span> by{" "}
            <a
              href="https://github.com/takudzwamvere"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-300 underline decoration-gray-700 underline-offset-2 transition-colors"
            >
              Takudzwa Mvere
            </a>
          </p>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-xl shadow-lg shadow-black/30 flex items-center justify-center transition-all duration-200 pointer-events-auto border border-white/[0.08] ${
          isOpen
            ? "bg-white/10 text-gray-400"
            : "bg-[#1a1a2e]/90 backdrop-blur-xl text-white hover:bg-[#1a1a2e]"
        }`}
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}
