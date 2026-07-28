"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CAMPUS_BUILDINGS } from "../constants/campus-data";
import { CATEGORY_STYLES } from "../constants/campus-styles";
import type { RouteSummary } from "./MapRouting";

interface SidebarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onGetDirections: (lat: number, lng: number) => void;
  onFlyTo: (lat: number, lng: number, buildingName?: string) => void;
  onPlanRoute: (fromLat: number, fromLng: number, toLat: number, toLng: number) => void;
  isRouting: boolean;
  onClearRoute: () => void;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  routeSummary: RouteSummary | null;
}

export default function Sidebar({
  searchQuery,
  onSearch,
  onGetDirections,
  onFlyTo,
  onPlanRoute,
  isRouting,
  onClearRoute,
  activeFilter,
  onFilterChange,
  routeSummary,
}: SidebarProps) {
  const [suggestions, setSuggestions] = useState<typeof CAMPUS_BUILDINGS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [showPlanRoute, setShowPlanRoute] = useState(false);
  const [fromBuilding, setFromBuilding] = useState<typeof CAMPUS_BUILDINGS[0] | null>(null);
  const [toBuilding, setToBuilding] = useState<typeof CAMPUS_BUILDINGS[0] | null>(null);
  const [planFromQuery, setPlanFromQuery] = useState("");
  const [planToQuery, setPlanToQuery] = useState("");
  const [planFromSuggestions, setPlanFromSuggestions] = useState<typeof CAMPUS_BUILDINGS>([]);
  const [planToSuggestions, setPlanToSuggestions] = useState<typeof CAMPUS_BUILDINGS>([]);
  const [activePlanField, setActivePlanField] = useState<"from" | "to" | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  // Search logic
  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = CAMPUS_BUILDINGS.filter(b =>
        b.Building.toLowerCase().includes(q) ||
        (b.Description && b.Description.toLowerCase().includes(q))
      ).slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Plan Route query effects
  useEffect(() => {
    if (planFromQuery.length > 0) {
      const q = planFromQuery.toLowerCase();
      setPlanFromSuggestions(
        CAMPUS_BUILDINGS.filter(b => b.Building.toLowerCase().includes(q)).slice(0, 6)
      );
    } else {
      setPlanFromSuggestions([]);
    }
  }, [planFromQuery]);

  useEffect(() => {
    if (planToQuery.length > 0) {
      const q = planToQuery.toLowerCase();
      setPlanToSuggestions(
        CAMPUS_BUILDINGS.filter(b => b.Building.toLowerCase().includes(q)).slice(0, 6)
      );
    } else {
      setPlanToSuggestions([]);
    }
  }, [planToQuery]);

  // Click-outside, Cmd+K / Slash key, & Escape handlers
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
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";
      if (!isInput && (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"))) {
        e.preventDefault();
        desktopInputRef.current?.focus() || mobileInputRef.current?.focus();
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
    onFlyTo(item.Latitude, item.Longitude, item.Building);   // Pan and highlight the building
    setShowSuggestions(false);
    setMobileExpanded(false);
  };

  const formatDistance = (metres: number) =>
    metres < 1000 ? `${Math.round(metres)} m` : `${(metres / 1000).toFixed(1)} km`;

  const formatTime = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const startPlannedRoute = () => {
    if (fromBuilding && toBuilding) {
      onPlanRoute(fromBuilding.Latitude, fromBuilding.Longitude, toBuilding.Latitude, toBuilding.Longitude);
      setShowPlanRoute(false);
    }
  };

  // ──────────── Plan Route Panel (shared) ────────────
  const renderPlanRoutePanel = () => (
    <div className="mt-3 bg-[#1a1a2e]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm font-semibold">Plan a Route</p>
        <button onClick={() => setShowPlanRoute(false)} className="text-gray-500 hover:text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* From */}
      <div className="relative mb-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">From</label>
        {fromBuilding ? (
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
            <span className="text-sm text-emerald-300 font-medium truncate">{fromBuilding.Building}</span>
            <button onClick={() => { setFromBuilding(null); setPlanFromQuery(""); }} className="text-emerald-500/60 hover:text-emerald-400 ml-2 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <input
            type="text"
            placeholder="Choose start building..."
            value={planFromQuery}
            onChange={e => { setPlanFromQuery(e.target.value); setActivePlanField("from"); }}
            onFocus={() => setActivePlanField("from")}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500/40"
          />
        )}
        {activePlanField === "from" && planFromSuggestions.length > 0 && !fromBuilding && (
          <div className="absolute z-50 top-full mt-1 w-full bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
            {planFromSuggestions.map(b => (
              <button key={b.Building} onClick={() => { setFromBuilding(b); setPlanFromQuery(""); setActivePlanField(null); }}
                className="w-full text-left px-3 py-2.5 text-sm text-gray-200 hover:bg-white/[0.06] border-b border-white/[0.04] last:border-0 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth={2} /></svg>
                </div>
                <span className="truncate">{b.Building}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* To */}
      <div className="relative mb-4">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">To</label>
        {toBuilding ? (
          <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
            <span className="text-sm text-blue-300 font-medium truncate">{toBuilding.Building}</span>
            <button onClick={() => { setToBuilding(null); setPlanToQuery(""); }} className="text-blue-500/60 hover:text-blue-400 ml-2 shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <input
            type="text"
            placeholder="Choose destination building..."
            value={planToQuery}
            onChange={e => { setPlanToQuery(e.target.value); setActivePlanField("to"); }}
            onFocus={() => setActivePlanField("to")}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/40"
          />
        )}
        {activePlanField === "to" && planToSuggestions.length > 0 && !toBuilding && (
          <div className="absolute z-50 top-full mt-1 w-full bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
            {planToSuggestions.map(b => (
              <button key={b.Building} onClick={() => { setToBuilding(b); setPlanToQuery(""); setActivePlanField(null); }}
                className="w-full text-left px-3 py-2.5 text-sm text-gray-200 hover:bg-white/[0.06] border-b border-white/[0.04] last:border-0 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </div>
                <span className="truncate">{b.Building}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={startPlannedRoute}
        disabled={!fromBuilding || !toBuilding}
        className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:bg-white/[0.06] disabled:text-gray-600 text-white font-semibold text-sm transition-all"
      >
        {fromBuilding && toBuilding ? "Start Route" : "Select both buildings"}
      </button>
    </div>
  );

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
              ref={desktopInputRef}
              type="text"
              aria-label="Search campus buildings"
              placeholder="Search campus..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => { if (searchQuery.length > 1) setShowSuggestions(true); }}
              className="flex-1 bg-transparent text-white placeholder-gray-500 py-3.5 px-2 text-[15px] outline-none"
            />
            {!searchQuery && (
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 mr-2 text-[10px] font-semibold text-gray-400 bg-white/[0.06] border border-white/[0.1] rounded select-none pointer-events-none">
                ⌘K
              </kbd>
            )}
            {searchQuery && (
              <button onClick={clearSearch} aria-label="Clear search query" className="pr-2 text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            <button
              onClick={() => { setShowPlanRoute(!showPlanRoute); setShowSuggestions(false); }}
              title="Plan a route between two buildings"
              className={`mr-3 p-2 rounded-xl transition-all ${
                showPlanRoute
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.06]"
              }`}
            >
              <svg className="w-[17px] h-[17px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
          </div>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              {suggestions.map((item) => (
                <button
                  key={`${item.Building}-${item.Latitude}`}
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

        {/* Plan Route Panel */}
        {showPlanRoute && !isRouting && renderPlanRoutePanel()}

        {/* Category Chips */}
        {!isRouting && !showPlanRoute && (
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
                  {routeSummary ? (
                    <p className="text-gray-400 text-xs">
                      <span className="text-cyan-400 font-bold">{formatDistance(routeSummary.distanceMetres)}</span>
                      {" · "}
                      <span className="text-green-400 font-bold">{formatTime(routeSummary.timeSeconds)}</span>
                    </p>
                  ) : (
                    <p className="text-gray-500 text-xs">Calculating route…</p>
                  )}
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
        mobileExpanded ? "max-h-[55vh]" : "h-auto"
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
                  {suggestions.map((item) => (
                    <button
                      key={`${item.Building}-${item.Latitude}`}
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
              {!isRouting && !showSuggestions && !showPlanRoute && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Browse by Category</p>
                    <button
                      onClick={() => setShowPlanRoute(true)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Plan Route
                    </button>
                  </div>
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

              {/* Plan Route panel (mobile) */}
              {showPlanRoute && !isRouting && renderPlanRoutePanel()}


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
                        {routeSummary ? (
                          <p className="text-gray-400 text-xs">
                            <span className="text-cyan-400 font-bold">{formatDistance(routeSummary.distanceMetres)}</span>
                            {" · "}
                            <span className="text-green-400 font-bold">{formatTime(routeSummary.timeSeconds)}</span>
                          </p>
                        ) : (
                          <p className="text-gray-500 text-xs">Calculating…</p>
                        )}
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
