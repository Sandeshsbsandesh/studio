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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.');
  }

  const encodedOrigin = `${origin.lat},${origin.lng}`;
  const encodedDestinations = destinations
    .map((destination) => `${destination.lat},${destination.lng}`)
    .join('|');

  const url = `${DISTANCE_MATRIX_ENDPOINT}?units=metric&origins=${encodeURIComponent(encodedOrigin)}&destinations=${encodeURIComponent(encodedDestinations)}&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Distance Matrix API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.status !== 'OK') {
    throw new Error(`Distance Matrix API error: ${json.status} (${json.error_message || 'no message'})`);
  }

  const values: Record<string, DistanceMatrixValue> = {};

  json.rows[0]?.elements?.forEach((element: any, index: number) => {
    const destination = destinations[index];

    if (!destination || element.status !== 'OK') {
      return;
    }

    values[destination.id] = {
      distanceText: element.distance?.text ?? '',
      distanceValue: element.distance?.value ?? 0,
      durationText: element.duration?.text ?? '',
      durationValue: element.duration?.value ?? 0,
    };
  });

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


