
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AtSign, Phone, MapPin, Wallet, User, KeyRound, PartyPopper } from 'lucide-react';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactConfetti from 'react-confetti';

const loginSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  altPhone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.').optional().or(z.literal('')),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [step, setStep] = useState('details');
  const [formData, setFormData] = useState<LoginForm | null>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      altPhone: '',
    },
  });

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
          alert('Location access granted!');
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get location access. Please enable it in your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  function onSubmit(values: LoginForm) {
    console.log('Form Data:', values);
    setFormData(values);
    setStep('otp');
    // In a real app, you would send an OTP here.
  }

  const handleOtpSubmit = () => {
    // In a real app, you'd verify the OTP against a server.
    // We'll simulate success if OTP is '1234'.
    if (otp === '1234') {
      setError('');
      localStorage.setItem('userName', formData?.name || 'User');
      setShowConfetti(true);
      setStep('success');
      setTimeout(() => {
        router.push('/');
      }, 4000);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };
  
  return (
    <>
    {showConfetti && <ReactConfetti />}
    <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg">
        {step === 'details' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Welcome to UrbanEase</CardTitle>
              <CardDescription>Sign up or log in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <div className="relative">
                           <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl>
                            <Input placeholder="John Doe" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                         <div className="relative">
                           <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                           <FormControl>
                            <Input type="tel" placeholder="9876543210" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="altPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternative Phone Number (Optional)</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="tel" placeholder="Alternative contact" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div>
                      <FormLabel>Location Access</FormLabel>
                      <Button type="button" variant="outline" className="w-full mt-2" onClick={handleLocationAccess}>
                        <MapPin className="mr-2 h-5 w-5" />
                        Allow Location Access
                      </Button>
                       <p className="text-xs text-muted-foreground mt-2">We use your location to find the best services near you.</p>
                    </div>
                    
                    <div>
                      <FormLabel>Wallet</FormLabel>
                       <div className="relative mt-2">
                         <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input readOnly disabled value="₹ 0.00" className="pl-10 font-bold bg-muted/50" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Your wallet will be used for quick and easy payments.</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Login / Sign Up
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}
        
        {step === 'otp' && (
          <>
            <CardHeader className="text-center">
               <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <KeyRound className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Verify Your Identity</CardTitle>
              <CardDescription>Enter the 4-digit OTP sent to your phone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-48 text-center text-2xl tracking-[1rem]"
                  placeholder="----"
                />
              </div>
              {error && <p className="text-destructive text-center text-sm">{error}</p>}
              <Button onClick={handleOtpSubmit} className="w-full">Verify OTP</Button>
               <Button variant="link" onClick={() => setStep('details')} className="w-full">Back to details</Button>
            </CardContent>
          </>
        )}

        {step === 'success' && (
           <CardContent className="text-center p-12">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <PartyPopper className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Welcome, {formData?.name}!</CardTitle>
              <CardDescription className="mt-2">You're all set! Redirecting you to the homepage...</CardDescription>
            </CardContent>
        )}
      </Card>
    </div>
    </>
  );
}
