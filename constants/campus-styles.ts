export const CATEGORY_STYLES = [
  {
    name: "Dormitories",
    keywords: ["dormitory", "hostel"],
    styles: { color: "text-indigo-600", bg: "bg-indigo-100", border: "border-indigo-200", fill: "bg-indigo-500", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" }
  },
  {
    name: "Academic",
    keywords: ["class", "lab", "theatre", "library", "workshop"],
    styles: { color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200", fill: "bg-emerald-500", icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" }
  },
  {
    name: "Sports & Leisure",
    keywords: ["gym", "pool", "sports", "basketball", "volleyball", "tennis", "football", "leisure", "garden", "cattle"],
    styles: { color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200", fill: "bg-orange-500", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
  },
  {
    name: "Dining",
    keywords: ["dining", "cafeteria"],
    styles: { color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200", fill: "bg-rose-500", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" }
  },
  {
    name: "Services & Health",
    keywords: ["music", "disability", "residency", "clinic", "health"],
    styles: { color: "text-violet-600", bg: "bg-violet-100", border: "border-violet-200", fill: "bg-violet-500", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
  }
];

export const getTypeStyles = (type: string) => {
  const lowerType = type.toLowerCase();
  const match = CATEGORY_STYLES.find(cat => cat.keywords.some(k => lowerType.includes(k)));
  
  return match?.styles || { 
    color: "text-gray-500", 
    bg: "bg-gray-100", 
    border: "border-gray-200", 
    fill: "bg-gray-500",
    icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
  };
};
