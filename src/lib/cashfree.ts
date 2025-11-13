interface CashfreeCredentials {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'production';
  baseUrl: string;
  apiVersion: string;
}

export interface CashfreeCustomerDetails {
  customer_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
}

export interface CreateCashfreeOrderInput {
  orderId?: string;
  orderAmount: number;
  currency?: string;
  orderNote?: string;
  customerDetails: CashfreeCustomerDetails;
  metadata?: Record<string, unknown>;
}

export interface CashfreeOrderResponse {
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  payment_session_id?: string;
  cf_order_id?: string;
  cf_payment_id?: string;
  [key: string]: unknown;
}

const FALLBACK_CLIENT_ID = 'cf_client_id_placeholder';
const FALLBACK_CLIENT_SECRET = 'cf_client_secret_placeholder';
const FALLBACK_MODE = 'production';
const FALLBACK_API_VERSION = '2022-09-01';

const BASE_URLS: Record<'sandbox' | 'production', string> = {
  sandbox: 'https://sandbox.cashfree.com/pg',
  production: 'https://api.cashfree.com/pg',
};

function normalizeMode(mode?: string | null): 'sandbox' | 'production' {
  const normalized = mode?.toLowerCase();
  return normalized === 'sandbox' ? 'sandbox' : 'production';
}

export async function getCashfreeCredentials(): Promise<CashfreeCredentials> {
  const mode = normalizeMode(
    process.env.CASHFREE_MODE ??
      process.env.NEXT_PUBLIC_CASHFREE_MODE ??
      FALLBACK_MODE,
  );

  const resolvedClientId =
    process.env.CASHFREE_CLIENT_ID ??
    process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID ??
    '';

  const resolvedClientSecret =
    process.env.CASHFREE_CLIENT_SECRET ??
    '';

  if (
    !resolvedClientId ||
    resolvedClientId === FALLBACK_CLIENT_ID ||
    !resolvedClientSecret ||
    resolvedClientSecret === FALLBACK_CLIENT_SECRET
  ) {
    throw new Error(
      'Cashfree credentials missing. Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET for the current environment.',
    );
  }

  const apiVersion =
    process.env.CASHFREE_API_VERSION ?? FALLBACK_API_VERSION;

  return {
    clientId: resolvedClientId,
    clientSecret: resolvedClientSecret,
    mode,
    apiVersion,
    baseUrl: process.env.CASHFREE_BASE_URL ?? BASE_URLS[mode],
  };
}

export function resolveOrderId(providedOrderId?: string) {
  if (providedOrderId) {
    return providedOrderId;
  }
  const timestamp = Date.now().toString(36);
  const randomSegment = Math.random().toString(36).substring(2, 8);
  return `order_${timestamp}_${randomSegment}`;
}

export async function createCashfreeOrder(
  input: CreateCashfreeOrderInput,
): Promise<CashfreeOrderResponse> {
  const { clientId, clientSecret, baseUrl, apiVersion } =
    await getCashfreeCredentials();

  const payload = {
    order_id: resolveOrderId(input.orderId),
    order_amount: Number(input.orderAmount.toFixed(2)),
    order_currency: input.currency ?? 'INR',
    order_note: input.orderNote ?? 'Service booking payment',
    customer_details: input.customerDetails,
    order_meta: input.metadata ?? {},
  };

  const response = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'x-client-id': clientId,
      'x-client-secret': clientSecret,
      'x-api-version': apiVersion,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as CashfreeOrderResponse & {
    message?: string;
  };

  if (!response.ok) {
    const errorMessage =
      data?.message ??
      data?.['error']?.toString() ??
      'Failed to create Cashfree order';
    throw new Error(errorMessage);
  }

  return data;
}

export async function fetchCashfreeOrder(
  orderId: string,
): Promise<CashfreeOrderResponse> {
  const { clientId, clientSecret, baseUrl, apiVersion } =
    await getCashfreeCredentials();

  const response = await fetch(`${baseUrl}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-client-id': clientId,
      'x-client-secret': clientSecret,
      'x-api-version': apiVersion,
    },
  });

  const data = (await response.json()) as CashfreeOrderResponse & {
    message?: string;
  };

  if (!response.ok) {
    const errorMessage =
      data?.message ??
      data?.['error']?.toString() ??
      'Failed to fetch Cashfree order';
    throw new Error(errorMessage);
  }

  return data;
}

