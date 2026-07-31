"use client";

import { useEffect } from "react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "⌘ K / /", description: "Focus campus search input" },
  { key: "Esc", description: "Close panels, modals, and clear route" },
  { key: "?", description: "Toggle this keyboard shortcuts dialog" },
  { key: "+ / -", description: "Zoom in / out on interactive map" },
  { key: "Shift + 3", description: "Toggle 3D building extrusion perspective mode" },
];

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";
      
      if (!isInput && e.key === "?") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      onClick={onClose}
      className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1a1a2e] border border-white/[0.1] shadow-2xl shadow-black/80 w-full max-w-md rounded-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h2 id="shortcuts-dialog-title" className="text-base font-bold text-white tracking-tight">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-gray-400">Quick map navigation hotkeys</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close shortcuts dialog"
            className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3">
          {SHORTCUTS.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
            >
              <span className="text-xs text-gray-300 font-medium">{sc.description}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-lg shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.01] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
