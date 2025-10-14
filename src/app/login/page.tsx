
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AtSign, Phone, MapPin, User, KeyRound, PartyPopper, Briefcase, LogIn, UserPlus } from 'lucide-react';
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactConfetti from 'react-confetti';
import { useToast } from "@/hooks/use-toast";
import { signInUser, signUpUser } from "./actions";

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  name: z.string().min(1, 'Please enter your name.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  userType: z.enum(['customer', 'provider'], { required_error: 'Please select a registration type.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [location, setLocation] = useState<{ latitude: number, longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      userType: searchParams.get('as') === 'provider' ? 'provider' : 'customer',
    },
  });

  const handleLocationAccess = () => {
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({
            title: 'Location Captured!',
            description: 'Your location has been successfully recorded.',
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Could not get location access. Please enable it in your browser settings.');
          toast({
            variant: "destructive",
            title: 'Location Error',
            description: 'Could not get location access. Please enable it in your browser settings.',
          });
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
       toast({
          variant: "destructive",
          title: 'Unsupported Browser',
          description: 'Geolocation is not supported by this browser.',
        });
    }
  };

  async function onSubmit(values: FormValues) {
    if (formType === 'signup' && !location) {
      toast({
        variant: "destructive",
        title: 'Location Required',
        description: 'Please allow location access to sign up.',
      });
      return;
    }
    
    setLoading(true);

    const action = formType === 'signup' ? signUpUser : signInUser;
    const result = await action({ ...values, location });

    setLoading(false);

    if (result.success) {
      localStorage.setItem('userName', result.user?.name || '');
      localStorage.setItem('userType', result.user?.userType || '');
      window.dispatchEvent(new Event('storage'));

      setShowConfetti(true);
      toast({
        title: formType === 'signup' ? 'Welcome!' : 'Welcome Back!',
        description: "You're all set! Redirecting you now...",
      });

      setTimeout(() => {
        if (result.user?.userType === 'provider') {
          router.push('/provider/dashboard');
        } else {
          router.push('/');
        }
      }, 3000);
    } else {
      toast({
        variant: "destructive",
        title: 'Authentication Failed',
        description: result.error,
      });
    }
  }

  const initialUserType = searchParams.get('as') === 'provider' ? 'provider' : 'customer';

  return (
    <>
      {showConfetti && <ReactConfetti />}
      <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">
              {formType === 'login' ? 'Welcome Back!' : 'Create an Account'}
            </CardTitle>
            <CardDescription>
              {formType === 'login' ? 'Log in to continue to Urbanezii.' : 'Sign up to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {formType === 'signup' && (
                  <>
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Register as a...</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={initialUserType}
                              className="grid grid-cols-2 gap-4"
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="customer" id="customer" className="sr-only peer" />
                                </FormControl>
                                <FormLabel htmlFor="customer" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                  <User className="mb-3 h-6 w-6" />
                                  Customer
                                </FormLabel>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem value="provider" id="provider" className="sr-only peer" />
                                </FormControl>
                                <FormLabel htmlFor="provider" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                  <Briefcase className="mb-3 h-6 w-6" />
                                  Service Provider
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </>
                )}

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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formType === 'signup' && (
                  <div className="space-y-4">
                    <div>
                      <FormLabel>Location</FormLabel>
                      <Button type="button" variant="outline" className="w-full mt-2" onClick={handleLocationAccess} disabled={loading}>
                        <MapPin className="mr-2 h-5 w-5" />
                        {location ? 'Location Captured!' : 'Allow Location Access'}
                      </Button>
                      <FormDescription className="mt-2">
                        We require your location to complete the registration.
                        {location && <span className="block text-green-600 font-medium">Latitude: {location.latitude.toFixed(5)}, Longitude: {location.longitude.toFixed(5)}</span>}
                        {locationError && <span className="block text-destructive font-medium">{locationError}</span>}
                      </FormDescription>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : (formType === 'login' ? 'Login' : 'Sign Up')}
                </Button>
              </form>
            </Form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {formType === 'login' ? "Don't have an account?" : "Already have an account?"}
                <Button variant="link" onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}>
                  {formType === 'login' ? 'Sign Up' : 'Login'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
