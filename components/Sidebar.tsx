"use client";

import { useState, useRef, useEffect } from "react";
import { CAMPUS_BUILDINGS } from "../constants/campus-data";
import { CATEGORY_STYLES } from "../constants/campus-styles";

interface SidebarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onGetDirections: (lat: number, lng: number) => void;
  isRouting: boolean;
  onClearRoute: () => void;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export default function Sidebar({
  searchQuery,
  onSearch,
  onGetDirections,
  isRouting,
  onClearRoute,
  activeFilter,
  onFilterChange,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof CAMPUS_BUILDINGS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Default to expanded on desktop, collapsed on mobile
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsExpanded(true);
    }
  }, []);

  // Search Logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = CAMPUS_BUILDINGS.filter(b => 
        b.Building.toLowerCase().includes(q) || 
        (b.Description && b.Description.toLowerCase().includes(q))
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  return (
    <>
      {/* Mobile Bottom Sheet (Visible on small screens) */}
      <div className={`md:hidden fixed bottom-0 left-0 w-full z-[3000] flex flex-col transition-transform duration-300 ease-spring ${
          isExpanded ? "translate-y-0 h-[80vh]" : "translate-y-[calc(100%-80px)] h-[80vh]"
      }`}>
         <div className="bg-[#18181b] rounded-t-none shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex-1 flex flex-col border-t border-white/10 relative">
            {/* Handle / Header */}
            <div 
                className="w-full flex justify-center pt-3 pb-3 cursor-pointer touch-none hover:bg-white/5 transition-colors rounded-t-[20px]"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Arrow Icon that rotates */}
                <svg 
                    className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
            </div>

            {/* Search Header */}
            <div className="px-4 pb-2">
                 <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search Maps"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        onFocus={() => { 
                            setIsExpanded(true); 
                            if(searchQuery.length > 1) setShowSuggestions(true); 
                        }}
                        className="w-full bg-[#27272a] text-white placeholder-gray-500 rounded-none py-3 pl-10 pr-4 text-[15px] outline-none border-none focus:bg-[#3f3f46] transition-all"
                    />
                 </div>
            </div>

            {/* Scrollable Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-20">
                 {/* Suggestions */}
                 {showSuggestions && suggestions.length > 0 && (
                    <div className="mb-4 bg-[#27272a] rounded-xl overflow-hidden">
                        {suggestions.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0"
                                onClick={() => {
                                    onSearch(item.Building);
                                    onGetDirections(item.Latitude, item.Longitude);
                                    setShowSuggestions(false);
                                    setIsExpanded(false); // Minify on selection
                                }}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-200">{item.Building}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.Type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 )}

                 {/* Categories */}
                 {!isRouting && (
                    <div className="mt-2 space-y-2">
                        <h2 className="text-sm font-semibold text-white ml-1">Find Nearby</h2>
                        {CATEGORY_STYLES.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => onFilterChange(activeFilter === cat.name ? null : cat.name)}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-sm transition-all ${
                                    activeFilter === cat.name 
                                    ? "bg-blue-600/20 text-blue-400" 
                                    : "bg-[#27272a] text-gray-300"
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                    activeFilter === cat.name ? "bg-blue-500 text-white" : cat.styles.fill
                                }`}>
                                   <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                      <path d={cat.styles.icon} />
                                   </svg>
                                </div>
                                <span className="font-medium">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                 )}

                 {/* Active Routing View */}
                 {isRouting && (
                    <div className="mt-4 p-4 bg-blue-500/10 rounded-xl space-y-4">
                        <h3 className="text-white font-bold">Navigating to Destination</h3>
                        <button 
                            onClick={onClearRoute}
                            className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg font-medium"
                        >
                            End Navigation
                        </button>
                    </div>
                 )}
             </div>
         </div>
      </div>


      {/* Desktop Sidebar (Hidden on mobile) */}
      <div className={`hidden md:flex fixed top-0 left-0 h-full z-[4000] transition-all duration-300 pointer-events-none ${isExpanded ? "w-80 lg:w-96" : "w-16"}`}>
        
        {/* Navigation Rail - Always Visible */}
        <div className="w-16 h-full bg-[#0f0f12] flex flex-col items-center py-4 gap-6 border-r border-white/10 pointer-events-auto shadow-2xl">
            {/* Toggle / Home Button */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-3 text-white bg-blue-600 rounded-none shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            {/* Icons */}
            <div className="flex flex-col gap-4 w-full px-2">
                <RailItem icon="search" active={!isRouting} onClick={() => { setIsExpanded(true); }} />
                <RailItem icon="navigation" active={isRouting} onClick={() => { setIsExpanded(true); }} />
            </div>
            
        </div>

        {/* Expandable Panel */}
        <div className={`h-full flex-1 bg-[#18181b]/95 backdrop-blur-md border-r border-white/10 flex flex-col transition-all duration-300 pointer-events-auto ${
            isExpanded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 w-0 overflow-hidden"
        }`}>
            {/* ... Desktop Content (kept similar to original logic) ... */}
            <div className="p-4 pt-6">
                <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">
                    {isRouting ? "Navigation" : "Campus Map"}
                </h1>

                {/* Search box container */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for places..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        onFocus={() => { 
                            setIsExpanded(true); 
                            if(searchQuery.length > 1) setShowSuggestions(true); 
                        }}
                        className="w-full bg-[#27272a] text-white placeholder-gray-500 rounded-none py-2.5 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-blue-500/50 focus:bg-[#3f3f46] transition-all shadow-inner"
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-[#27272a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[4100]">
                            {suggestions.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-b-0"
                                    onClick={() => {
                                        onSearch(item.Building);
                                        onGetDirections(item.Latitude, item.Longitude);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-200">{item.Building}</p>
                                        <p className="text-xs text-gray-500 truncate">{item.Type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
                
                {/* Find Nearby Section */}
                {!isRouting && (
                    <div className="mt-2">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Find Nearby</h2>
                        <div className="grid grid-cols-1 gap-2">
                            {CATEGORY_STYLES.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        onFilterChange(activeFilter === cat.name ? null : cat.name);
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-none transition-all border ${
                                        activeFilter === cat.name 
                                        ? "bg-blue-600/20 border-blue-500/50" 
                                        : "bg-[#27272a] border-transparent hover:bg-[#3f3f46]"
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        activeFilter === cat.name ? "bg-blue-500 text-white" :  cat.styles.fill.replace('text-', 'text-white ') + " text-white opacity-80"
                                    }`}>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d={cat.styles.icon} />
                                    </svg>
                                    </div>
                                    <div className="text-left">
                                        <span className={`block text-sm font-medium ${activeFilter === cat.name ? "text-blue-400" : "text-gray-300"}`}>
                                            {cat.name}
                                        </span>
                                    </div>
                                    {activeFilter === cat.name && (
                                        <div className="ml-auto">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Routing / Active State */}
                {isRouting && (
                    <div className="mt-4 p-4 bg-gradient-to-b from-[#27272a] to-[#18181b] border border-blue-500/30 rounded-xl space-y-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 border border-white/10">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm tracking-wide">Navigating to Campus</h3>
                                <p className="text-blue-400 text-xs font-medium">Follow the route on the map</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={onClearRoute}
                            className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 hover:shadow-md cursor-pointer active:scale-[0.98]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            End Navigation
                        </button>
                    </div>
                )}

            </div>
        </div>
      </div>
    </>
  );
}

function RailItem({ icon, active, onClick }: { icon: string; active?: boolean; onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`p-3 rounded-xl transition-all ${
                active 
                ? "bg-white/10 text-white shadow-inner" 
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
        >
            {icon === "search" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            )}
            {icon === "navigation" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
             {icon === "layers" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" /></svg>
            )}
        </button>
    )
}
