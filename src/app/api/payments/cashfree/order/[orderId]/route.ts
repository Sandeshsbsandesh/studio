import { NextResponse } from 'next/server';
import { fetchCashfreeOrder } from '@/lib/cashfree';

interface RouteParams {
  orderId: string;
}

export async function GET(
  _request: Request,
  { params }: { params: RouteParams },
) {
  try {
    if (!params?.orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 },
      );
    }

    const order = await fetchCashfreeOrder(params.orderId);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Cashfree order lookup error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to fetch order details',
      },
      { status: 500 },
    );
  }
}

