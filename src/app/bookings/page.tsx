'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StarRating from "@/components/star-rating";
import { Calendar, Clock, MapPin, Repeat, Phone, FileText, IndianRupee, Receipt } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import LiveMap from '@/components/maps/LiveMap';

interface Booking {
  id: string;
  providerName: string;
  serviceType: string;
  date: Date;
  timeSlot: string;
  address: string;
  phone: string;
  notes?: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentInfo?: {
    paymentMethod?: string | null;
    status?: string | null;
  } | null;
  createdAt: Date;
  customerLocation: {
    lat: number;
    lng: number;
    formattedAddress?: string | null;
  } | null;
  providerLiveLocation: {
    lat: number;
    lng: number;
    updatedAt?: Date | null;
    isActive?: boolean;
  } | null;
}

export default function BookingsPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/login');
      return;
    }

    if (!user?.uid) {
      setLoading(false);
      return;
    }

    // Real-time listener for bookings
    const bookingsRef = collection(db, 'bookings');
    // Remove orderBy to avoid Firebase index requirement - we'll sort in JavaScript
    const q = query(
      bookingsRef,
      where('customerPhone', '==', user.phone || '')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookingsData: Booking[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();

          const customerLocation = data.customerLocation && typeof data.customerLocation.lat === 'number' && typeof data.customerLocation.lng === 'number'
            ? {
                lat: data.customerLocation.lat,
                lng: data.customerLocation.lng,
                formattedAddress: data.customerLocation.formattedAddress ?? null,
              }
            : null;

          const providerLiveLocation = data.providerLiveLocation && typeof data.providerLiveLocation.lat === 'number' && typeof data.providerLiveLocation.lng === 'number'
            ? {
                lat: data.providerLiveLocation.lat,
                lng: data.providerLiveLocation.lng,
                updatedAt: data.providerLiveLocation.updatedAt?.toDate ? data.providerLiveLocation.updatedAt.toDate() : data.providerLiveLocation.updatedAt ?? null,
                isActive: data.providerLiveLocation.isActive ?? null,
              }
            : null;
 
          bookingsData.push({
            id: doc.id,
            providerName: data.providerName || 'Provider',
            serviceType: data.serviceType,
            date: data.date?.toDate() || new Date(),
            timeSlot: data.timeSlot,
            address: data.address,
            phone: data.phone,
            notes: data.notes,
            amount: data.amount || 0,
            status: data.status || 'pending',
            paymentStatus: data.paymentStatus ?? 'pending',
            paymentInfo: data.paymentInfo ?? null,
            createdAt: data.createdAt?.toDate() || new Date(),
            customerLocation,
            providerLiveLocation,
          });
        });

        // Sort by createdAt in JavaScript instead of Firestore
        bookingsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setBookings(bookingsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching bookings: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isLoggedIn, router]);

  const scheduledBookings = bookings.filter(
    b => b.status === 'pending' || b.status === 'confirmed'
  );
  
  const completedBookings = bookings.filter(
    b => b.status === 'completed'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="default">Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-headline tracking-tight mb-8">My Bookings</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.uid) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Please log in to view your bookings</p>
              <Button onClick={() => router.push('/login')}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight mb-8">My Bookings</h1>

        <Tabs defaultValue="scheduled" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scheduled">Scheduled ({scheduledBookings.length})</TabsTrigger>
            <TabsTrigger value="history">History ({completedBookings.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scheduled" className="mt-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-headline font-bold">Upcoming Services</h2>
              {scheduledBookings.length > 0 ? (
                scheduledBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{booking.serviceType}</CardTitle>
                          <CardDescription className="text-base mt-1">{booking.providerName}</CardDescription>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(booking.date, 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{booking.phone}</span>
                      </div>
                      {booking.notes && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4 mt-1" />
                          <span className="flex-1">{booking.notes}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-lg font-semibold text-green-600 pt-2">
                        <IndianRupee className="h-5 w-5" />
                        <span>₹{booking.amount.toLocaleString('en-IN')}</span>
                      </div>

                      {(booking.customerLocation || booking.providerLiveLocation) && (
                        <div className="pt-4">
                          <LiveMap
                            bookingId={booking.id}
                            customerLocation={booking.customerLocation}
                            providerLocation={booking.providerLiveLocation}
                          />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => router.push(`/bookings/${booking.id}/invoice`)}
                      >
                        <Receipt className="h-4 w-4" />
                        View Invoice
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Reschedule</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">You have no scheduled bookings.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-headline font-bold">Past Services</h2>
              {completedBookings.length > 0 ? (
                completedBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{booking.serviceType}</CardTitle>
                          <CardDescription className="text-base mt-1">{booking.providerName}</CardDescription>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(booking.date, 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={5.0} />
                        <span className="text-muted-foreground">(5.0)</span>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
                        <IndianRupee className="h-5 w-5" />
                        <span>₹{booking.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => router.push(`/bookings/${booking.id}/invoice`)}
                      >
                        <Receipt className="h-4 w-4" />
                        View Invoice
                      </Button>
                      <Button>
                        <Repeat className="mr-2 h-4 w-4" />
                        Re-book
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">You have no past bookings.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
