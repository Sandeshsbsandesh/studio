'use client';

import { Card } from '@/components/ui/card';
import { services } from '@/lib/data';
import Link from 'next/link';
import { Star, MapPin, TrendingUp, Shield, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

export default function NativeMobileHome() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-3xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-blue-100 text-sm font-medium mb-1">
                {user ? `Hello, ${user.name.split(' ')[0]}! 👋` : 'Welcome! 👋'}
              </p>
              <h2 className="text-white text-2xl font-bold mb-2">
                Find Services Near You
              </h2>
              <p className="text-blue-100 text-sm">
                Trusted professionals at your fingertips
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
              <div className="text-white text-2xl font-bold">{services.length}</div>
              <div className="text-blue-100 text-xs mt-1">Services</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
              <div className="text-white text-2xl font-bold">4.8</div>
              <div className="text-blue-100 text-xs mt-1 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                Rating
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center">
              <div className="text-white text-2xl font-bold">30m</div>
              <div className="text-blue-100 text-xs mt-1">Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center px-4 py-3">
          <input
            type="text"
            placeholder="Search services..."
            className="flex-1 outline-none text-gray-900 placeholder-gray-500"
          />
          <button className="p-2 bg-blue-600 rounded-xl ml-2">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">All Services</h3>
          <button className="text-blue-600 text-sm font-medium">View All</button>
        </div>

        {/* Services Grid - Native Card Style */}
        <div className="space-y-3">
          {services.map((service, index) => {
            const serviceId = service.href.split('/').pop();
            return (
              <Link key={service.href} href={service.href}>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-all duration-200">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <div className="text-blue-600 scale-125">
                        {service.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-base mb-1">
                        {service.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-1">
                        {service.description}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-xs font-medium">4.{Math.floor(Math.random() * 3) + 6}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">30 min</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-4 pb-8">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-6 border border-green-100">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Why Choose Us?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm mb-0.5">
                  Verified Professionals
                </div>
                <div className="text-gray-600 text-xs">
                  All providers are background-checked
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm mb-0.5">
                  Quick Response
                </div>
                <div className="text-gray-600 text-xs">
                  Average 30 min response time
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm mb-0.5">
                  Top Rated
                </div>
                <div className="text-gray-600 text-xs">
                  4.8+ average rating across all services
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

