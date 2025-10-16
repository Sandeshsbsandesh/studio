'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookingHistory, scheduledBookings } from "@/lib/data";
import StarRating from "@/components/star-rating";
import { Calendar, Clock, MapPin, Repeat, Package, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const { userName } = useAuth();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Welcome back, {userName || 'Customer'}!</h1>
          <p className="text-muted-foreground mt-2">Manage your bookings and explore services</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledBookings.length}</div>
              <p className="text-xs text-muted-foreground">Active services scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingHistory.length}</div>
              <p className="text-xs text-muted-foreground">Total services used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">4.5</span>
                <StarRating rating={4.5} />
              </div>
              <p className="text-xs text-muted-foreground">Your satisfaction score</p>
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
              {scheduledBookings.length > 0 ? (
                scheduledBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle>{booking.service}</CardTitle>
                      <CardDescription>{booking.providerName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>
                       <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.address}</span>
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
              {bookingHistory.length > 0 ? (
                bookingHistory.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle>{booking.service}</CardTitle>
                      <CardDescription>{booking.providerName}</CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-3">
                       <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={booking.rating} />
                        <span className="text-muted-foreground">({booking.rating.toFixed(1)})</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Repeat className="mr-2 h-4 w-4" />
                        Re-book
                      </Button>
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

