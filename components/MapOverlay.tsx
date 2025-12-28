import { CAMPUS_BUILDINGS } from "../constants/campus-data";
import { useState, useEffect, useRef } from "react";

export default function MapOverlay({ 
  onSearch, 
  activeFilter, 
  onFilter,
  mapStyle,
  onMapStyleChange,
  searchQuery,
  onGetDirections,
  isRouting,
  onClearRoute
}: { 
  onSearch: (query: string) => void;
  activeFilter: string | null;
  onFilter: (filter: string) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
  searchQuery: string;
  onGetDirections: (lat: number, lng: number) => void;
  isRouting: boolean;
  onClearRoute: () => void;
}) {
  const [suggestions, setSuggestions] = useState<typeof CAMPUS_BUILDINGS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = CAMPUS_BUILDINGS.filter(b => 
        b.Building.toLowerCase().includes(q) || 
        (b.Description && b.Description.toLowerCase().includes(q))
      ).slice(0, 5); // Limit to top 5
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  const FILTERS = [
    { label: "All", key: "all" },
    { label: "Hostels", key: "dormitory" },
    { label: "Academic", key: "academic" }, // Includes class, lab, theatre
    { label: "Food", key: "dining" },
    { label: "Sports", key: "sports" }, // Gym, pool, courts
    { label: "Parking", key: "car park" },
    { label: "Toilets", key: "toilet" },
    { label: "Admin", key: "admin" },
  ];

  return (
    <>
      {/* Top Left Search & Filter / Navigation Controls */}
      <div className="absolute top-4 left-0 w-full px-4 z-[1000] flex flex-col gap-2 md:left-4 md:w-auto md:max-w-sm md:px-0">
        {!isRouting ? (
          <>
            <div className="relative flex items-center rounded-lg bg-white p-2 shadow-md">
              <button className="p-2 text-gray-500 hover:text-black">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search campus..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => { if(searchQuery.length > 1) setShowSuggestions(true); }}
                className="w-full bg-transparent px-2 py-1 text-base text-gray-900 placeholder-gray-500 outline-none"
              />
              {searchQuery && (
                <button onClick={() => { onSearch(""); setShowSuggestions(false); }} className="p-2 text-gray-400 hover:text-gray-600">
                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div ref={wrapperRef} className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl overflow-hidden z-[1001] border border-gray-100">
                {suggestions.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        onSearch(item.Building);
                        setShowSuggestions(false);
                      }}
                    >
                      <p className="font-semibold text-sm text-gray-800">{item.Building}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{item.Type} {item.Description ? `• ${item.Description}` : ''}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onGetDirections(item.Latitude, item.Longitude);
                        onSearch(item.Building); // Also select it
                        setShowSuggestions(false);
                      }}
                      className="ml-2 p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                      title="Get Directions"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 px-1 overflow-x-auto pb-2 scrollbar-hide mask-fade-right">
              {FILTERS.map((filter) => {
                 const isActive = activeFilter === filter.key || (filter.key === 'all' && !activeFilter);
                 return (
                  <button 
                    key={filter.key}
                    onClick={() => onFilter(filter.key === 'all' ? '' : filter.key)}
                    className={`rounded-full px-4 py-1 text-sm font-medium shadow-sm border whitespace-nowrap transition-colors
                      ${isActive 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                      }`}
                  >
                    {filter.label}
                  </button>
                 );
              })}
            </div>
          </>
        ) : (
          <button 
             onClick={onClearRoute}
             className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold flex items-center gap-2 self-start pointer-events-auto"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             Exit Navigation
          </button>
        )}
      </div>

      {/* Layer Switcher - Bottom Left */}
      <div className="absolute bottom-8 left-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-gray-200 flex flex-row gap-2">
          <button 
            onClick={() => onMapStyleChange('satellite')}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${mapStyle === 'satellite' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
            title="Satellite"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button 
             onClick={() => onMapStyleChange('street')}
             className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${mapStyle === 'street' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
             title="Street"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </button>
           <button 
             onClick={() => onMapStyleChange('minimal')}
             className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${mapStyle === 'minimal' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
             title="Minimal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
        </div>
      </div>
    </>
  );
}
