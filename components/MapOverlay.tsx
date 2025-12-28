export default function MapOverlay({ 
  mapStyle,
  onMapStyleChange
}: { 
  mapStyle: string;
  onMapStyleChange: (style: string) => void;
}) {

  return (
    <div className="absolute inset-0 pointer-events-none z-[1000]">
      {/* Layer Switcher - Bottom Center (Moved Up) */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-white p-1 border border-gray-300 shadow-sm flex flex-row gap-0.5">
          <button 
            onClick={() => onMapStyleChange('satellite')}
            className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${mapStyle === 'satellite' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
            title="Satellite"
          >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <span>Satellite</span>
          </button>
          <button 
             onClick={() => onMapStyleChange('street')}
             className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${mapStyle === 'street' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
             title="Street"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            <span>Map</span>
          </button>
           <button 
             onClick={() => onMapStyleChange('minimal')}
             className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${mapStyle === 'minimal' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}
             title="Minimal"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>Minimal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
