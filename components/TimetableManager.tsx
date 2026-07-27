"use client";

import { useState, useEffect, useCallback } from "react";
import { CAMPUS_BUILDINGS } from "../constants/campus-data";
import {
  type ClassEntry,
  type DayOfWeek,
  DAYS_OF_WEEK,
  formatTime12h,
  minutesUntilClass,
  walkingMinutes,
} from "../constants/timetable-types";

const STORAGE_KEY = "msu-timetable";

function loadTimetable(): ClassEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTimetable(entries: ClassEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

// ── Upcoming Class Alert Banner ─────────────────────────────────────────────
interface ClassAlertBannerProps {
  entries: ClassEntry[];
  userLocation: [number, number] | null;
  onGetDirections: (lat: number, lng: number) => void;
}

export function ClassAlertBanner({ entries, userLocation, onGetDirections }: ClassAlertBannerProps) {
  const [dismissed, setDismissed] = useState<string | null>(null);

  const upcoming = entries.find((e) => {
    const mins = minutesUntilClass(e);
    return mins >= 0 && mins <= 20 && e.id !== dismissed;
  });

  if (!upcoming) return null;

  const minsLeft = Math.floor(minutesUntilClass(upcoming));
  const walkMins = userLocation
    ? walkingMinutes(userLocation[0], userLocation[1], upcoming.lat, upcoming.lng)
    : null;

  const urgent = walkMins !== null && walkMins >= minsLeft;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[7000] px-4 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all ${urgent ? "bg-red-500/90" : "bg-blue-500/90"} backdrop-blur-sm text-white`}>
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="flex-1">
        <strong>{upcoming.subjectName}</strong> at {upcoming.buildingName} in {minsLeft} min
        {walkMins !== null && ` · ${walkMins} min walk`}
        {urgent && " — leave now!"}
      </span>
      <button
        onClick={() => onGetDirections(upcoming.lat, upcoming.lng)}
        className="shrink-0 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-all text-[11px] font-bold"
      >
        Directions
      </button>
      <button
        onClick={() => setDismissed(upcoming.id)}
        className="shrink-0 p-1 rounded-lg hover:bg-white/20 transition-all"
        aria-label="Dismiss alert"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Timetable Manager Drawer ────────────────────────────────────────────────
interface TimetableManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onGetDirections: (lat: number, lng: number) => void;
  userLocation: [number, number] | null;
}

const BLANK_ENTRY = {
  subjectName: "",
  buildingName: "",
  dayOfWeek: "Monday" as DayOfWeek,
  startTime: "08:00",
  endTime: "10:00",
  room: "",
};

export default function TimetableManager({ isOpen, onClose, onGetDirections, userLocation }: TimetableManagerProps) {
  const [entries, setEntries] = useState<ClassEntry[]>([]);
  const [form, setForm] = useState(BLANK_ENTRY);
  const [activeDay, setActiveDay] = useState<DayOfWeek | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setEntries(loadTimetable());
  }, []);

  const filteredEntries = entries.filter(
    (e) => activeDay === "All" || e.dayOfWeek === activeDay
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const addEntry = () => {
    if (!form.subjectName.trim()) return setFormError("Subject name is required.");
    if (!form.buildingName) return setFormError("Please select a building.");
    if (form.startTime >= form.endTime) return setFormError("End time must be after start time.");

    const building = CAMPUS_BUILDINGS.find((b) => b.Building === form.buildingName);
    if (!building) return setFormError("Building not found.");

    const newEntry: ClassEntry = {
      id: crypto.randomUUID(),
      subjectName: form.subjectName.trim(),
      buildingName: form.buildingName,
      lat: building.Latitude,
      lng: building.Longitude,
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      room: form.room.trim() || undefined,
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    saveTimetable(updated);
    setForm(BLANK_ENTRY);
    setShowForm(false);
    setFormError("");
  };

  const removeEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveTimetable(updated);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[3500]" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="My Timetable"
        className="fixed top-0 right-0 bottom-0 z-[3600] w-full max-w-[420px] bg-[#13151f]/98 backdrop-blur-2xl border-l border-white/[0.07] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-bold text-base">My Timetable</h2>
            <p className="text-gray-500 text-xs mt-0.5">{entries.length} class{entries.length !== 1 ? "es" : ""} scheduled</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.07] transition-all" aria-label="Close timetable">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Day filter tabs */}
        <div className="flex gap-1.5 px-5 py-3 overflow-x-auto no-scrollbar shrink-0 border-b border-white/[0.05]">
          {(["All", ...DAYS_OF_WEEK] as const).map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeDay === d
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              {d === "All" ? "All Days" : d.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Entries list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 custom-scrollbar">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">No classes yet</p>
              <p className="text-gray-600 text-xs mt-1">Add your first class below</p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const minsLeft = minutesUntilClass(entry);
              const isUpcoming = minsLeft >= 0 && minsLeft <= 20;
              const walkMins = userLocation ? walkingMinutes(userLocation[0], userLocation[1], entry.lat, entry.lng) : null;

              return (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isUpcoming
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "bg-white/[0.03] border-white/[0.06]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{entry.subjectName}</p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {entry.buildingName}{entry.room ? ` · Room ${entry.room}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="p-1 rounded-lg text-gray-600 hover:text-red-400 transition-colors shrink-0"
                      aria-label={`Remove ${entry.subjectName}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400">
                        {entry.dayOfWeek.slice(0, 3)}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {formatTime12h(entry.startTime)} – {formatTime12h(entry.endTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUpcoming && (
                        <span className="text-[10px] font-bold text-blue-400 animate-pulse">
                          {minsLeft}m away{walkMins ? ` · ${walkMins}m walk` : ""}
                        </span>
                      )}
                      <button
                        onClick={() => onGetDirections(entry.lat, entry.lng)}
                        className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-all"
                        aria-label={`Directions to ${entry.buildingName}`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add class form */}
        <div className="border-t border-white/[0.07] px-5 py-4 shrink-0">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.12] text-gray-500 hover:text-white hover:border-white/20 transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Class
            </button>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">New Class</p>

              <input
                type="text"
                placeholder="Subject name (e.g. Algorithms)"
                value={form.subjectName}
                onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/40"
              />

              <select
                value={form.buildingName}
                onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
                className="w-full bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500/40"
              >
                <option value="">Select building…</option>
                {CAMPUS_BUILDINGS.map((b) => (
                  <option key={b.Building} value={b.Building}>{b.Building}</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={form.dayOfWeek}
                  onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value as DayOfWeek })}
                  className="bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Room (optional)"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  className="bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Start</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500/40" />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1">End</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500/40" />
                </div>
              </div>

              {formError && <p className="text-red-400 text-[11px] font-semibold">{formError}</p>}

              <div className="flex gap-2">
                <button onClick={() => { setShowForm(false); setFormError(""); }}
                  className="flex-1 py-2 rounded-xl border border-white/[0.08] text-gray-400 text-xs font-semibold hover:bg-white/[0.04] transition-all">
                  Cancel
                </button>
                <button onClick={addEntry}
                  className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold transition-all">
                  Add Class
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
