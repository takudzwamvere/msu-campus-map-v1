import { useState, useRef, useEffect } from "react";
import { CAMPUS_BUILDINGS } from "../constants/campus-data";

export default function Header({
  searchQuery,
  onSearch,
  onGetDirections,
  isRouting,
  onClearRoute,
}: {
  searchQuery: string;
  onSearch: (query: string) => void;
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

  return (
    <header className="bg-slate-950 z-50 relative px-4 flex items-center justify-between h-10">
      <div className="w-full max-w-4xl mx-auto relative flex gap-4 items-center h-full">

         {!isRouting ? (
           <div className="relative flex-1 h-9">
             <div className="relative flex items-center border-b border-gray-300 px-3 h-full transition-colors ">
                <svg className="h-4 w-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  onFocus={() => { if(searchQuery.length > 1) setShowSuggestions(true); }}
                  className="w-full bg-transparent text-white placeholder-white outline-none text-sm"
                />
                {searchQuery && (
                  <button onClick={() => { onSearch(""); setShowSuggestions(false); }} className="text-gray-400 hover:text-gray-600">
                     <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
             </div>


              {showSuggestions && suggestions.length > 0 && (
                <div ref={wrapperRef} className="absolute top-full left-0 mt-0 w-full bg-white border border-gray-200 border-t-0 shadow-lg z-50">
                  {suggestions.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                      onClick={() => {
                          onSearch(item.Building);
                          onGetDirections(item.Latitude, item.Longitude);
                          setShowSuggestions(false);
                        }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800">{item.Building}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[300px]">{item.Type} {item.Description ? `• ${item.Description}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
         ) : (
            <div className="flex items-center justify-between w-full h-9">
               <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1.5 animate-pulse border border-blue-100">
                Navigating
               </span>
               <button 
                onClick={onClearRoute}
                className="bg-red-600 text-white px-4 h-full text-sm font-medium flex items-center gap-2 hover:bg-red-700 transition-colors"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 Exit
               </button>
            </div>
         )}
      </div>
    </header>
  );
}
