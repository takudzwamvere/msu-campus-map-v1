"use client";

export default function MapOverlay({ 
  onSearch, 
  activeFilter, 
  onFilter,
  mapStyle,
  onMapStyleChange
}: { 
  onSearch: (query: string) => void;
  activeFilter: string | null;
  onFilter: (filter: string) => void;
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
}) {
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
      {/* Top Left Search & Filter */}
      <div className="absolute top-4 left-0 w-full px-4 z-[1000] flex flex-col gap-2 md:left-4 md:w-auto md:max-w-sm md:px-0">
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
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent px-2 py-1 text-base text-gray-900 placeholder-gray-500 outline-none"
          />
          <button className="p-2 text-gray-500 hover:text-blue-600">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
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
      </div>

      {/* Layer Switcher - Bottom Right on Mobile, Top Right on Desktop */}
      <div className="absolute bottom-20 right-4 md:top-4 md:right-4 md:bottom-auto z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-md p-1 flex flex-col gap-1">
          <button 
            onClick={() => onMapStyleChange('satellite')}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${mapStyle === 'satellite' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            title="Satellite"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button 
             onClick={() => onMapStyleChange('street')}
             className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${mapStyle === 'street' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
             title="Street"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          </button>
           <button 
             onClick={() => onMapStyleChange('minimal')}
             className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${mapStyle === 'minimal' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
             title="Minimal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
        </div>
      </div>
    </>
  );
}
