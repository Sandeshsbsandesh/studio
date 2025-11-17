import { NextRequest, NextResponse } from 'next/server';

const DISTANCE_MATRIX_ENDPOINT = 'https://maps.googleapis.com/maps/api/distancematrix/json';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin, destinations } = body;

    if (!origin || !destinations || !Array.isArray(destinations)) {
      return NextResponse.json(
        { error: 'Invalid request. Origin and destinations are required.' },
        { status: 400 }
      );
    }

    // Use server-side API key (without referrer restrictions)
    // For backend APIs, we need a key without HTTP referrer restrictions
    const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAymJO_y2P7J8cmIISq1b8bfXu0Mibtc-Y';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }
    
    console.log('Using API key for Distance Matrix:', apiKey.substring(0, 10) + '...');

    // Build the request URL
    const encodedOrigin = `${origin.lat},${origin.lng}`;
    const encodedDestinations = destinations
      .map((dest: any) => `${dest.lat},${dest.lng}`)
      .join('|');

    const url = `${DISTANCE_MATRIX_ENDPOINT}?units=metric&origins=${encodeURIComponent(encodedOrigin)}&destinations=${encodeURIComponent(encodedDestinations)}&key=${apiKey}`;

    // Call Google Maps API from server-side (no CORS issues!)
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Distance Matrix API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Maps API Error:', {
        status: data.status,
        error_message: data.error_message,
      });
      
      return NextResponse.json(
        { 
          error: `Distance Matrix API error: ${data.status}`,
          details: data.error_message,
          help: data.status === 'REQUEST_DENIED' 
            ? 'Enable Distance Matrix API in Google Cloud Console and ensure billing is enabled'
            : 'Check Google Maps API configuration'
        },
        { status: 400 }
      );
    }

    // Transform the response to match our interface
    const values: Record<string, any> = {};

    data.rows[0]?.elements?.forEach((element: any, index: number) => {
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

    return NextResponse.json({ success: true, data: values });

  } catch (error) {
    console.error('Distance Matrix API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate distances' },
      { status: 500 }
    );
  }
}

