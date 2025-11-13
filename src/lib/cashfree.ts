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
  // Hardcoded production credentials as fallback
  const PROD_CLIENT_ID = '11270314dfdaa6dd018914c7fe51307211';
  const PROD_CLIENT_SECRET = 'cfsk_ma_prod_c254882c2479429b257f1b7128fbf5ad_2854078d';

  const resolvedClientId =
    process.env.CASHFREE_CLIENT_ID ??
    process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID ??
    PROD_CLIENT_ID;

  const resolvedClientSecret =
    process.env.CASHFREE_CLIENT_SECRET ??
    PROD_CLIENT_SECRET;

  // Check if we're using hardcoded production credentials
  const usingHardcodedProdCredentials = 
    resolvedClientId === PROD_CLIENT_ID && 
    resolvedClientSecret === PROD_CLIENT_SECRET;

  // If using hardcoded production credentials, FORCE production mode
  // Otherwise, use the environment variable or default to production
  const mode = usingHardcodedProdCredentials
    ? 'production'
    : normalizeMode(
        process.env.CASHFREE_MODE ??
          process.env.NEXT_PUBLIC_CASHFREE_MODE ??
          'production',
      );

  console.log('[getCashfreeCredentials] Using credentials:', {
    mode,
    source: process.env.CASHFREE_CLIENT_ID ? 'environment' : 'hardcoded',
    forcedProduction: usingHardcodedProdCredentials,
  });

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

  console.log('[createCashfreeOrder] Request URL:', `${baseUrl}/orders`);
  console.log('[createCashfreeOrder] Request payload:', JSON.stringify(payload, null, 2));
  console.log('[createCashfreeOrder] Using credentials:', {
    clientId,
    mode: baseUrl.includes('sandbox') ? 'sandbox' : 'production',
    apiVersion,
  });

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

  console.log('[createCashfreeOrder] Response status:', response.status);
  console.log('[createCashfreeOrder] Response data:', JSON.stringify(data, null, 2));

  if (!response.ok) {
    const errorMessage =
      data?.message ??
      data?.['error']?.toString() ??
      'Failed to create Cashfree order';
    throw new Error(errorMessage);
  }

  // Verify payment_session_id is present
  if (!data.payment_session_id) {
    console.error('[createCashfreeOrder] WARNING: payment_session_id is missing from response!');
    console.error('[createCashfreeOrder] Full response:', data);
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

