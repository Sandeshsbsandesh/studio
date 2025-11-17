'use client';

import { Star, Users, Shield, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface PlatformStats {
  totalProviders: number;
  totalBookings: number;
  averageRating: number;
  citiesCovered: number;
}

export default function PlatformStats({ className = '' }: { className?: string }) {
  const [stats, setStats] = useState<PlatformStats>({
    totalProviders: 0,
    totalBookings: 0,
    averageRating: 4.8,
    citiesCovered: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!db) {
          console.error('Firebase not initialized');
          setLoading(false);
          return;
        }

        // Get total active providers
        const providersCol = collection(db, 'providers');
        const providersQuery = query(providersCol, where('active', '!=', false));
        const providersSnapshot = await getDocs(providersQuery);
        const activeProviders = providersSnapshot.docs;

        // Calculate average rating from active providers
        let totalRating = 0;
        let ratedProvidersCount = 0;
        activeProviders.forEach(doc => {
          const data = doc.data();
          if (data.rating && data.rating > 0) {
            totalRating += data.rating;
            ratedProvidersCount++;
          }
        });
        const avgRating = ratedProvidersCount > 0 ? totalRating / ratedProvidersCount : 4.8;

        // Get total bookings (all statuses)
        const bookingsCol = collection(db, 'bookings');
        const bookingsSnapshot = await getDocs(bookingsCol);
        
        setStats({
          totalProviders: activeProviders.length,
          totalBookings: bookingsSnapshot.size,
          averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
          citiesCovered: 1, // Currently only Bangalore
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        // Use default values on error
        setStats({
          totalProviders: 500,
          totalBookings: 10000,
          averageRating: 4.8,
          citiesCovered: 1,
        });
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 10000) return `${Math.floor(num / 1000)}k+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k+`;
    return `${num}+`;
  };

  if (loading) {
    return (
      <div className={`bg-card border rounded-lg p-6 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="text-center animate-pulse">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: <Star className="w-5 h-5" />,
      value: `${stats.averageRating}/5`,
      label: 'Average Rating',
      color: 'text-yellow-500',
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: formatNumber(stats.totalBookings),
      label: 'Happy Customers',
      color: 'text-blue-500',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      value: formatNumber(stats.totalProviders),
      label: 'Verified Pros',
      color: 'text-green-500',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      value: stats.citiesCovered.toString(),
      label: 'Cities Covered',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className={`bg-card border rounded-lg p-5 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-2 ${item.color}`}>
              {item.icon}
            </div>
            <div className="text-xl md:text-2xl font-bold font-headline mb-0.5">
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact version for header or smaller spaces
export function PlatformStatsCompact() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        <span className="font-semibold">4.8/5</span>
        <span className="text-muted-foreground hidden sm:inline">Rating</span>
      </div>
      <div className="w-px h-4 bg-border"></div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-500" />
        <span className="font-semibold">10k+</span>
        <span className="text-muted-foreground hidden sm:inline">Customers</span>
      </div>
      <div className="w-px h-4 bg-border"></div>
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-500" />
        <span className="font-semibold">500+</span>
        <span className="text-muted-foreground hidden sm:inline">Verified Pros</span>
      </div>
    </div>
  );
}

