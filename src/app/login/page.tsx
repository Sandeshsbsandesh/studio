'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AtSign, Phone, MapPin, User, KeyRound, Briefcase, Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactConfetti from 'react-confetti';
import { useToast } from "@/hooks/use-toast";
import { signInUser, signUpUser } from "./actions";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  name: z.string().min(1, 'Please enter your name.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  role: z.enum(['customer', 'provider'], { required_error: 'Please select a registration type.' }),
});

type FormValues = z.infer<typeof loginSchema> | z.infer<typeof signupSchema>;

export default function LoginPage() {
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [location, setLocation] = useState<{ latitude: number, longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login } = useAuth();

  const currentSchema = useMemo(() => formType === 'login' ? loginSchema : signupSchema, [formType]);

  const form = useForm<FormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      role: searchParams.get('as') === 'provider' ? 'provider' : 'customer',
    },
  });

  useEffect(() => {
    form.reset({
       email: '',
       password: '',
       name: '',
       phone: '',
       role: searchParams.get('as') === 'provider' ? 'provider' : 'customer',
    });
  }, [formType, form, searchParams]);

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
          console.error('Error getting location:', error.message);
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
    if (formType === 'signup') {
        const signupValues = values as z.infer<typeof signupSchema>;
        // Only require location for providers
        if (signupValues.role === 'provider' && !location) {
             toast({
                variant: "destructive",
                title: 'Location Required',
                description: 'Please allow location access to sign up as a provider.',
            });
            return;
        }
    }
    
    setLoading(true);

    const action = formType === 'signup' ? signUpUser : signInUser;
    
    const finalValues = formType === 'signup' ? { ...(values as z.infer<typeof signupSchema>), location } : values;

    // @ts-ignore
    const result = await action(finalValues);

    setLoading(false);

        if (result.success && result.user) {
          login(result.user.name, result.user.userType, result.user);

          setShowConfetti(true);
          toast({
            title: formType === 'signup' ? 'Welcome!' : 'Welcome Back!',
            description: "You're all set! Redirecting you now...",
          });

          setTimeout(() => {
            // Check for redirect URL in sessionStorage
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
            
            if (redirectUrl) {
              // Clear the redirect URL and redirect to it
              sessionStorage.removeItem('redirectAfterLogin');
              router.push(redirectUrl);
            } else {
              // Default redirect based on user type
              if (result.user?.userType === 'provider') {
                router.push('/provider/dashboard');  // Provider -> Provider Dashboard
              } else {
                router.push('/');  // Customer -> Homepage
              }
            }
          }, 500);
        } else {
      toast({
        variant: "destructive",
        title: 'Authentication Failed',
        description: result.error,
      });
    }
  }

  const initialRole = searchParams.get('as') === 'provider' ? 'provider' : 'customer';

  return (
    <>
      {showConfetti && <ReactConfetti />}
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-white shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" alt="UrbanEzii Logo" width={64} height={64} className="drop-shadow-lg" />
                <h1 className="text-5xl font-bold font-headline">UrbanEzii</h1>
              </div>
              <p className="text-2xl font-semibold">Your Local Service Bridge</p>
              <p className="text-lg text-white/90">
                Discover, book, and manage verified professionals for every home need, all in one place.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Sparkles className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Verified Professionals</h3>
                  <p className="text-sm text-white/80">All service providers are background-checked and verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Sparkles className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Instant Booking</h3>
                  <p className="text-sm text-white/80">Book services with just a few clicks</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Sparkles className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Trusted & Secure</h3>
                  <p className="text-sm text-white/80">Your data and payments are always protected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="w-full shadow-2xl border-2">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                <Image src="/logo.png" alt="UrbanEzii Logo" width={48} height={48} />
                <span className="text-2xl font-bold text-primary font-headline">UrbanEzii</span>
              </div>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">
                {formType === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </CardTitle>
              <CardDescription className="text-base">
                {formType === 'login' ? 'Log in to continue to UrbanEzii.' : 'Join thousands of happy customers and providers.'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  
                  {formType === 'signup' && (
                    <>
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-base font-semibold">I want to...</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={initialRole}
                                className="grid grid-cols-2 gap-4"
                              >
                                <FormItem>
                                  <FormControl>
                                    <RadioGroupItem value="customer" id="customer" className="sr-only peer" />
                                  </FormControl>
                                  <FormLabel htmlFor="customer" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-primary/5 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                                    <User className="mb-2 h-8 w-8 text-primary" />
                                    <span className="font-semibold">Book Services</span>
                                    <span className="text-xs text-muted-foreground mt-1">Customer</span>
                                  </FormLabel>
                                </FormItem>
                                <FormItem>
                                  <FormControl>
                                    <RadioGroupItem value="provider" id="provider" className="sr-only peer" />
                                  </FormControl>
                                  <FormLabel htmlFor="provider" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-primary/5 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                                    <Briefcase className="mb-2 h-8 w-8 text-primary" />
                                    <span className="font-semibold">Provide Services</span>
                                    <span className="text-xs text-muted-foreground mt-1">Provider</span>
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
                                <Input placeholder="John Doe" className="pl-10 h-11" {...field} />
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
                                <Input type="tel" placeholder="9876543210" className="pl-10 h-11" {...field} />
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
                        <FormLabel>Email Address</FormLabel>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" className="pl-10 h-11" {...field} />
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
                            <Input type="password" placeholder="••••••••" className="pl-10 h-11" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {formType === 'signup' && form.watch('role') === 'provider' && (
                    <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <FormLabel className="text-base font-semibold">Provider Location</FormLabel>
                      <Button type="button" variant="outline" className="w-full h-11 border-primary/50 hover:bg-primary/10" onClick={handleLocationAccess} disabled={loading}>
                        <MapPin className="mr-2 h-5 w-5" />
                        {location ? '✓ Location Captured!' : 'Allow Location Access'}
                      </Button>
                      <FormDescription className="text-sm">
                        Required for service providers to show your service area.
                        {location && <span className="block text-primary font-medium mt-1">✓ Location successfully captured</span>}
                        {locationError && <span className="block text-destructive font-medium mt-1">{locationError}</span>}
                      </FormDescription>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                    {loading ? 'Processing...' : (formType === 'login' ? 'Log In' : 'Create Account')}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {formType === 'login' ? "Don't have an account?" : "Already have an account?"}
                  <Button variant="link" className="text-primary font-semibold" onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}>
                    {formType === 'login' ? 'Sign Up' : 'Log In'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
