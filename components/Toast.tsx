"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[7000] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 bg-red-500/15 backdrop-blur-xl border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl shadow-2xl shadow-black/50 max-w-[90vw] md:max-w-md">
        <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="text-sm font-medium leading-snug flex-1">{message}</p>
        <button
          onClick={onDismiss}
          className="text-red-400/60 hover:text-red-300 transition-colors p-0.5 shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
