/**
 * supabase.ts
 * Supabase client setup & mock fallback data layer when keys are missing.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock storage for offline/stub mode
export interface BuildingContribution {
  id: string;
  building_name: string;
  contributor_name?: string;
  contribution_type: "hours" | "note" | "capacity" | "photo";
  content: string;
  approved: boolean;
  upvotes: number;
  created_at: string;
}

const MOCK_CONTRIBUTIONS: BuildingContribution[] = [
  {
    id: "c1",
    building_name: "MSU Main Library",
    contributor_name: "Tafadzwa M.",
    contribution_type: "note",
    content: "2nd floor quiet room has extra power outlets near the east windows.",
    approved: true,
    upvotes: 14,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "c2",
    building_name: "ICT Complex",
    contributor_name: "Kudzai C.",
    contribution_type: "hours",
    content: "Lab 3 stays open until 22:00 during exam week.",
    approved: true,
    upvotes: 8,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "c3",
    building_name: "Main Dining Hall",
    contributor_name: "Anonymous Student",
    contribution_type: "capacity",
    content: "Lines are longest between 12:15 PM and 1:00 PM.",
    approved: true,
    upvotes: 21,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export async function fetchBuildingContributions(buildingName: string): Promise<BuildingContribution[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("building_contributions")
      .select("*")
      .eq("building_name", buildingName)
      .eq("approved", true)
      .order("upvotes", { ascending: false });
    if (!error && data) return data as BuildingContribution[];
  }

  // Fallback mock
  return MOCK_CONTRIBUTIONS.filter(
    (c) => c.building_name.toLowerCase() === buildingName.toLowerCase() && c.approved
  );
}

export async function submitBuildingContribution(
  contribution: Omit<BuildingContribution, "id" | "approved" | "upvotes" | "created_at">
): Promise<BuildingContribution> {
  const newRecord: BuildingContribution = {
    ...contribution,
    id: "contrib-" + Math.random().toString(36).slice(2, 9),
    approved: true, // auto-approve in mock mode for instant feedback
    upvotes: 1,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase
      .from("building_contributions")
      .insert({ ...contribution, approved: false })
      .select()
      .single();
    if (!error && data) return data as BuildingContribution;
  }

  MOCK_CONTRIBUTIONS.push(newRecord);
  return newRecord;
}
