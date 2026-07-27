"use client";

import { useEffect, useState, useRef } from "react";
import { getBuildingExtras } from "@/constants/building-extras";
import { getTypeStyles } from "@/constants/campus-styles";
import type { CampusBuilding } from "@/constants/campus-data";
import { fetchBuildingContributions, type BuildingContribution } from "@/lib/supabase";
import ContributionForm from "./ContributionForm";

interface BuildingDetailPanelProps {
  building: CampusBuilding | null;
  onClose: () => void;
  onGetDirections: (lat: number, lng: number) => void;
}

function AmenityChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] text-xs text-gray-300 font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400/70 shrink-0" />
      {label}
    </span>
  );
}

function SkeletonLine({ width = "w-full", height = "h-3" }: { width?: string; height?: string }) {
  return <div className={`${width} ${height} rounded-full bg-white/[0.06] animate-pulse`} />;
}

export default function BuildingDetailPanel({
  building,
  onClose,
  onGetDirections,
}: BuildingDetailPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<BuildingContribution[]>([]);
  const [showContribForm, setShowContribForm] = useState(false);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  // Load contributions
  useEffect(() => {
    if (building) {
      setLoading(true);
      setIsVisible(true);
      fetchBuildingContributions(building.Building).then((data) => {
        setContributions(data);
        setLoading(false);
      });
    } else {
      setIsVisible(false);
    }
  }, [building]);

  const handleUpvote = (id: string) => {
    if (votedIds.has(id)) return;
    setVotedIds((prev) => new Set(prev).add(id));
    setContributions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!building) return null;

  const extras = getBuildingExtras(building.Building);
  const typeStyle = getTypeStyles(building.Type || "Unknown");

  const capacityPercent = extras.capacity
    ? Math.min(100, Math.round((extras.capacity / 800) * 100))
    : null;

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[2800] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label={`${building.Building} details`}
        aria-modal="true"
        className={`
          fixed z-[2900] bg-[#13151f]/98 backdrop-blur-2xl border-white/[0.08] shadow-2xl shadow-black/60
          transition-transform duration-300 ease-out
          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 border-t rounded-t-3xl max-h-[85dvh] overflow-y-auto
          /* Desktop: right sidebar */
          md:top-0 md:right-0 md:bottom-0 md:left-auto md:w-[380px] md:border-l md:border-t-0 md:rounded-none md:max-h-full
          ${isVisible
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
          }
        `}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="px-5 pt-4 md:pt-6 pb-4 border-b border-white/[0.07] flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {loading ? (
              <>
                <SkeletonLine width="w-2/3" height="h-5" />
                <div className="mt-2"><SkeletonLine width="w-1/3" height="h-3" /></div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white leading-tight">{building.Building}</h2>
                <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${typeStyle.bg} ${typeStyle.color}`}>
                  {building.Type || "Building"}
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.07] transition-all shrink-0 mt-0.5"
            aria-label="Close building details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="px-5 py-5 space-y-6">

          {/* Description */}
          {loading ? (
            <div className="space-y-2">
              <SkeletonLine />
              <SkeletonLine width="w-3/4" />
            </div>
          ) : building.Description ? (
            <p className="text-sm text-gray-400 leading-relaxed">{building.Description}</p>
          ) : null}

          {/* Hours */}
          {loading ? (
            <div className="space-y-2">
              <SkeletonLine width="w-1/4" height="h-2.5" />
              <SkeletonLine width="w-3/4" />
            </div>
          ) : extras.hours ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Opening Hours</p>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{extras.hours}</p>
              </div>
            </div>
          ) : null}

          {/* Capacity bar */}
          {!loading && capacityPercent !== null && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Capacity</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-400 shrink-0">{extras.capacity?.toLocaleString()} people</span>
              </div>
            </div>
          )}

          {/* Amenities */}
          {loading ? (
            <div className="flex gap-2 flex-wrap">
              {[...Array(3)].map((_, i) => <SkeletonLine key={i} width="w-20" height="h-6" />)}
            </div>
          ) : extras.amenities && extras.amenities.length > 0 ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2.5">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {extras.amenities.map((a) => <AmenityChip key={a} label={a} />)}
              </div>
            </div>
          ) : null}

          {/* Tags row: WiFi, Accessible, Floors */}
          {!loading && (extras.hasWifi !== undefined || extras.accessible !== undefined || extras.floors) && (
            <div className="flex flex-wrap gap-2">
              {extras.hasWifi && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-semibold">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                  Wi-Fi
                </span>
              )}
              {extras.accessible && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300 font-semibold">
                  ♿ Accessible
                </span>
              )}
              {extras.floors && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-gray-400 font-semibold">
                  {extras.floors} floor{extras.floors > 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}

          {/* Admin note */}
          {!loading && extras.adminNote && (
            <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 flex gap-2.5">
              <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-amber-200/80 leading-relaxed">{extras.adminNote}</p>
            </div>
          )}

          {/* Community Contributions */}
          {!loading && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Student Contributions</p>
                <button
                  onClick={() => setShowContribForm(true)}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add Info
                </button>
              </div>

              {contributions.length === 0 ? (
                <p className="text-xs text-gray-600 italic">No community tips yet. Be the first to contribute!</p>
              ) : (
                <div className="space-y-2">
                  {contributions.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-gray-400 text-[11px]">
                        <span className="font-semibold text-gray-300">{c.contributor_name || "Anonymous"}</span>
                        <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06]">{c.contribution_type}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{c.content}</p>
                      <div className="flex items-center justify-end pt-1">
                        <button
                          onClick={() => handleUpvote(c.id)}
                          disabled={votedIds.has(c.id)}
                          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg border transition-all ${
                            votedIds.has(c.id)
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                              : "bg-white/[0.04] text-gray-400 border-white/[0.06] hover:text-white"
                          }`}
                        >
                          👍 <span>{c.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {!loading && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Coordinates</p>
              <p className="text-xs text-gray-500 font-mono">
                {building.Latitude.toFixed(6)}, {building.Longitude.toFixed(6)}
              </p>
              {building.Campus && (
                <p className="text-xs text-gray-600 mt-0.5">{building.Campus} Campus</p>
              )}
            </div>
          )}
        </div>

        {/* Contribution Form Modal */}
        <ContributionForm
          buildingName={building.Building}
          isOpen={showContribForm}
          onClose={() => setShowContribForm(false)}
          onSubmitted={(newContrib) => setContributions((prev) => [newContrib, ...prev])}
        />

        {/* ── Footer CTA ─────────────────────────────────────────────────── */}
        <div className="sticky bottom-0 px-5 py-4 bg-[#13151f]/95 backdrop-blur-xl border-t border-white/[0.07]">
          <button
            onClick={() => onGetDirections(building.Latitude, building.Longitude)}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            aria-label={`Get directions to ${building.Building}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Get Directions
          </button>
        </div>
      </div>
    </>
  );
}
