export interface RouteFactor {
  type: string;
  message: string;
  impactDistanceKm: number;
  impactDurationMinutes: number;
}

export interface RouteEstimateResponse {
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  estimatedDistanceKm: number;
  estimatedDurationMinutes: number;
  metadata: {
    mode: 'fastest' | 'balanced' | 'safest';
    directDistanceKm: number;
    baseRoadFactor: number;
    averageSpeedKmh: number;
    avoidCheckpoints: boolean;
    avoidedAreasCount: number;
    nearbyCheckpointsCount: number;
    nearbyIncidentsCount: number;
    factors: RouteFactor[];
    summary: string;
  };
}
