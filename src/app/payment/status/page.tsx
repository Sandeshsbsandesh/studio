'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Home, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function PaymentStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(15);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get status from URL params - can be 'success', 'failed', or 'pending'
  const status = searchParams.get('status') || 'failed';
  const orderId = searchParams.get('order_id');
  const message = searchParams.get('message');

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRetry = () => {
    router.back();
  };

  const handleGoHome = () => {
    setIsRedirecting(true);
    router.push('/');
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-24 h-24 text-green-500" />,
          iconBg: 'bg-green-50',
          title: '🎉 Payment Successful!',
          description: 'Your booking has been confirmed. We\'ve sent you a confirmation email.',
          color: 'text-green-600',
          bgGradient: 'from-green-50 to-white',
          showRetry: false,
        };
      case 'pending':
        return {
          icon: <Clock className="w-24 h-24 text-yellow-500" />,
          iconBg: 'bg-yellow-50',
          title: '⏳ Payment Pending',
          description: 'Your payment is being processed. We\'ll notify you once it\'s confirmed.',
          color: 'text-yellow-600',
          bgGradient: 'from-yellow-50 to-white',
          showRetry: false,
        };
      default: // failed
        return {
          icon: <XCircle className="w-24 h-24 text-red-500" />,
          iconBg: 'bg-red-50',
          title: '❌ Payment Failed',
          description: message || 'Your payment could not be processed. Please try again or use a different payment method.',
          color: 'text-red-600',
          bgGradient: 'from-red-50 to-white',
          showRetry: true,
        };
    }
  };

  const config = getStatusConfig();
  const progressValue = ((15 - countdown) / 15) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4`}>
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className={`${config.iconBg} p-6 rounded-full`}>
              {config.icon}
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className={`text-4xl font-bold ${config.color}`}>
              {config.title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-md mx-auto">
              {config.description}
            </CardDescription>
          </div>

          {orderId && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900 mt-1">
                {orderId}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {isRedirecting ? 'Redirecting...' : 'Redirecting to home in'}
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                  <span className="text-2xl font-bold text-blue-600">{countdown}</span>
                  <span className="text-sm text-gray-600 ml-1">sec</span>
                </div>
              </div>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleGoHome}
              size="lg"
              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </Button>
            
            {config.showRetry && (
              <Button
                onClick={handleRetry}
                variant="outline"
                size="lg"
                className="flex-1 gap-2 border-2 hover:bg-gray-50"
              >
                <RefreshCcw className="w-5 h-5" />
                Retry Payment
              </Button>
            )}
          </div>

          {/* Additional Information */}
          <div className="pt-6 border-t space-y-3 text-sm text-gray-600">
            {status === 'success' && (
              <>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Your booking details have been sent to your email
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Service provider will contact you shortly
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Check "My Bookings" for more details
                </p>
              </>
            )}
            
            {status === 'failed' && (
              <>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  No amount has been deducted from your account
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  You can try again with the same or different payment method
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Need help? Contact our support team
                </p>
              </>
            )}
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

