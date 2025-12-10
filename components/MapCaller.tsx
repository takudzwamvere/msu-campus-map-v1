"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-100">
      <p className="text-lg font-semibold text-gray-600">Loading Map...</p>
    </div>
  ),
});

export default Map;
