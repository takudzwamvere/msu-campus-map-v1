"use client";

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

  const handleClose = () => {
    try {
      localStorage.setItem("msu-map-welcome-dismissed", "true");
    } catch {}
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a2e] border border-white/[0.08] shadow-2xl shadow-black/60 w-full max-w-[420px] rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">MSU Campus Map</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Explore buildings, find lecture halls, and get directions across the Gweru campus.
          </p>
        </div>

        {/* Categories Preview */}
        <div className="p-6">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Building Categories</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_STYLES.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]"
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${cat.styles.fill}`}>
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d={cat.styles.icon} />
                  </svg>
                </div>
                <span className="text-xs text-gray-400 font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 pt-2">
          <button
            onClick={handleClose}
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
