'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { services } from '@/lib/data';
import Link from 'next/link';
import { Star, Clock, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function MobileHomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {user ? `Welcome back, ${user.name}!` : 'Welcome to UrbanEzii'}
            </h2>
            <p className="text-white/90 text-sm">
              Find trusted local services at your fingertips
            </p>
          </div>
          <Sparkles className="w-8 h-8" />
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Shield className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs font-medium">Verified</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs font-medium">Quick</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1" />
            <div className="text-xs font-medium">Top Rated</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-purple-600 mb-1">{services.length}</div>
            <div className="text-sm text-purple-900/70">Services Available</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
          <CardContent className="p-4">
            <div className="text-3xl font-bold text-green-600 mb-1">4.8</div>
            <div className="text-sm text-green-900/70 flex items-center gap-1">
              <Star className="w-3 h-3 fill-green-600" />
              Average Rating
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">All Services</h3>
          <Badge variant="secondary" className="text-xs">
            {services.length} available
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => {
            const serviceId = service.href.split('/').pop();
            return (
              <Link key={service.href} href={service.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0 bg-white shadow-md">
                  <CardContent className="p-5">
                    <div className="text-center space-y-3">
                      {/* Icon */}
                      <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="text-blue-600">
                          {service.icon}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h4 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">
                        {service.title}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-medium">4.{Math.floor(Math.random() * 3) + 6}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-bold text-gray-900 mb-4 text-center">Why Choose UrbanEzii?</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">Verified Providers</div>
              <div className="text-xs text-gray-600 mt-1">Background checked professionals</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">Quick Response</div>
              <div className="text-xs text-gray-600 mt-1">Average 30 min response time</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">Top Rated</div>
              <div className="text-xs text-gray-600 mt-1">4.8+ average rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

