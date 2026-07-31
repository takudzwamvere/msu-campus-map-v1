/**
 * building-extras.ts
 * Rich supplementary metadata for campus buildings — hours, capacity, amenities.
 * Keyed by the exact building name string from campus-data.ts.
 * Merged with base data via getBuildingDetails().
 */

export interface BuildingExtras {
  hours?: string;
  capacity?: number;
  amenities?: string[];
  /** Floor count */
  floors?: number;
  /** Short URL-safe slug */
  slug?: string;
  /** Photo URL (use public/ path or external) */
  image?: string;
  /** Wi-Fi availability */
  hasWifi?: boolean;
  /** Accessibility info */
  accessible?: boolean;
  /** Community notes (shown alongside crowdsourced contributions) */
  adminNote?: string;
}

/** Master extras map */
export const BUILDING_EXTRAS: Record<string, BuildingExtras> = {
  // ── Dining ───────────────────────────────────────────────────────────────
  "Main Dining Hall": {
    hours: "Mon–Fri 7:00–20:00 · Sat–Sun 8:00–18:00",
    capacity: 800,
    amenities: ["Vegetarian options", "Packed meals available", "Cashless payment"],
    hasWifi: false,
    accessible: true,
    adminNote: "Closed public holidays. Meal cards accepted.",
  },
  "SPILL Tuck Shop": {
    hours: "Mon–Fri 7:30–17:00",
    capacity: 30,
    amenities: ["Hot food", "Beverages", "Snacks"],
    hasWifi: false,
  },

  // ── Library ───────────────────────────────────────────────────────────────
  "MSU Main Library": {
    hours: "Mon–Fri 8:00–22:00 · Sat 9:00–17:00 · Sun 14:00–20:00",
    capacity: 600,
    amenities: ["Study rooms", "Printing & photocopying", "Wi-Fi", "Silent zones", "Research databases"],
    floors: 4,
    hasWifi: true,
    accessible: true,
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  "Administration Block": {
    hours: "Mon–Fri 8:00–16:30",
    capacity: 150,
    amenities: ["Student records", "Finance office", "Registrar"],
    hasWifi: true,
    accessible: true,
    floors: 3,
  },
  "Senate Building": {
    hours: "Mon–Fri 8:00–16:30",
    capacity: 50,
    amenities: ["Vice Chancellor's office", "Senate chamber"],
    floors: 2,
    accessible: true,
  },

  // ── Academic ──────────────────────────────────────────────────────────────
  "ICT Complex": {
    hours: "Mon–Fri 7:30–21:00 · Sat 9:00–15:00",
    capacity: 120,
    amenities: ["Computer labs", "High-speed internet", "Printing"],
    hasWifi: true,
    floors: 2,
    adminNote: "Labs often full before 10:00 and 13:00. Arrive early.",
  },
  "Faculty of Commerce": {
    hours: "Mon–Fri 8:00–17:00",
    capacity: 300,
    amenities: ["Lecture theatres", "Seminar rooms", "Student lounge"],
    floors: 3,
    hasWifi: true,
    accessible: true,
  },
  "Faculty of Science & Technology": {
    hours: "Mon–Fri 7:30–17:30",
    capacity: 400,
    amenities: ["Laboratories", "Lecture theatres", "Wi-Fi", "Equipment stores"],
    floors: 3,
    hasWifi: true,
  },
  "Law School": {
    hours: "Mon–Fri 8:00–17:00",
    capacity: 200,
    amenities: ["Moot court", "Law library", "Seminar rooms"],
    floors: 2,
    hasWifi: true,
    accessible: true,
  },

  // ── Health ────────────────────────────────────────────────────────────────
  "Student Health Centre": {
    hours: "Mon–Fri 8:00–17:00 · Emergency: 24/7",
    capacity: 40,
    amenities: ["General consultations", "Pharmacy", "Emergency care"],
    accessible: true,
    adminNote: "After-hours emergency: call Campus Security.",
  },

  // ── Sports ────────────────────────────────────────────────────────────────
  "MSU Sports Complex": {
    hours: "Mon–Sat 6:00–21:00 · Sun 8:00–18:00",
    capacity: 200,
    amenities: ["Gymnasium", "Weights room", "Changing rooms", "Showers"],
    hasWifi: false,
    accessible: false,
  },
  "Swimming Pool": {
    hours: "Mon–Fri 7:00–12:00 & 14:00–18:00",
    capacity: 80,
    amenities: ["Olympic pool", "Changing rooms", "Lifeguard on duty"],
  },
};

/**
 * Returns merged building data: base record + extras.
 * Safe to call with any building name — returns empty extras if not found.
 */
export function getBuildingExtras(buildingName: string): BuildingExtras {
  // Try exact match first, then case-insensitive partial match
  const exact = BUILDING_EXTRAS[buildingName];
  if (exact) return exact;

  const lower = buildingName.toLowerCase();
  const partialKey = Object.keys(BUILDING_EXTRAS).find((k) =>
    k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())
  );
  return partialKey ? BUILDING_EXTRAS[partialKey] : {};
}

/** Check if supplementary extras exist for a building */
export function hasBuildingExtras(buildingName: string): boolean {
  if (BUILDING_EXTRAS[buildingName]) return true;
  const lower = buildingName.toLowerCase();
  return Object.keys(BUILDING_EXTRAS).some((k) =>
    k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())
  );
}
