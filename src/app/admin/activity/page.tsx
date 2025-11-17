'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Calendar, User, UserCog, MessageSquare, Activity as ActivityIcon } from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'booking' | 'provider' | 'customer' | 'request';
  action: string;
  details: string;
  timestamp: Date;
  actor?: string;
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'booking' | 'provider' | 'customer' | 'request'>('all');

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  async function fetchActivityLogs() {
    try {
      const logs: ActivityLog[] = [];

      // Fetch bookings
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      bookingsSnap.docs.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: `booking-${doc.id}`,
          type: 'booking',
          action: 'New Booking Created',
          details: `Booking for ${data.serviceType || 'service'} by ${data.customerName || 'Customer'}`,
          timestamp: data.createdAt?.toDate() || new Date(),
          actor: data.customerName,
        });
      });

      // Fetch providers
      const providersSnap = await getDocs(collection(db, 'providers'));
      providersSnap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          logs.push({
            id: `provider-${doc.id}`,
            type: 'provider',
            action: 'New Provider Registered',
            details: `${data.name} registered as ${data.category || 'provider'}`,
            timestamp: data.createdAt?.toDate() || new Date(),
            actor: data.name,
          });
        }
      });

      // Fetch service requests
      const requestsSnap = await getDocs(collection(db, 'serviceRequests'));
      requestsSnap.docs.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: `request-${doc.id}`,
          type: 'request',
          action: 'New Service Request',
          details: `Request for ${data.serviceName} in ${data.location}`,
          timestamp: data.createdAt?.toDate() || new Date(),
          actor: data.name,
        });
      });

      // Sort by timestamp (newest first)
      logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setActivities(logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5" />;
      case 'provider':
        return <UserCog className="w-5 h-5" />;
      case 'customer':
        return <User className="w-5 h-5" />;
      case 'request':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <ActivityIcon className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-600';
      case 'provider':
        return 'bg-green-100 text-green-600';
      case 'customer':
        return 'bg-purple-100 text-purple-600';
      case 'request':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Activity Log</h1>
        <p className="text-muted-foreground">Track all platform activities and changes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          All ({activities.length})
        </button>
        <button
          onClick={() => setFilter('booking')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'booking' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Bookings ({activities.filter(a => a.type === 'booking').length})
        </button>
        <button
          onClick={() => setFilter('provider')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'provider' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Providers ({activities.filter(a => a.type === 'provider').length})
        </button>
        <button
          onClick={() => setFilter('request')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'request' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Requests ({activities.filter(a => a.type === 'request').length})
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="bg-card rounded-xl border p-6">
        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className={`p-3 rounded-lg ${getColor(activity.type)} shrink-0`}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{activity.action}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                  {activity.actor && (
                    <p className="text-xs text-muted-foreground mt-1">By: {activity.actor}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No activity logs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

