
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, DollarSign, Info, Star, CheckCircle } from "lucide-react";
import StarRating from "@/components/star-rating";
import UpcomingAppointments from "./upcoming-appointments";
import EarningsTrend from "./earnings-trend";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProviderDashboardPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, {userName}!</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>My Services</Button>
          <Button variant="outline">Set Availability</Button>
        </div>
      </div>

       <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 !text-blue-600" />
          <AlertTitle className="text-blue-800">Provider Onboarding Flow</AlertTitle>
          <AlertDescription className="text-blue-700">
            This is the main dashboard for existing providers. To test the multi-step onboarding process for new providers, please visit the Setup Wizard.
          </AlertDescription>
        </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings (Month)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">3 today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings (Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹25,000</div>
            <p className="text-xs text-muted-foreground">Based on completed jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">0.0</span>
                <StarRating rating={0} />
            </div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Verified</div>
            <p className="text-xs text-muted-foreground">Complete profile for verification</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next scheduled jobs.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingAppointments />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Earnings Trend</CardTitle>
            <CardDescription>Your earnings over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <EarningsTrend />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
