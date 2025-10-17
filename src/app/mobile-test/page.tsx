'use client';

import { useEffect } from 'react';
import { forceMobileMode } from '@/hooks/use-mobile-detection';
import MobileHomePage from '../mobile-home';

export default function MobileTestPage() {
  useEffect(() => {
    // Force mobile mode when this page loads
    forceMobileMode();
  }, []);

  return <MobileHomePage />;
}
