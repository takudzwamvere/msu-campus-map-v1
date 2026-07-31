"use client";

import { useState, useEffect } from "react";
import { submitBuildingContribution, type BuildingContribution } from "@/lib/supabase";

interface ContributionFormProps {
  buildingName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (contribution: BuildingContribution) => void;
}

export default function ContributionForm({
  buildingName,
  isOpen,
  onClose,
  onSubmitted,
}: ContributionFormProps) {
  const [type, setType] = useState<BuildingContribution["contribution_type"]>("note");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please enter details for your contribution.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitBuildingContribution({
        building_name: buildingName,
        contributor_name: name.trim() || "Anonymous Student",
        contribution_type: type,
        content: content.trim(),
      });
      onSubmitted(result);
      setContent("");
      setName("");
      onClose();
    } catch {
      setError("Failed to submit contribution. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000]" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-label={`Contribute info for ${buildingName}`}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3100] w-[calc(100%-32px)] max-w-md bg-[#13151f]/98 backdrop-blur-2xl border border-white/[0.10] rounded-2xl shadow-2xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-base font-bold">Contribute Info</h3>
            <p className="text-gray-400 text-xs mt-0.5">{buildingName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.07] transition-all"
            aria-label="Close form"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
              Type of Info
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as BuildingContribution["contribution_type"])}
              className="w-full bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500/40"
            >
              <option value="note">Study Tip / General Note</option>
              <option value="hours">Updated Opening Hours</option>
              <option value="capacity">Capacity / Peak Crowd Alert</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Details
              </label>
              <span className={`text-[10px] font-mono ${content.length > 280 ? "text-amber-400" : "text-gray-500"}`}>
                {content.length}/300
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              placeholder="e.g. Quiet study spots on 2nd floor near sockets..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/40 resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
              Your Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Anonymous Student"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/40"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-gray-400 text-xs font-semibold hover:bg-white/[0.04] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? "Submitting..." : "Submit Contribution"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
