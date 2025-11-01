'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Phone, User, IndianRupee, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NavigateButton from '@/components/NavigateButton';
import LiveTracking from '@/components/LiveTracking';

interface Booking {
  id: string;
  customerName: string;
  customerPhone?: string;
  serviceType: string;
  date: Date;
  timeSlot: string;
  address: string;
  phone: string;
  notes?: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
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

export default function ProviderBookingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const bookingsRef = collection(db, 'bookings');
    // Remove orderBy to avoid index requirement - we'll sort in JavaScript
    const q = query(
      bookingsRef,
      where('providerId', '==', user.uid)
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
                updatedAt: data.providerLiveLocation.updatedAt instanceof Timestamp
                  ? data.providerLiveLocation.updatedAt.toDate()
                  : data.providerLiveLocation.updatedAt ?? null,
                isActive: data.providerLiveLocation.isActive ?? null,
              }
            : null;
 
          bookingsData.push({
            id: doc.id,
            customerName: data.customerName || 'Customer',
            customerPhone: data.customerPhone,
            serviceType: data.serviceType,
            date: data.date?.toDate() || new Date(),
            timeSlot: data.timeSlot,
            address: data.address,
            phone: data.phone,
            notes: data.notes,
            amount: data.amount || 0,
            status: data.status,
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
        console.error('Error loading bookings:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load bookings',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleStatusUpdate = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus,
      });
      
      toast({
        title: 'Status Updated',
        description: `Booking status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update booking status',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
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
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Please log in to view your bookings</p>
              <Button onClick={() => window.location.href = '/login?as=provider'}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-primary/[0.02] to-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-headline">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage your customer appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {bookings.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter:</span>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{booking.serviceType}</CardTitle>
                      <CardDescription>
                        Booked on {format(booking.createdAt, 'PPP')}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)} variant="outline">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(booking.date, 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.timeSlot}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="flex-1">{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">₹{booking.amount}</span>
                      </div>
                      {booking.notes && (
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="flex-1 text-muted-foreground">{booking.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <LiveTracking
                    bookingId={booking.id}
                    customerLocation={booking.customerLocation}
                    className="mt-2"
                  />
                </CardContent>

                {/* Status Update */}
                <div className="px-6 pb-6">
                  <div className="flex flex-wrap items-center gap-3 border-t pt-3">
                    <span className="text-sm font-medium">Update Status:</span>
                    <div className="flex flex-wrap gap-2">
                      {booking.status !== 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                      )}
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                    <NavigateButton
                      destination={booking.customerLocation}
                      variant="outline"
                      size="sm"
                      label="Navigate"
                      className="ml-auto"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

