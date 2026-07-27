/**
 * timetable-types.ts
 * Types for the student timetable / schedule feature.
 */

export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export type DayOfWeek = typeof DAYS_OF_WEEK[number];

export interface ClassEntry {
  id: string;
  subjectName: string;
  buildingName: string;
  /** Latitude of the building */
  lat: number;
  /** Longitude of the building */
  lng: number;
  dayOfWeek: DayOfWeek;
  /** 24h format: "08:00" */
  startTime: string;
  /** 24h format: "10:00" */
  endTime: string;
  /** Optional room number / additional info */
  room?: string;
}

/** Parse a time string "HH:MM" into total minutes since midnight */
export function parseTimeMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Format minutes since midnight to "8:00 AM" style */
export function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Get the current day of week name */
export function getTodayName(): DayOfWeek | null {
  const days: (DayOfWeek | null)[] = [null, "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

/** Get minutes until a class starts. Negative means in progress or past. */
export function minutesUntilClass(entry: ClassEntry): number {
  const now = new Date();
  const today = getTodayName();
  if (today !== entry.dayOfWeek) return Infinity;

  const currentMins = now.getHours() * 60 + now.getMinutes();
  const startMins = parseTimeMinutes(entry.startTime);
  return startMins - currentMins;
}

/** Haversine distance in metres */
export function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Walking time in minutes at 1.2 m/s */
export function walkingMinutes(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dist = haversineMetres(lat1, lng1, lat2, lng2);
  return Math.ceil(dist / 1.2 / 60);
}
