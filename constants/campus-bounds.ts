export const CAMPUS_BOUNDS = {
  minLat: -19.525414674850833,
  maxLat: -19.507078465507732,
  minLng: 29.82276282383294,
  maxLng: 29.846761174571597,
} as const;

export const CAMPUS_BOUNDS_ARRAY: [[number, number], [number, number]] = [
  [CAMPUS_BOUNDS.minLat, CAMPUS_BOUNDS.minLng],
  [CAMPUS_BOUNDS.maxLat, CAMPUS_BOUNDS.maxLng],
];

/** Approximate coordinates of the main front gate */
export const MAIN_GATE_COORDS: [number, number] = [-19.510271810936406, 29.841081806506132];

export const isWithinCampus = (lat: number, lng: number): boolean =>
  lat >= CAMPUS_BOUNDS.minLat &&
  lat <= CAMPUS_BOUNDS.maxLat &&
  lng >= CAMPUS_BOUNDS.minLng &&
  lng <= CAMPUS_BOUNDS.maxLng;
