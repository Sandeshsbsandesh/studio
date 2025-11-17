const DISTANCE_MATRIX_ENDPOINT = 'https://maps.googleapis.com/maps/api/distancematrix/json';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_DESTINATIONS_PER_REQUEST = 25;

type LatLng = {
  lat: number;
  lng: number;
};

export interface DistanceMatrixDestination extends LatLng {
  id: string;
}

export interface DistanceMatrixValue {
  distanceText: string;
  distanceValue: number;
  durationText: string;
  durationValue: number;
}

type DistanceMatrixCacheEntry = {
  timestamp: number;
  data: Record<string, DistanceMatrixValue>;
};

const cache = new Map<string, DistanceMatrixCacheEntry>();

function buildCacheKey(origin: LatLng, destinations: DistanceMatrixDestination[]) {
  const originKey = `${origin.lat.toFixed(6)},${origin.lng.toFixed(6)}`;
  const destinationsKey = destinations
    .map((destination) => `${destination.lat.toFixed(6)},${destination.lng.toFixed(6)}`)
    .join('|');

  return `${originKey}|${destinationsKey}`;
}

function isCacheEntryFresh(entry: DistanceMatrixCacheEntry) {
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

async function fetchDistanceMatrix(origin: LatLng, destinations: DistanceMatrixDestination[]) {
  // Call our backend API route instead of Google directly (avoids CORS issues)
  const response = await fetch('/api/distance-matrix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin,
      destinations,
    }),
  });

  if (!response.ok) {
    throw new Error(`Distance Matrix API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (!json.success || !json.data) {
    throw new Error(`Distance Matrix API error: ${json.error || 'Unknown error'}`);
  }

  const values = json.data;

  const cacheKey = buildCacheKey(origin, destinations);
  cache.set(cacheKey, {
    timestamp: Date.now(),
    data: values,
  });

  return values;
}

export async function getDistanceMatrix(origin: LatLng, destinations: DistanceMatrixDestination[]) {
  if (!origin || typeof origin.lat !== 'number' || typeof origin.lng !== 'number') {
    throw new Error('Origin must include numeric lat and lng.');
  }

  const validDestinations = destinations.filter(
    (destination) => typeof destination.lat === 'number' && typeof destination.lng === 'number'
  );

  if (validDestinations.length === 0) {
    return {};
  }

  const cacheKey = buildCacheKey(origin, validDestinations);
  const cached = cache.get(cacheKey);

  if (cached && isCacheEntryFresh(cached)) {
    return cached.data;
  }

  if (validDestinations.length <= MAX_DESTINATIONS_PER_REQUEST) {
    return fetchDistanceMatrix(origin, validDestinations);
  }

  // Batch requests if we exceed the per-request quota
  const batchedResults: Record<string, DistanceMatrixValue> = {};

  for (let i = 0; i < validDestinations.length; i += MAX_DESTINATIONS_PER_REQUEST) {
    const batch = validDestinations.slice(i, i + MAX_DESTINATIONS_PER_REQUEST);
    const batchResults = await fetchDistanceMatrix(origin, batch);
    Object.assign(batchedResults, batchResults);
  }

  const aggregatedKey = buildCacheKey(origin, validDestinations);
  cache.set(aggregatedKey, {
    timestamp: Date.now(),
    data: batchedResults,
  });

  return batchedResults;
}

export function clearDistanceMatrixCache() {
  cache.clear();
}


