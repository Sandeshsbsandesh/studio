
'use client';

import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo with elegant animations */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse-slow" />
          
          {/* Rotating ring */}
          <div className="absolute inset-0 -m-4">
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-primary/40 border-r-primary/40 animate-spin-slow" />
          </div>
          
          {/* Logo container with float animation */}
          <div className="relative bg-white rounded-full p-6 shadow-2xl animate-float">
            <Image
              src="/logo.png"
              alt="UrbanEzii"
              width={80}
              height={80}
              className="animate-fade-in"
              priority
            />
          </div>
        </div>

        {/* Loading text with elegant fade */}
        <div className="space-y-2 text-center animate-fade-in-delayed">
          <h2 className="text-2xl font-bold font-headline bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            UrbanEzii
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce-1" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce-2" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce-3" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your experience...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-delayed {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          60% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-1 {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-2 {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-3 {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in-delayed 1s ease-out forwards;
        }

        .animate-bounce-1 {
          animation: bounce-1 1.4s infinite;
          animation-delay: 0s;
        }

        .animate-bounce-2 {
          animation: bounce-2 1.4s infinite;
          animation-delay: 0.2s;
        }

        .animate-bounce-3 {
          animation: bounce-3 1.4s infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  )
}
