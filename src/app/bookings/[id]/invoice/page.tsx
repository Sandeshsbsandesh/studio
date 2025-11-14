'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Invoice from '@/components/invoice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const bookingRef = doc(db, 'bookings', bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (!bookingSnap.exists()) {
          setError('Booking not found');
          return;
        }

        const data = bookingSnap.data();
        setBooking({
          id: bookingSnap.id,
          ...data,
          date: data.date?.toDate?.() || new Date(data.date),
          createdAt: data.createdAt?.toDate?.() || new Date(),
        });
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          <Button onClick={() => router.push('/bookings')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  const invoiceData = {
    bookingId: booking.id,
    orderDate: booking.createdAt,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone || booking.phone,
    customerAddress: booking.address,
    providerName: booking.providerName,
    serviceType: booking.serviceType,
    serviceDate: booking.date,
    timeSlot: booking.timeSlot,
    amount: booking.amount,
    paymentStatus: booking.paymentStatus || 'pending',
    paymentMethod: booking.paymentInfo?.paymentMethod || 'Cash on Service',
    orderId: booking.paymentInfo?.orderId,
    cfPaymentId: booking.paymentInfo?.cfPaymentId,
    currency: booking.paymentInfo?.currency || 'INR',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto mb-6 no-print">
        <Button onClick={() => router.push('/bookings')} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Button>
      </div>
      
      <Invoice data={invoiceData} />
    </div>
  );
}

