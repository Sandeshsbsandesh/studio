
'use client';

import { Icons } from './icons';

export default function UniqueLoader() {
  return (
    <div className="relative w-48 h-12 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2">
        <div
          className="absolute h-full bg-primary"
          style={{
            width: '100%',
            animation: 'loader-progress 2s linear infinite',
          }}
        />
      </div>
      <Icons.truck className="absolute top-0 h-12 w-12 text-primary" style={{ animation: 'truck-move 2s linear infinite' }} />
      <style jsx>{`
        @keyframes truck-move {
          0% {
            left: -48px;
          }
          100% {
            left: 100%;
          }
        }
        @keyframes loader-progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
