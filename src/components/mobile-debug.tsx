'use client';

import { useMobileDetection, forceMobileMode, disableMobileMode } from '@/hooks/use-mobile-detection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MobileDebug() {
  const { isMobile, isLoaded } = useMobileDetection();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-900">🔧 Mobile Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Loaded:</span>
            <span className={isLoaded ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {isLoaded ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mobile:</span>
            <span className={isMobile ? 'text-blue-600 font-semibold' : 'text-gray-600 font-semibold'}>
              {isMobile ? '📱 Yes' : '🖥️ No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Screen:</span>
            <span className="text-gray-600 font-mono text-xs">
              {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">User Agent:</span>
            <span className="text-gray-600 font-mono text-xs truncate max-w-40">
              {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 20) + '...' : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Capacitor:</span>
            <span className={typeof window !== 'undefined' && (window as any).Capacitor ? 'text-green-600 font-semibold' : 'text-gray-600'}>
              {typeof window !== 'undefined' && (window as any).Capacitor ? '✅ Native' : '🌐 Web'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={forceMobileMode}
            className="text-xs bg-blue-600 hover:bg-blue-700"
          >
            📱 Force Mobile
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={disableMobileMode}
            className="text-xs"
          >
            🖥️ Force Desktop
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          Check browser console for detailed mobile detection logs
        </div>
      </CardContent>
    </Card>
  );
}
