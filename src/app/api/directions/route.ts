import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const originLat = searchParams.get('originLat');
  const originLng = searchParams.get('originLng');
  const destLat = searchParams.get('destLat');
  const destLng = searchParams.get('destLng');
  const mode = searchParams.get('mode') || 'driving';

  if (!originLat || !originLng || !destLat || !destLng) {
    return NextResponse.json(
      { error: 'Missing required parameters: originLat, originLng, destLat, destLng' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key not configured' },
      { status: 500 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=${mode}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      return NextResponse.json(
        { error: `Directions API error: ${data.status}`, details: data.error_message },
        { status: 400 }
      );
    }

    const route = data.routes[0];
    const leg = route.legs?.[0];

    if (!leg) {
      return NextResponse.json(
        { error: 'No route leg found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      distanceText: leg.distance?.text ?? '',
      distanceValue: leg.distance?.value ?? 0,
      durationText: leg.duration?.text ?? '',
      durationValue: leg.duration?.value ?? 0,
      polyline: route.overview_polyline?.points ?? null,
    });
  } catch (error) {
    console.error('Directions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch directions' },
      { status: 500 }
    );
  }
}

