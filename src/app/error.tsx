'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [countdown, setCountdown] = useState(15);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoHome = () => {
    setIsRedirecting(true);
    window.location.href = '/';
  };

  const progressValue = ((15 - countdown) / 15) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="bg-red-100 p-6 rounded-full animate-pulse">
              <AlertTriangle className="w-24 h-24 text-red-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold text-red-600">
              😔 Oops! Something went wrong
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-md mx-auto">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working on fixing it.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {isRedirecting ? 'Redirecting to home...' : 'Redirecting to home in'}
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                  <span className="text-2xl font-bold text-blue-600">{countdown}</span>
                  <span className="text-sm text-gray-600 ml-1">sec</span>
                </div>
              </div>
            </div>
            <Progress value={progressValue} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              You'll be automatically redirected to continue using UrbanEzii
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleGoHome}
              size="lg"
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go to Home Now
            </Button>
            
            <Button
              onClick={reset}
              variant="outline"
              size="lg"
              className="flex-1 gap-2 border-2 hover:bg-gray-50"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </Button>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="pt-6 border-t">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Error Details (Development Mode)
              </p>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs font-mono text-red-600 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Help Information */}
          <div className="pt-6 border-t space-y-3 text-sm text-gray-600">
            <p className="font-semibold text-gray-700">What you can do:</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Try refreshing the page or clicking "Try Again"
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Return to home and navigate back to where you were
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              If the problem persists, contact our support team
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logo at bottom */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          Powered by <span className="font-semibold text-blue-600">UrbanEzii</span>
        </p>
      </div>
    </div>
  );
}

