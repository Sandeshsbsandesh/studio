'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { Bell, Calendar, UserCog, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'booking' | 'provider' | 'request' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // This will use real-time listeners in production
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      // For now, we'll create mock notifications based on recent activity
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      const requestsSnap = await getDocs(collection(db, 'serviceRequests'));
      const providersSnap = await getDocs(collection(db, 'providers'));

      const mockNotifications: Notification[] = [];

      // Recent bookings
      const recentBookings = bookingsSnap.docs
        .sort((a, b) => {
          const aTime = a.data().createdAt?.toMillis() || 0;
          const bTime = b.data().createdAt?.toMillis() || 0;
          return bTime - aTime;
        })
        .slice(0, 10);

      recentBookings.forEach((doc) => {
        const data = doc.data();
        mockNotifications.push({
          id: `booking-${doc.id}`,
          type: 'booking',
          title: 'New Booking',
          message: `New booking from ${data.customerName || 'Customer'} for ${
            data.serviceType || 'service'
          }`,
          timestamp: data.createdAt?.toDate() || new Date(),
          read: false,
          priority: 'high',
        });
      });

      // Recent service requests
      const recentRequests = requestsSnap.docs
        .sort((a, b) => {
          const aTime = a.data().createdAt?.toMillis() || 0;
          const bTime = b.data().createdAt?.toMillis() || 0;
          return bTime - aTime;
        })
        .slice(0, 5);

      recentRequests.forEach((doc) => {
        const data = doc.data();
        if (!data.status || data.status === 'pending') {
          mockNotifications.push({
            id: `request-${doc.id}`,
            type: 'request',
            title: 'New Service Request',
            message: `${data.name} requested ${data.serviceName} in ${data.location}`,
            timestamp: data.createdAt?.toDate() || new Date(),
            read: false,
            priority: 'medium',
          });
        }
      });

      // New providers (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      providersSnap.docs.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate();
        if (createdAt && createdAt >= sevenDaysAgo) {
          mockNotifications.push({
            id: `provider-${doc.id}`,
            type: 'provider',
            title: 'New Provider Registered',
            message: `${data.name} joined as a ${data.category || 'service'} provider`,
            timestamp: createdAt,
            read: false,
            priority: 'low',
          });
        }
      });

      // Sort by timestamp
      mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-5 h-5" />;
      case 'provider':
        return <UserCog className="w-5 h-5" />;
      case 'request':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: string, priority?: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-600';
    if (priority === 'medium') return 'bg-orange-100 text-orange-600';

    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-600';
      case 'provider':
        return 'bg-green-100 text-green-600';
      case 'request':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {notifications.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold">{notifications.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Unread</p>
          <p className="text-2xl font-bold text-red-600">
            {notifications.filter((n) => !n.read).length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">High Priority</p>
          <p className="text-2xl font-bold text-orange-600">
            {notifications.filter((n) => n.priority === 'high').length}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Today</p>
          <p className="text-2xl font-bold text-blue-600">
            {
              notifications.filter((n) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return n.timestamp >= today;
              }).length
            }
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card rounded-xl border p-4 hover:shadow-md transition-all ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getColor(notification.type, notification.priority)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {notification.priority === 'high' && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No {filter === 'unread' ? 'unread' : ''} notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

