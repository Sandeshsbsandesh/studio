import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookingHistory, scheduledBookings } from "@/lib/data";
import StarRating from "@/components/star-rating";
import { Calendar, Clock, MapPin, Repeat } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight mb-8">My Bookings</h1>

        <Tabs defaultValue="scheduled" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduled" className="mt-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-headline font-bold">Upcoming Services</h2>
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
                    <CardFooter className="flex justify-end gap-2">
                       <Button variant="outline">Cancel</Button>
                       <Button>Reschedule</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p>You have no scheduled bookings.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-8">
             <div className="space-y-6">
              <h2 className="text-2xl font-headline font-bold">Past Services</h2>
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
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <StarRating rating={booking.rating} />
                        <span>({booking.rating.toFixed(1)})</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                       <Button>
                          <Repeat className="mr-2 h-4 w-4" />
                          Re-book
                       </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p>You have no past bookings.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
