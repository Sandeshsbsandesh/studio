'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MobileServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    icon: string;
    href: string;
    color: string;
    providers?: number;
    avgRating?: number;
    responseTime?: string;
  };
  index?: number;
}

export default function MobileServiceCard({ service, index = 0 }: MobileServiceCardProps) {
  const delay = index * 100; // Staggered animation delay

  return (
    <Link href={service.href}>
      <Card 
        className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 bg-white"
        style={{ 
          animationDelay: `${delay}ms`,
          animation: 'slideInUp 0.6s ease-out forwards',
          opacity: 0
        }}
      >
        <CardContent className="p-0">
          {/* Service Icon Background */}
          <div 
            className="relative h-24 bg-gradient-to-br from-gray-50 to-gray-100"
            style={{ backgroundColor: `${service.color}15` }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                style={{ backgroundColor: service.color }}
              >
                {service.icon}
              </div>
            </div>
            
            {/* Premium Badge */}
            {service.avgRating && service.avgRating > 4.5 && (
              <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
                ⭐ Premium
              </Badge>
            )}
          </div>

          {/* Service Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {service.name}
              </h3>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {service.description}
            </p>

            {/* Service Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                {service.providers && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{service.providers} providers</span>
                  </div>
                )}
                
                {service.avgRating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="font-medium">{service.avgRating}</span>
                  </div>
                )}
              </div>
              
              {service.responseTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{service.responseTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </CardContent>
      </Card>
    </Link>
  );
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
document.head.appendChild(style);
