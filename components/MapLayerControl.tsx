"use client";

import { useState } from "react";
import { MAP_LAYERS } from "../constants/map-layers";

interface MapLayerControlProps {
  activeLayerName: string;
  onLayerSelect: (layer: typeof MAP_LAYERS[0]) => void;
}

export default function MapLayerControl({ activeLayerName, onLayerSelect }: MapLayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to determine style preview
  const getPreviewStyle = (name: string) => {
    if (name.includes("Satellite") || name.includes("Hybrid")) {
      return "bg-emerald-900 overflow-hidden relative";
    }
    if (name.includes("Dark")) {
      return "bg-slate-900";
    }
    return "bg-gray-200";
  };

  // Helper for preview content (CSS patterns)
  const renderPreviewContent = (name: string) => {
      if (name.includes("Satellite") || name.includes("Hybrid")) {
          return (
              <>
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-800 via-emerald-900 to-black"></div>
                {/* Roads */}
                <div className="absolute top-0 right-0 w-[120%] h-full border-l-4 border-white/20 transform -skew-x-12 rotate-12"></div>
                <div className="absolute bottom-0 left-0 w-full h-[120%] border-t-4 border-white/20 transform -skew-y-12 -rotate-12"></div>
              </>
          )
      }
      if (name.includes("Dark")) {
          return (
             <>
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-500 to-transparent"></div>
               <div className="absolute top-2 left-0 w-full h-0.5 bg-white/10"></div>
               <div className="absolute top-6 left-0 w-full h-0.5 bg-white/10"></div>
               <div className="absolute top-0 left-4 h-full w-0.5 bg-white/10"></div>
             </>
          )
      }
      // Standard / Default
      return (
         <>
             <div className="absolute inset-0 opacity-50 bg-[#e5e7eb]"></div>
             <div className="absolute top-0 right-1/4 w-2 h-full bg-white transform rotate-12"></div>
             <div className="absolute top-1/3 left-0 w-full h-2 bg-white transform -rotate-6"></div>
             <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-orange-400"></div>
         </>
      )
  }

  return (
    <>
        {/* Desktop Dropdown (Hidden on Mobile) */}
        <div className="hidden md:flex absolute top-4 right-4 z-[1000] flex-col items-end">
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="bg-[#18181b] border border-white/10 p-2 text-white shadow-xl hover:bg-[#27272a] transition-colors rounded-sm flex items-center gap-2 mb-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider inline-block">Map Layers</span>
        </button>

        {isOpen && (
            <div className="bg-[#18181b] border border-white/10 p-4 min-w-[320px] text-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 rounded-none">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200">Select Style</h3>
                <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
                >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                {MAP_LAYERS.map((layer) => (
                <button
                    key={layer.name}
                    onClick={() => onLayerSelect(layer)}
                    className={`relative aspect-video rounded-sm overflow-hidden border-2 transition-all group hover:scale-[1.02] ${
                    activeLayerName === layer.name 
                        ? "border-blue-500 ring-2 ring-blue-500/20" 
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                >
                     {/* Preview Background */}
                     <div className={`absolute inset-0 ${getPreviewStyle(layer.name)}`}>
                        {renderPreviewContent(layer.name)}
                    </div>
                    
                    {/* Label Band */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-1.5 text-left">
                        <span className="text-[10px] font-bold text-white block truncate uppercase tracking-wide">{layer.name}</span>
                    </div>

                    {/* Active Indicator */}
                    {activeLayerName === layer.name && (
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-500 shadow-lg border border-white flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                    )}
                </button>
                ))}
            </div>
            
            </div>
        )}
        </div>

        {/* Mobile FAB (Bottom Right) */}
        <div className="md:hidden absolute top-20 right-4 z-[1000]">
             <button 
                onClick={() => setIsOpen(true)}
                className="w-10 h-10 bg-[#18181b] rounded-none shadow-xl border border-white/10 flex items-center justify-center text-white"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                </svg>
             </button>
        </div>

        {/* Mobile Bottom Sheet Modal */}
        {isOpen && (
            <div className="md:hidden fixed inset-0 z-[5000] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                {/* Backdrop Click to Close */}
                <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

                <div className="bg-[#1e1e21] w-full max-w-md rounded-t-none p-5 shadow-2xl relative animate-in slide-in-from-bottom duration-300 border-t border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Choose Map</h2>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="bg-white/10 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pb-4 custom-scrollbar">
                        {MAP_LAYERS.map((layer) => (
                            <button
                                key={layer.name}
                                onClick={() => {
                                    onLayerSelect(layer);
                                    setIsOpen(false);
                                }}
                                className={`relative aspect-video rounded-sm overflow-hidden border-2 transition-all group ${
                                    activeLayerName === layer.name
                                    ? "border-blue-500 ring-2 ring-blue-500/20"
                                    : "border-transparent opacity-80 hover:opacity-100"
                                }`}
                            >
                                {/* Preview Background */}
                                <div className={`absolute inset-0 ${getPreviewStyle(layer.name)}`}>
                                     {renderPreviewContent(layer.name)}
                                </div>
                                
                                {/* Label Band */}
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-2">
                                     <span className="text-xs font-semibold text-white block truncate">{layer.name}</span>
                                </div>

                                {/* Active Indicator */}
                                {activeLayerName === layer.name && (
                                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 shadow-lg border border-white flex items-center justify-center">
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
