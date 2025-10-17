'use client';

import { useState, useEffect } from 'react';

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if running in Capacitor (native app) - HIGHEST PRIORITY
      const isCapacitor = !!(window as any).Capacitor;
      
      if (isCapacitor) {
        console.log('🚀 CAPACITOR DETECTED: Forcing mobile UI');
        setIsMobile(true);
        setIsLoaded(true);
        return;
      }
      
      // Force mobile for testing
      const forceMobile = window.location.search.includes('mobile=true') || 
                         localStorage.getItem('force-mobile') === 'true';
      
      if (forceMobile) {
        console.log('🚀 FORCE MOBILE: Enabled via URL parameter or localStorage');
        setIsMobile(true);
        setIsLoaded(true);
        return;
      }

      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check for mobile user agents
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUserAgent = mobileRegex.test(userAgent);
      
      // Check for touch capability
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Check screen size (mobile if width < 768px)
      const isSmallScreen = window.innerWidth < 768;
      
      // More aggressive mobile detection
      const mobile = isMobileUserAgent || isTouchDevice || isSmallScreen;
      
      console.log('🔍 Mobile Detection:', {
        userAgent,
        isMobileUserAgent,
        isTouchDevice,
        isSmallScreen,
        isCapacitor,
        finalResult: mobile,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      });
      
      setIsMobile(mobile);
      setIsLoaded(true);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, isLoaded };
}

// Helper function to force mobile mode for testing
export const forceMobileMode = () => {
  localStorage.setItem('force-mobile', 'true');
  window.location.reload();
};

// Helper function to disable mobile mode
export const disableMobileMode = () => {
  localStorage.removeItem('force-mobile');
  window.location.reload();
};
