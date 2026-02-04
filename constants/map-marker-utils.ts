import { divIcon } from "leaflet";
import { getTypeStyles } from "./campus-styles";

export const getMarkerIcon = (type: string, name: string) => {
  const style = getTypeStyles(type);

  // Google-style Marker: Pin with Icon + Label below
  const html = `
    <div class="relative w-0 h-0">
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1 cursor-pointer hover:z-30 hover:scale-110 transition-transform duration-200 z-20 filter drop-shadow-md">
        <div class="relative">
          <div class="w-7 h-7 rounded-full ${style.bg} border-[2.5px] border-white flex items-center justify-center">
             <svg class="w-3.5 h-3.5 ${style.color}" fill="currentColor" viewBox="0 0 24 24">
               <path d="${style.icon}" />
             </svg>
          </div>
          <div class="absolute -bottom-[5px] left-1/2 transform -translate-x-1/2 rotate-45 w-2.5 h-2.5 ${style.bg} border-b-[2.5px] border-r-[2.5px] border-white"></div>
        </div>
      </div>
      
      <div class="absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none">
         <span class="text-[10px] font-bold text-white tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" 
               style="text-shadow: 0px 1px 3px rgba(0,0,0,0.9), 0px 0px 2px rgba(0,0,0,1);">
           ${name}
         </span>
      </div>
    </div>
  `;

  return divIcon({
    className: "!w-0 !h-0 bg-transparent border-none", // Force 0x0
    html: html,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};
