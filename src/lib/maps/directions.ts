const DIRECTIONS_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

export interface DirectionsRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
}

export interface DirectionsLegSummary {
  distanceText: string;
  durationText: string;
  polyline?: string;
}

type CacheEntry = {
  timestamp: number;
  data: DirectionsLegSummary | null;
};

const cache = new Map<string, CacheEntry>();

function buildCacheKey({ origin, destination, mode }: DirectionsRequest) {
  return `${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}|${destination.lat.toFixed(6)},${destination.lng.toFixed(6)}|${mode ?? 'driving'}`;
}

export async function getDirections(request: DirectionsRequest): Promise<DirectionsLegSummary | null> {
  const key = buildCacheKey(request);
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < DIRECTIONS_CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const params = new URLSearchParams({
      originLat: request.origin.lat.toString(),
      originLng: request.origin.lng.toString(),
      destLat: request.destination.lat.toString(),
      destLng: request.destination.lng.toString(),
      mode: request.mode ?? 'driving',
    });

    const response = await fetch(`/api/directions?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      console.warn('Directions API error:', error);
      cache.set(key, { timestamp: Date.now(), data: null });
      return null;
    }

    const summary: DirectionsLegSummary = await response.json();

    cache.set(key, { timestamp: Date.now(), data: summary });

    return summary;
  } catch (error) {
    console.error('Failed to fetch directions:', error);
    cache.set(key, { timestamp: Date.now(), data: null });
    return null;
  }
}

export function clearDirectionsCache() {
  cache.clear();
}


