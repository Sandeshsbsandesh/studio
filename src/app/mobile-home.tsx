'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  MapPin,
  Bell,
  Menu,
  ChevronDown,
  User,
  Star,
  Clock,
  Shield,
  ArrowRight,
  Zap,
  TrendingUp,
  Plus,
  Home,
  Grid3X3,
  Bot,
  Calendar
} from 'lucide-react';
import { services as allServices } from '@/lib/data';

// Convert your services to mobile format
const services = allServices.map((service, index) => ({
  ...service,
  id: service.href.split('/').pop(),
  name: service.title,
  icon: getServiceIcon(service.title),
  color: getServiceColor(index),
  providers: Math.floor(Math.random() * 20) + 10,
  avgRating: 4.5 + Math.random() * 0.4,
  responseTime: index % 2 === 0 ? '30 min' : '1 hour'
}));

function getServiceIcon(title: string) {
  const icons: Record<string, string> = {
    'Water Can Delivery': '💧',
    'House Maids': '🧹',
    'Electricians': '⚡',
    'Plumbers': '🔧',
    'Doctor on Call': '🩺',
    'Cylinder Delivery': '🔥',
    'Cleaners': '✨',
    'Personal Cooks': '👨‍🍳',
    'Local Buddy': '🤝',
    'Shifters & Movers': '🚚',
    'Painters': '🎨'
  };
  return icons[title] || '🛠️';
}

function getServiceColor(index: number) {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6'
  ];
  return colors[index % colors.length];
}

export default function MobileHomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Bangalore');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 animate-pulse" />
          <h2 className="text-lg font-semibold text-gray-900">UrbanEzii</h2>
          <p className="text-gray-600">Loading premium experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">UrbanEzii</h1>
                <p className="text-xs text-gray-600">Your City, Simplified</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Search */}
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-white/80">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">{selectedLocation}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for services..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Find Trusted Local Services</h2>
          <p className="text-white/90 text-sm mb-4">Welcome to UrbanEzii, your local service bridge. Discover, book, and manage verified professionals.</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Quick Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">All Services</h3>
          <Badge variant="secondary" className="text-xs">
            {services.length} services
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <Link key={service.id} href={service.href}>
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-100/50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl mb-3 transform hover:scale-110 transition-transform duration-200">{service.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{service.name}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{service.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-3">Why Choose UrbanEzii?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Verified Providers</p>
                <p className="text-xs text-gray-600">Background checked professionals</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Quick Response</p>
                <p className="text-xs text-gray-600">Average 30 min response time</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Top Rated</p>
                <p className="text-xs text-gray-600">4.8+ average rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 shadow-lg">
        <div className="flex items-center justify-around py-3 px-2">
          <Link href="/" className="flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 hover:bg-blue-50 active:scale-95">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">Home</span>
          </Link>
          <Link href="/service" className="flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 hover:bg-gray-50 active:scale-95">
            <Grid3X3 className="h-6 w-6 text-gray-500" />
            <span className="text-xs text-gray-500">Services</span>
          </Link>
          <Link href="/ai-assistant" className="flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 hover:bg-gray-50 active:scale-95">
            <Bot className="h-6 w-6 text-gray-500" />
            <span className="text-xs text-gray-500">AI</span>
          </Link>
          <Link href="/bookings" className="flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 hover:bg-gray-50 active:scale-95">
            <Calendar className="h-6 w-6 text-gray-500" />
            <span className="text-xs text-gray-500">Bookings</span>
          </Link>
        </div>
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20" />
    </div>
  );
}