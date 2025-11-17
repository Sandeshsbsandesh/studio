'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StarRating from "@/components/star-rating";
import { Calendar, Clock, MapPin, Repeat, Package, TrendingUp, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import PlatformStats from '@/components/platform-stats';

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  bookingDate: string;
  timeSlot: string;
  address: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: Date;
}

export default function CustomerDashboardPage() {
  const { userName, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const fetchedBookings: Booking[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            serviceName: data.serviceName || 'Service',
            providerName: data.providerName || 'Provider',
            bookingDate: data.bookingDate || '',
            timeSlot: data.timeSlot || '',
            address: data.address || '',
            status: data.status || 'pending',
            paymentStatus: data.paymentStatus || 'pending',
            amount: data.amount || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
          };
        });
        
        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Welcome back, {userName || 'Customer'}!</h1>
          <p className="text-muted-foreground mt-2">Manage your bookings and explore services</p>
        </div>

        {/* Platform Statistics */}
        <PlatformStats className="mb-6" />

        {/* Why Choose UrbanEzii - Simplified */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-xs font-semibold">Your Choice</p>
                <p className="text-[10px] text-muted-foreground">Pick your provider</p>
              </div>
              <div>
                <div className="text-2xl mb-1">💰</div>
                <p className="text-xs font-semibold">Transparent Pricing</p>
                <p className="text-[10px] text-muted-foreground">No hidden fees</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🤖</div>
                <p className="text-xs font-semibold">AI Assistant</p>
                <p className="text-[10px] text-muted-foreground">Smart suggestions</p>
              </div>
              <div>
                <div className="text-2xl mb-1">🏘️</div>
                <p className="text-xs font-semibold">Local Support</p>
                <p className="text-[10px] text-muted-foreground">Direct connection</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Bookings Alert Banner */}
        {pendingBookings.length > 0 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold">
              You have {pendingBookings.length} pending service{pendingBookings.length > 1 ? 's' : ''}!
            </AlertTitle>
            <AlertDescription className="text-blue-800">
              {pendingBookings.map((booking, index) => (
                <div key={booking.id} className="mt-2">
                  <strong>{booking.serviceName}</strong> with {booking.providerName} is scheduled for{' '}
                  <strong>{booking.bookingDate}</strong> at <strong>{booking.timeSlot}</strong>. 
                  Your service will be completed shortly according to the given time. Stay tuned! 🎯
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground">Active services scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : completedBookings.length}</div>
              <p className="text-xs text-muted-foreground">Total services used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : bookings.length}</div>
              <p className="text-xs text-muted-foreground">All time services</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Section */}
        <Tabs defaultValue="scheduled" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scheduled">Upcoming Services</TabsTrigger>
            <TabsTrigger value="history">Service History</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduled" className="mt-6">
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Loading bookings...</p>
                  </CardContent>
                </Card>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{booking.serviceName}</CardTitle>
                          <CardDescription>{booking.providerName}</CardDescription>
                        </div>
                        <Badge variant={booking.status === 'pending' ? 'outline' : 'default'}>
                          {booking.status === 'pending' ? 'Pending' : booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.timeSlot}</span>
                      </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="font-semibold">Amount: ₹{booking.amount.toLocaleString('en-IN')}</span>
                        <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {booking.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                    <Button asChild>
                      <Link href="/services">Browse Services</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-6">
             <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Loading history...</p>
                  </CardContent>
                </Card>
              ) : completedBookings.length > 0 ? (
                completedBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{booking.serviceName}</CardTitle>
                          <CardDescription>{booking.providerName}</CardDescription>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                     <CardContent className="space-y-3">
                       <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.bookingDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="font-semibold">Amount: ₹{booking.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No service history yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = '/services'}>
            <CardHeader>
              <CardTitle className="text-xl">Browse Services</CardTitle>
              <CardDescription>Explore all available services in your area</CardDescription>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = '/ai-assistant'}>
            <CardHeader>
              <CardTitle className="text-xl">AI Assistant</CardTitle>
              <CardDescription>Get smart recommendations for service providers</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

