const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress?: string;
  placeId?: string;
}

export async function getGeocodeFromAddress(address: string): Promise<GeocodeResult | null> {
  if (!address) {
    throw new Error('Address is required to perform geocoding.');
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set; skipping geocoding.');
    return null;
  }

  const url = `${GEOCODE_ENDPOINT}?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Geocode API request failed: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.status !== 'OK' || !Array.isArray(json.results) || json.results.length === 0) {
    console.warn(`Geocode API returned status ${json.status}.`, json.error_message);
    return null;
  }

  const result = json.results[0];
  const location = result.geometry?.location;

  if (!location) {
    return null;
  }

  return {
    lat: location.lat,
    lng: location.lng,
    formattedAddress: result.formatted_address,
    placeId: result.place_id,
  };
}


