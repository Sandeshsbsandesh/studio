'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Users, UserCog, Calendar, MessageSquare, TrendingUp, IndianRupee, Clock, CheckCircle } from 'lucide-react';

interface DashboardStats {
  totalProviders: number;
  totalCustomers: number;
  totalBookings: number;
  pendingRequests: number;
  todayBookings: number;
  totalRevenue: number;
  activeProviders: number;
  completedBookings: number;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'provider' | 'request';
  message: string;
  timestamp: Date;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProviders: 0,
    totalCustomers: 0,
    totalBookings: 0,
    pendingRequests: 0,
    todayBookings: 0,
    totalRevenue: 0,
    activeProviders: 0,
    completedBookings: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch providers count
      const providersSnap = await getDocs(collection(db, 'providers'));
      const totalProviders = providersSnap.size;
      const activeProviders = providersSnap.docs.filter(
        (doc) => doc.data().status === 'active'
      ).length;

      // Fetch customers count (users with role: customer)
      const usersSnap = await getDocs(collection(db, 'users'));
      const totalCustomers = usersSnap.docs.filter(
        (doc) => doc.data().role === 'customer'
      ).length;

      // Fetch bookings
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      const totalBookings = bookingsSnap.size;
      const completedBookings = bookingsSnap.docs.filter(
        (doc) => doc.data().status === 'completed'
      ).length;

      // Calculate today's bookings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBookings = bookingsSnap.docs.filter((doc) => {
        const bookingDate = doc.data().createdAt?.toDate();
        return bookingDate >= today;
      }).length;

      // Fetch service requests
      const requestsSnap = await getDocs(collection(db, 'serviceRequests'));
      const pendingRequests = requestsSnap.docs.filter(
        (doc) => doc.data().status === 'pending' || !doc.data().status
      ).length;

      // Calculate revenue (mock calculation)
      const totalRevenue = bookingsSnap.docs
        .filter((doc) => doc.data().status === 'completed')
        .reduce((sum, doc) => {
          const amount = doc.data().totalAmount || 0;
          return sum + amount;
        }, 0);

      setStats({
        totalProviders,
        totalCustomers,
        totalBookings,
        pendingRequests,
        todayBookings,
        totalRevenue,
        activeProviders,
        completedBookings,
      });

      // Get recent activity
      const recentBookings = bookingsSnap.docs
        .sort((a, b) => {
          const aTime = a.data().createdAt?.toMillis() || 0;
          const bTime = b.data().createdAt?.toMillis() || 0;
          return bTime - aTime;
        })
        .slice(0, 5)
        .map((doc) => ({
          id: doc.id,
          type: 'booking' as const,
          message: `New booking from ${doc.data().customerName || 'Customer'}`,
          timestamp: doc.data().createdAt?.toDate() || new Date(),
        }));

      setRecentActivity(recentBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const statCards = [
    {
      title: 'Total Providers',
      value: stats.totalProviders,
      icon: UserCog,
      color: 'bg-blue-500',
      subtext: `${stats.activeProviders} active`,
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-green-500',
      subtext: 'Registered users',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      subtext: `${stats.completedBookings} completed`,
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: MessageSquare,
      color: 'bg-orange-500',
      subtext: 'Service requests',
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: Clock,
      color: 'bg-pink-500',
      subtext: 'Last 24 hours',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-emerald-500',
      subtext: 'All time',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your UrbanEzii platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                <div className="mt-1">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No recent activity</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="/admin/providers"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              → Add New Provider
            </a>
            <a
              href="/admin/bookings"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              → View All Bookings
            </a>
            <a
              href="/admin/service-requests"
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              → Review Service Requests
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6">
          <h3 className="font-bold mb-2">Platform Health</h3>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Providers</span>
              <span className="text-sm font-bold">
                {stats.activeProviders}/{stats.totalProviders}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Completion Rate</span>
              <span className="text-sm font-bold">
                {stats.totalBookings > 0
                  ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending Requests</span>
              <span className="text-sm font-bold">{stats.pendingRequests}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

