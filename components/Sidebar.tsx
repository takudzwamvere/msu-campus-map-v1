"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const [suggestions, setSuggestions] = useState<typeof CAMPUS_BUILDINGS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Search logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = CAMPUS_BUILDINGS.filter(b =>
        b.Building.toLowerCase().includes(q) ||
        (b.Description && b.Description.toLowerCase().includes(q))
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Click-outside & Escape handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSuggestions(false);
        setMobileExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const getCategoryCount = useCallback((cat: typeof CATEGORY_STYLES[0]) => {
    return CAMPUS_BUILDINGS.filter(b => {
      const type = (b.Type || "").toLowerCase();
      return cat.keywords.some(k => type.includes(k));
    }).length;
  }, []);

  const clearSearch = () => {
    onSearch("");
    setShowSuggestions(false);
  };

  const selectSuggestion = (item: typeof CAMPUS_BUILDINGS[0]) => {
    onSearch(item.Building);
    onGetDirections(item.Latitude, item.Longitude);
    setShowSuggestions(false);
    setMobileExpanded(false);
  };

  // ──────────── DESKTOP ────────────
  const renderDesktop = () => (
    <div className="hidden md:block fixed top-0 left-0 z-[3000] p-4 w-[400px] pointer-events-none">
      <div className="pointer-events-auto" ref={searchContainerRef}>
        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/40 rounded-2xl overflow-hidden">
            <div className="pl-4 pr-2 flex items-center">
              <svg className="w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search campus..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => { if (searchQuery.length > 1) setShowSuggestions(true); }}
              className="flex-1 bg-transparent text-white placeholder-gray-500 py-3.5 px-2 text-[15px] outline-none"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="pr-4 text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSuggestion(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left border-b border-white/[0.04] last:border-b-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{item.Building}</p>
                    <p className="text-xs text-gray-500 truncate">{item.Type}{item.Description ? ` · ${item.Description}` : ""}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Chips */}
        {!isRouting && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_STYLES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onFilterChange(activeFilter === cat.name ? null : cat.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full whitespace-nowrap text-xs font-semibold transition-all border shrink-0 ${
                  activeFilter === cat.name
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-lg shadow-blue-500/10"
                    : "bg-[#1a1a2e]/80 backdrop-blur-xl border-white/[0.08] text-gray-400 hover:text-gray-200 hover:bg-[#1a1a2e]"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d={cat.styles.icon} /></svg>
                {cat.name}
                <span className="text-[10px] opacity-60">{getCategoryCount(cat)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Routing Panel */}
        {isRouting && (
          <div className="mt-3 bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Route Active</p>
                  <p className="text-gray-500 text-xs">Follow the blue line on the map</p>
                </div>
              </div>
              <button
                onClick={onClearRoute}
                className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                title="End navigation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ──────────── MOBILE ────────────
  const renderMobile = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[3000] pointer-events-none">
      {/* Backdrop */}
      {mobileExpanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto z-[2999]"
          onClick={() => setMobileExpanded(false)}
        />
      )}

      <div className={`pointer-events-auto relative z-[3000] transition-all duration-300 ease-out ${
        mobileExpanded ? "h-[55vh]" : "h-auto"
      }`}>
        <div className={`bg-[#1a1a2e]/95 backdrop-blur-xl border-t border-white/[0.08] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] h-full flex flex-col ${
          mobileExpanded ? "rounded-t-3xl" : "rounded-t-2xl"
        }`}>

          {/* Drag Handle */}
          <div
            className="flex justify-center py-3 cursor-pointer"
            onClick={() => setMobileExpanded(!mobileExpanded)}
          >
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <div className="flex items-center bg-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="pl-3.5 pr-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search campus..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => {
                  setMobileExpanded(true);
                  if (searchQuery.length > 1) setShowSuggestions(true);
                }}
                className="flex-1 bg-transparent text-white placeholder-gray-500 py-3 px-1 text-sm outline-none"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="pr-3 text-gray-500 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>

          {/* Expanded Content */}
          {mobileExpanded && (
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6">
              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="mb-4">
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectSuggestion(item)}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/[0.06] transition-colors text-left border-b border-white/[0.04] last:border-b-0 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{item.Building}</p>
                        <p className="text-xs text-gray-500 truncate">{item.Type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Categories (vertical for mobile) */}
              {!isRouting && !showSuggestions && (
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Browse by Category</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORY_STYLES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          onFilterChange(activeFilter === cat.name ? null : cat.name);
                          setMobileExpanded(false);
                        }}
                        className={`flex items-center gap-2.5 p-3 rounded-xl transition-all border text-left ${
                          activeFilter === cat.name
                            ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                            : "bg-white/[0.04] border-white/[0.06] text-gray-400"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          activeFilter === cat.name ? "bg-blue-500/20" : "bg-white/[0.06]"
                        }`}>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d={cat.styles.icon} /></svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{cat.name}</p>
                          <p className="text-[10px] text-gray-600">{getCategoryCount(cat)} places</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Routing */}
              {isRouting && (
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">Route Active</p>
                        <p className="text-gray-500 text-xs">Follow the blue line</p>
                      </div>
                    </div>
                    <button onClick={onClearRoute} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                      End
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collapsed: Category chips when not expanded */}
          {!mobileExpanded && !isRouting && (
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
              {CATEGORY_STYLES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => onFilterChange(activeFilter === cat.name ? null : cat.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-semibold transition-all border shrink-0 ${
                    activeFilter === cat.name
                      ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                      : "bg-white/[0.06] border-white/[0.06] text-gray-500"
                  }`}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d={cat.styles.icon} /></svg>
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Collapsed: Routing mini */}
          {!mobileExpanded && isRouting && (
            <div className="flex items-center justify-between px-4 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </div>
                <span className="text-white text-xs font-semibold">Navigating...</span>
              </div>
              <button onClick={onClearRoute} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[11px] font-bold border border-red-500/20">
                End
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderDesktop()}
      {renderMobile()}
    </>
  );
}
