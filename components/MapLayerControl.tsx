"use client";

import { useState } from "react";
import { MAP_LAYERS } from "../constants/map-layers";

interface MapLayerControlProps {
  activeLayerName: string;
  onLayerSelect: (layer: typeof MAP_LAYERS[0]) => void;
}

export default function MapLayerControl({ activeLayerName, onLayerSelect }: MapLayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPreviewStyle = (name: string) => {
    if (name.includes("Satellite") || name.includes("Hybrid")) return "bg-emerald-900 overflow-hidden relative";
    if (name.includes("Dark")) return "bg-slate-900";
    return "bg-gray-200";
  };

  const renderPreviewContent = (name: string) => {
    if (name.includes("Satellite") || name.includes("Hybrid")) {
      return (
        <>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-800 via-emerald-900 to-black" />
          <div className="absolute top-0 right-0 w-[120%] h-full border-l-4 border-white/20 transform -skew-x-12 rotate-12" />
          <div className="absolute bottom-0 left-0 w-full h-[120%] border-t-4 border-white/20 transform -skew-y-12 -rotate-12" />
        </>
      );
    }
    if (name.includes("Dark")) {
      return (
        <>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500 to-transparent" />
          <div className="absolute top-2 left-0 w-full h-0.5 bg-white/10" />
          <div className="absolute top-6 left-0 w-full h-0.5 bg-white/10" />
          <div className="absolute top-0 left-4 h-full w-0.5 bg-white/10" />
        </>
      );
    }
    return (
      <>
        <div className="absolute inset-0 opacity-50 bg-[#e5e7eb]" />
        <div className="absolute top-0 right-1/4 w-2 h-full bg-white transform rotate-12" />
        <div className="absolute top-1/3 left-0 w-full h-2 bg-white transform -rotate-6" />
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-orange-400" />
      </>
    );
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-lg shadow-black/30 flex items-center justify-center text-white hover:bg-[#1a1a2e] transition-all"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] p-4 w-[300px] shadow-2xl shadow-black/50 rounded-2xl absolute right-4">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/[0.06]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Map Style</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {MAP_LAYERS.map((layer) => (
                <button
                  key={layer.name}
                  onClick={() => { onLayerSelect(layer); setIsOpen(false); }}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all group hover:scale-[1.03] ${
                    activeLayerName === layer.name
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-white/[0.06] opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className={`absolute inset-0 ${getPreviewStyle(layer.name)}`}>
                    {renderPreviewContent(layer.name)}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-sm p-1.5">
                    <span className="text-[10px] font-bold text-white block truncate uppercase tracking-wide">{layer.name}</span>
                  </div>
                  {activeLayerName === layer.name && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-lg shadow-black/30 flex items-center justify-center text-white"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
          </svg>
        </button>
      </div>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[5000] flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="bg-[#1a1a2e] w-full max-w-md rounded-t-3xl p-5 shadow-2xl relative border-t border-white/[0.08]">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-white">Map Style</h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pb-4 custom-scrollbar">
              {MAP_LAYERS.map((layer) => (
                <button
                  key={layer.name}
                  onClick={() => { onLayerSelect(layer); setIsOpen(false); }}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                    activeLayerName === layer.name
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-white/[0.06] opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className={`absolute inset-0 ${getPreviewStyle(layer.name)}`}>
                    {renderPreviewContent(layer.name)}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-sm p-2">
                    <span className="text-xs font-semibold text-white block truncate">{layer.name}</span>
                  </div>
                  {activeLayerName === layer.name && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
