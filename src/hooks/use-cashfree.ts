'use client';

import * as React from 'react';

type CashfreeMode = 'sandbox' | 'production';

const SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
const SCRIPT_ATTR = 'data-cashfree-sdk';

function instantiateCashfree(
  mode: CashfreeMode,
): { checkout: (options: unknown) => Promise<any> } | null {
  const cashfreeGlobal = (window as any).Cashfree;

  if (!cashfreeGlobal) {
    return null;
  }

  try {
    if (typeof cashfreeGlobal === 'function') {
      try {
        const constructed = new cashfreeGlobal({ mode });
        if (constructed?.checkout) {
          return constructed;
        }
        return constructed ?? null;
      } catch (error) {
        const invoked = (cashfreeGlobal as any)({ mode });
        if (invoked?.checkout) {
          return invoked;
        }
        return invoked ?? null;
      }
    }

    if (
      typeof cashfreeGlobal === 'object' &&
      cashfreeGlobal !== null &&
      typeof (cashfreeGlobal as any).Checkout === 'function'
    ) {
      const checkoutInstance = (cashfreeGlobal as any).Checkout({ mode });
      if (checkoutInstance?.checkout) {
        return checkoutInstance;
      }
      return checkoutInstance ?? null;
    }
  } catch (error) {
    console.error('Failed to initialise Cashfree SDK:', error);
    return null;
  }

  return null;
}

export function useCashfree(mode: CashfreeMode = 'sandbox') {
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const instanceRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (instanceRef.current?.checkout) {
      setIsReady(true);
      setError(null);
      return;
    }

    let isMounted = true;

    const initialise = () => {
      const instance = instantiateCashfree(mode);

      if (instance) {
        instanceRef.current = instance;
        if (isMounted) {
          setIsReady(true);
          setError(null);
        }
      } else {
        if (isMounted) {
          setError(new Error('Cashfree SDK unavailable.'));
        }
      }
    };

    if ((window as any).Cashfree) {
      initialise();
      return;
    }

    const ensureScript = () =>
      new Promise<void>((resolve, reject) => {
        const handleLoad = () => resolve();
        const handleError = () =>
          reject(new Error('Failed to load Cashfree SDK script.'));

        const existingScript =
          document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`);

        if (existingScript) {
          if (existingScript.dataset.cashfreeLoaded === 'true') {
            resolve();
            return;
          }
          existingScript.addEventListener('load', handleLoad, { once: true });
          existingScript.addEventListener('error', handleError, { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = SDK_URL;
        script.async = true;
        script.type = 'text/javascript';
        script.setAttribute(SCRIPT_ATTR, 'true');
        script.addEventListener('load', () => {
          script.dataset.cashfreeLoaded = 'true';
          handleLoad();
        });
        script.addEventListener('error', handleError);
        document.body.appendChild(script);
      });

    ensureScript()
      .then(() => initialise())
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [mode]);

  const checkout = React.useCallback(
    async (options: { paymentSessionId: string; returnUrl?: string; redirectTarget?: '_self' | '_blank' }) => {
      if (!instanceRef.current?.checkout) {
        throw new Error('Cashfree SDK not ready yet.');
      }

      return instanceRef.current.checkout({
        paymentSessionId: options.paymentSessionId,
        redirectTarget: options.redirectTarget ?? '_self',
        returnUrl: options.returnUrl,
      });
    },
    [],
  );

  return {
    isReady,
    error,
    checkout,
    mode,
  };
}
