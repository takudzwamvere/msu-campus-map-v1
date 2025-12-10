"use client";

export default function MapOverlay() {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex w-full max-w-sm flex-col gap-2">
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
          placeholder="Search Google Maps"
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
      <div className="flex gap-2 px-1">
        <button className="rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-200">
          Restaurants
        </button>
        <button className="rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-200">
          Hotels
        </button>
        <button className="rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-200">
          Things to do
        </button>
      </div>
    </div>
  );
}
