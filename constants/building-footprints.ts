/**
 * building-footprints.ts
 * Approximate polygon footprints for major MSU buildings to enable CSS/SVG 3D extrusion rendering.
 */

export interface BuildingFootprint {
  name: string;
  heightMetres: number;
  color: string;
  polygon: [number, number][]; // [lat, lng] array
}

export const BUILDING_FOOTPRINTS: BuildingFootprint[] = [
  {
    name: "MSU Main Library",
    heightMetres: 16,
    color: "#3b82f6",
    polygon: [
      [-19.51310, 29.83570],
      [-19.51310, 29.83590],
      [-19.51330, 29.83590],
      [-19.51330, 29.83570],
    ],
  },
  {
    name: "ICT Complex",
    heightMetres: 12,
    color: "#10b981",
    polygon: [
      [-19.51270, 29.83630],
      [-19.51270, 29.83650],
      [-19.51290, 29.83650],
      [-19.51290, 29.83630],
    ],
  },
  {
    name: "Administration Block",
    heightMetres: 14,
    color: "#8b5cf6",
    polygon: [
      [-19.51340, 29.83540],
      [-19.51340, 29.83560],
      [-19.51360, 29.83560],
      [-19.51360, 29.83540],
    ],
  },
  {
    name: "Main Dining Hall",
    heightMetres: 10,
    color: "#ef4444",
    polygon: [
      [-19.51390, 29.83600],
      [-19.51390, 29.83620],
      [-19.51410, 29.83620],
      [-19.51410, 29.83600],
    ],
  },
  {
    name: "China A",
    heightMetres: 15,
    color: "#f59e0b",
    polygon: [
      [-19.51110, 29.83600],
      [-19.51110, 29.83620],
      [-19.51130, 29.83620],
      [-19.51130, 29.83600],
    ],
  },
];
