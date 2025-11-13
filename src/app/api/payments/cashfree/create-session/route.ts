import { NextResponse } from 'next/server';
import {
  CashfreeCustomerDetails,
  createCashfreeOrder,
} from '@/lib/cashfree';

interface CreateSessionRequestBody {
  amount: number;
  currency?: string;
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  orderId?: string;
  orderNote?: string;
  metadata?: Record<string, unknown>;
}

function normalizeAmount(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export async function POST(request: Request) {
  const envDebug = {
    mode: process.env.CASHFREE_MODE,
    publicMode: process.env.NEXT_PUBLIC_CASHFREE_MODE,
    idPresent: Boolean(process.env.CASHFREE_CLIENT_ID),
    idLength: process.env.CASHFREE_CLIENT_ID?.length,
    secretPresent: Boolean(process.env.CASHFREE_CLIENT_SECRET),
    secretLength: process.env.CASHFREE_CLIENT_SECRET?.length,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('CASHFREE')),
  };
  console.log('Cashfree env snapshot', envDebug);
  try {
    const body = (await request.json()) as CreateSessionRequestBody;
    const amount = normalizeAmount(body?.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'A valid payment amount is required.',
        },
        { status: 400 },
      );
    }

    const customerDetails: CashfreeCustomerDetails = {
      customer_id:
        body.customer?.id ??
        `guest_${Date.now().toString(36)}`,
      customer_name: body.customer?.name ?? 'Guest Customer',
      customer_email: body.customer?.email,
      customer_phone: body.customer?.phone,
    };

    const orderResponse = await createCashfreeOrder({
      orderId: body.orderId,
      orderAmount: amount,
      currency: body.currency ?? 'INR',
      orderNote: body.orderNote,
      customerDetails,
      metadata: {
        integration: 'urbanezii_custom_ui',
        source: 'web_app',
        ...(body.metadata ?? {}),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: orderResponse.order_id,
      paymentSessionId: orderResponse.payment_session_id,
      orderStatus: orderResponse.order_status,
      amount: orderResponse.order_amount,
      currency: orderResponse.order_currency,
      raw: orderResponse,
    });
  } catch (error) {
    console.error('Cashfree create-session error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to create payment session',
        debug: envDebug,
      },
      { status: 500 },
    );
  }
}

