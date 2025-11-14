'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, IndianRupee, Info, Star, CheckCircle, Bell, TrendingUp, Clock, Users } from "lucide-react";
import StarRating from "@/components/star-rating";
import UpcomingAppointments from "./upcoming-appointments";
import EarningsTrend from "./earnings-trend";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, limit, Timestamp, getDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  customerName: string;
  serviceType: string;
  date: Date;
  timeSlot: string;
  address: string;
  phone: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  amount?: number;
}

interface Stats {
  totalBookings: number;
  todayBookings: number;
  monthlyEarnings: number;
  averageRating: number;
  completedJobs: number;
}

export default function ProviderDashboardPage() {
  const { userName, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    todayBookings: 0,
    monthlyEarnings: 0,
    averageRating: 0,
    completedJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [newBookingCount, setNewBookingCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [providerRating, setProviderRating] = useState(0);
  const [providerReviews, setProviderReviews] = useState(0);

  // Check if provider just completed setup
  useEffect(() => {
    const justCompletedSetup = sessionStorage.getItem('justCompletedSetup');
    if (justCompletedSetup === 'true') {
      setShowWelcome(true);
      sessionStorage.removeItem('justCompletedSetup');
      
      // Show welcome toast
      setTimeout(() => {
        toast({
          title: '🎊 Congratulations!',
          description: `Welcome aboard, ${userName || 'Provider'}! You're all set to start receiving bookings.`,
          duration: 5000,
        });
      }, 500);
    }
  }, [userName, toast]);

  // Fetch provider profile data for rating
  useEffect(() => {
    if (!user?.uid) return;

    const fetchProviderProfile = async () => {
      try {
        const providerDoc = await getDoc(doc(db, 'providers', user.uid));
        if (providerDoc.exists()) {
          const data = providerDoc.data();
          setProviderRating(data.rating || 0);
          setProviderReviews(data.reviews || 0);
        }
      } catch (error) {
        console.error('Error fetching provider profile:', error);
      }
    };

    fetchProviderProfile();
  }, [user]);

  // Real-time listener for bookings
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const providerId = user.uid; // Use actual provider ID from auth
    
    const bookingsRef = collection(db, 'bookings');
    // Remove orderBy to avoid index requirement - we'll sort in JavaScript
    const q = query(
      bookingsRef,
      where('providerId', '==', providerId),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookingsData: Booking[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let todayCount = 0;
        let monthlyTotal = 0;
        let completedCount = 0;

        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' && !loading) {
            // New booking notification
            toast({
              title: '🎉 New Booking!',
              description: `You have a new booking for ${change.doc.data().serviceType}`,
              duration: 5000,
            });
            setNewBookingCount(prev => prev + 1);
          }
        });

        snapshot.forEach((doc) => {
          const data = doc.data();
          const bookingDate = data.date?.toDate() || new Date();
          const createdAt = data.createdAt?.toDate() || new Date();
          
          const booking: Booking = {
            id: doc.id,
            customerName: data.customerName || 'Customer',
            serviceType: data.serviceType,
            date: bookingDate,
            timeSlot: data.timeSlot,
            address: data.address,
            phone: data.phone,
            status: data.status || 'pending',
            createdAt: createdAt,
            amount: data.amount || 500,
          };

          bookingsData.push(booking);

          // Calculate stats
          if (bookingDate >= today) {
            todayCount++;
          }
          
          if (booking.status === 'completed' && booking.amount) {
            monthlyTotal += booking.amount;
            completedCount++;
          }
        });

        // Sort by createdAt in JavaScript instead of Firestore
        bookingsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setBookings(bookingsData);
        setStats({
          totalBookings: bookingsData.length,
          todayBookings: todayCount,
          monthlyEarnings: monthlyTotal,
          averageRating: providerRating,
          completedJobs: completedCount,
        });
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [loading, toast, user, providerRating]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-gradient-to-br from-background via-primary/[0.02] to-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-headline bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to UrbanEzii, {userName || 'Provider'}! 👋
          </h2>
          <p className="text-muted-foreground text-lg mt-1">
            Your provider dashboard • Manage bookings, track earnings, and grow your business
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button className="flex-1 md:flex-none" onClick={() => router.push('/provider/services')}>
            My Services
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none" onClick={() => router.push('/provider/availability')}>
            Set Availability
          </Button>
          {newBookingCount > 0 && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {newBookingCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>

      {/* Welcome Card for New Providers */}
      {showWelcome && (
        <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <span className="text-4xl">🎉</span>
                  <span>Welcome to the UrbanEzii Family!</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Your provider profile is now live and customers can start booking your services.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowWelcome(false)}>
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Profile Created</h4>
                  <p className="text-sm text-muted-foreground">Your provider profile is complete and verified.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ready for Bookings</h4>
                  <p className="text-sm text-muted-foreground">Customers can now find and book your services.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Grow Your Business</h4>
                  <p className="text-sm text-muted-foreground">Track earnings and manage appointments here.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert */}
      {!showWelcome && (
        <Alert className="border-primary/20 bg-primary/5 backdrop-blur-sm">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-semibold">Provider Onboarding Flow</AlertTitle>
          <AlertDescription className="text-primary/80 flex items-center justify-between">
            <span>This is the main dashboard for existing providers. To test the multi-step onboarding process for new providers, visit the Setup Wizard.</span>
            <Button variant="outline" size="sm" onClick={() => router.push('/provider/setup-wizard')} className="ml-4">
              Setup Wizard →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '...' : stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600 font-medium">{stats.todayBookings} today</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <IndianRupee className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{loading ? '...' : stats.monthlyEarnings.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {stats.completedJobs} completed jobs
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
              <StarRating rating={stats.averageRating} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {providerReviews} {providerReviews === 1 ? 'review' : 'reviews'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">Verified</span>
              <Badge variant="outline" className="border-green-600 text-green-600">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Profile complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Appointments */}
        <Card className="col-span-full lg:col-span-4 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your next scheduled jobs</CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {stats.todayBookings} Today
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <UpcomingAppointments bookings={bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')} loading={loading} />
          </CardContent>
        </Card>

        {/* Earnings Trend */}
        <Card className="col-span-full lg:col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-500/5 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Earnings Trend
            </CardTitle>
            <CardDescription>Your earnings over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <EarningsTrend bookings={bookings} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest bookings and updates</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No bookings yet. They'll appear here when customers book your services!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-card border rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold",
                      booking.status === 'completed' ? 'bg-green-100 text-green-600' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-primary/10 text-primary'
                    )}>
                      {booking.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.serviceType}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.date.toLocaleDateString()} • {booking.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      booking.status === 'completed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      'outline'
                    }>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                    {booking.amount && (
                      <p className="text-sm font-semibold mt-1">₹{booking.amount}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
