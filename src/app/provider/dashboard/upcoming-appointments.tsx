'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Phone } from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  serviceType: string;
  date: Date;
  timeSlot: string;
  address: string;
  phone: string;
  status: string;
}

interface UpcomingAppointmentsProps {
  bookings: Booking[];
  loading: boolean;
}

export default function UpcomingAppointments({ bookings, loading }: UpcomingAppointmentsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No upcoming appointments</p>
        <p className="text-sm mt-1">New bookings will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.slice(0, 5).map((booking) => (
        <div
          key={booking.id}
          className="flex items-center gap-4 p-4 bg-card border rounded-lg hover:shadow-md transition-all"
        >
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={`https://avatar.vercel.sh/${booking.customerName}.png`} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {booking.customerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-base">{booking.customerName}</p>
              <Badge variant="secondary" className="text-xs">
                {booking.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            </div>
            <p className="text-sm text-primary font-medium">{booking.serviceType}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {booking.timeSlot}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {booking.address.split(',')[0]}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button size="sm" className="text-xs">
              Details
            </Button>
          </div>
        </div>
      ))}
      
      {bookings.length > 5 && (
        <Button variant="link" className="w-full">
          View all {bookings.length} appointments →
        </Button>
      )}
    </div>
  );
}
