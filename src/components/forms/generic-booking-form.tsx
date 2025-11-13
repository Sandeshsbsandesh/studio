'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useCashfree } from '@/hooks/use-cashfree';

const timeSlots = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
];

const formSchema = z.object({
  serviceType: z.string().min(1, 'Please select a service type.'),
  date: z.date({ required_error: 'Please select a date.' }),
  timeSlot: z.string().min(1, 'Please select a time slot.'),
  address: z.string().min(10, 'Address must be at least 10 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  notes: z.string().optional(),
});

interface ServiceOption {
  name: string;
  price: string;
  displayText: string;
}

interface GenericBookingFormProps {
  provider: any;
  onClose: () => void;
  serviceName: string;
  serviceOptions?: string[]; // Make optional for backward compatibility
}

export default function GenericBookingForm({ provider, onClose, serviceName, serviceOptions = [] }: GenericBookingFormProps) {
  const { user } = useAuth();
  const cashfreeMode =
    (process.env.NEXT_PUBLIC_CASHFREE_MODE ?? 'sandbox').toLowerCase() === 'production'
      ? 'production'
      : 'sandbox';
  const { isReady: isCashfreeReady, error: cashfreeError, checkout } = useCashfree(cashfreeMode);
  const [isCreatingSession, setIsCreatingSession] = React.useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
  const [pendingBooking, setPendingBooking] = React.useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = React.useState<number>(0);
  const [paymentSessionId, setPaymentSessionId] = React.useState<string | null>(null);
  const [cashfreeOrderId, setCashfreeOrderId] = React.useState<string | null>(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = React.useState(false);
  
  // Extract service options from provider's services data
  const getProviderServices = (): ServiceOption[] => {
    if (!provider?.services || !serviceName) {
      return [];
    }
    
    const categoryServices = provider.services[serviceName];
    if (!categoryServices) {
      return [];
    }
    
    return Object.entries(categoryServices).map(([subService, price]) => ({
      name: subService,
      price: price as string,
      displayText: `${subService} - \u20B9${price}`,
    }));
  };

  const providerServices = getProviderServices();
  
  // Use provider's services if available, otherwise fall back to serviceOptions
  const availableServices = providerServices.length > 0 
    ? providerServices 
    : serviceOptions.map(opt => ({ name: opt, price: '500', displayText: opt }));
  const { toast } = useToast();
  const [loadingLocation, setLoadingLocation] = React.useState(false);
  const [customerLocation, setCustomerLocation] = React.useState<{
    lat: number;
    lng: number;
    formattedAddress?: string | null;
  } | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: '',
      timeSlot: '',
      address: '',
      phone: '',
      notes: '',
    },
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Location Not Supported',
        description: 'Your browser does not support location services.',
      });
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data.display_name) {
            form.setValue('address', data.display_name);
            setCustomerLocation({
              lat: latitude,
              lng: longitude,
              formattedAddress: data.display_name,
            });
            toast({
              title: 'Location Found!',
              description: 'Your current location has been set.',
            });
          } else {
            setCustomerLocation({ lat: latitude, lng: longitude });
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch address details. Please enter manually.',
          });
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        toast({
          variant: 'destructive',
          title: 'Location Access Denied',
          description: 'Please enable location access or enter your address manually.',
        });
      }
    );
  };

  const initiatePaymentSession = React.useCallback(
    async (bookingPayload: any, options: { showToast?: boolean } = {}) => {
      if (!bookingPayload?.amount) {
        throw new Error('Booking amount missing for payment session.');
      }

      setPaymentError(null);
      setPaymentCompleted(false);
      setIsCreatingSession(true);

      try {
        const response = await fetch('/api/payments/cashfree/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: bookingPayload.amount,
            currency: 'INR',
            orderNote: `Service booking - ${bookingPayload.serviceType}`,
            customer: {
              id:
                user?.uid ??
                bookingPayload.customerPhone ??
                bookingPayload.phone ??
                `guest_${Date.now().toString(36)}`,
              name: bookingPayload.customerName ?? 'Customer',
              email: bookingPayload.customerEmail,
              phone: bookingPayload.customerPhone ?? bookingPayload.phone,
            },
            metadata: {
              providerId: bookingPayload.providerId,
              providerName: bookingPayload.providerName,
              serviceType: bookingPayload.serviceType,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok || !data?.success || !data.paymentSessionId) {
          console.error('[Payment Session] Server response:', data);
          if (data?.debug) {
            console.error('[Payment Session] Environment debug:', data.debug);
          }
          const errorMsg = data?.error ?? 'Failed to create payment session. Please retry.';
          const debugInfo = data?.debug ? `\n\nDebug: ${JSON.stringify(data.debug, null, 2)}` : '';
          throw new Error(errorMsg + debugInfo);
        }

        setPaymentSessionId(data.paymentSessionId);
        setCashfreeOrderId(data.orderId);
        setIsPaymentDialogOpen(true);

        if (options.showToast !== false) {
          toast({
            title: 'Secure payment link ready',
            description: 'Complete the payment to confirm your booking.',
          });
        }

        return data;
      } catch (error) {
        console.error('Payment session error:', error);
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to start the payment session. Please try again.';

        setPaymentError(message);
        setIsPaymentDialogOpen(false);
        setPaymentSessionId(null);
        setCashfreeOrderId(null);

        toast({
          variant: 'destructive',
          title: 'Payment session failed',
          description: message,
        });

        throw error;
      } finally {
        setIsCreatingSession(false);
      }
    },
    [toast, user?.uid, user?.phone],
  );

  async function finalizeBooking(paymentResult: any) {
    if (!pendingBooking) {
      setPaymentError('Booking details missing. Please contact support.');
      return;
    }

    const orderIdFromResult =
      paymentResult?.order?.order_id ??
      paymentResult?.order_id ??
      cashfreeOrderId ??
      null;

    let orderDetails: any = null;

    if (orderIdFromResult) {
      try {
        const statusResponse = await fetch(
          `/api/payments/cashfree/order/${orderIdFromResult}`,
        );
        if (statusResponse.ok) {
          const statusPayload = await statusResponse.json();
          orderDetails = statusPayload?.order ?? null;
        }
      } catch (error) {
        console.warn('Cashfree order verification failed:', error);
      }
    }

    const rawStatus =
      orderDetails?.order_status ??
      paymentResult?.order?.status ??
      paymentResult?.payment?.status ??
      paymentResult?.status ??
      null;

    const normalizedStatus =
      typeof rawStatus === 'string' ? rawStatus.toUpperCase() : 'PENDING';

    const successStatuses = new Set(['PAID', 'SUCCESS', 'COMPLETED', 'CAPTURED']);

    if (!successStatuses.has(normalizedStatus)) {
      setPaymentError('Payment did not complete. Please try again.');
      return;
    }

    try {
      const { createBooking } = await import('@/app/actions/bookings');

      const result = await createBooking({
        ...pendingBooking,
        status: 'pending' as const,
        paymentStatus: 'paid',
        paymentInfo: {
          orderId: orderIdFromResult ?? `order_${Date.now()}`,
          paymentAmount:
            orderDetails?.order_amount ??
            pendingBooking.amount ??
            paymentAmount,
          currency: orderDetails?.order_currency ?? 'INR',
          paymentMethod:
            paymentResult?.payment?.payment_group ??
            paymentResult?.payment?.payment_method ??
            null,
          status: normalizedStatus,
          cfPaymentId: paymentResult?.payment?.cf_payment_id ?? null,
          paymentSessionId,
          rawResponse: {
            paymentResult,
            orderDetails,
          },
        },
      });

      if (!result.success) {
        const failureMessage =
          result.error ??
          'Payment captured but booking confirmation failed. Please contact support.';
        setPaymentError(failureMessage);
        toast({
          variant: 'destructive',
          title: 'Booking confirmation failed',
          description: failureMessage,
        });
        return;
      }

      form.reset();
      setCustomerLocation(null);
      setPendingBooking(null);
      setPaymentSessionId(null);
      setCashfreeOrderId(null);
      setPaymentCompleted(true);
      setIsPaymentDialogOpen(false);
      setPaymentAmount(0);
      setPaymentError(null);

      toast({
        title: '🎉 Booking Confirmed!',
        description: `${pendingBooking.serviceType} appointment with ${pendingBooking.providerName} on ${format(
          pendingBooking.date,
          'PPP',
        )} at ${pendingBooking.timeSlot}.`,
      });

      onClose();
    } catch (error) {
      console.error('Booking persistence error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Payment received but booking could not be saved.';
      setPaymentError(message);
      toast({
        variant: 'destructive',
        title: 'Booking save failed',
        description: message,
      });
    }
  }

  async function handlePaymentCheckout() {
    if (!paymentSessionId) {
      setPaymentError('Payment session expired. Please retry.');
      return;
    }

    if (!isCashfreeReady) {
      setPaymentError('Payment gateway is still loading. Please try again.');
      return;
    }

    setPaymentError(null);
    setIsPaymentProcessing(true);

    try {
      const paymentResult = await checkout({
        paymentSessionId,
        redirectTarget: '_self',
      });

      if (!paymentResult) {
        setPaymentError('Payment was cancelled. You can retry with a different method.');
        return;
      }

      await finalizeBooking(paymentResult);
    } catch (error) {
      console.error('Cashfree checkout error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Payment failed or was cancelled. Please try again.';
      setPaymentError(message);
      toast({
        variant: 'destructive',
        title: 'Payment failed',
        description: message,
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  }

  async function handleRetry() {
    if (!pendingBooking) {
      toast({
        variant: 'destructive',
        title: 'Unable to retry',
        description: 'Please submit the booking form again to restart the payment.',
      });
      return;
    }

    setPaymentSessionId(null);
    setCashfreeOrderId(null);

    try {
      await initiatePaymentSession(pendingBooking, { showToast: false });
      toast({
        title: 'New payment session ready',
        description: 'Try completing the payment again with another method.',
      });
    } catch {
      // Errors handled within initiatePaymentSession
    }
  }

  const handleCancelPayment = () => {
    if (paymentCompleted) {
      setPaymentCompleted(false);
      return;
    }

    setPaymentSessionId(null);
    setCashfreeOrderId(null);
    setPaymentError(null);
    setIsPaymentProcessing(false);

    toast({
      title: 'Payment cancelled',
      description: 'Your booking is not confirmed. Submit again when you are ready to pay.',
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setPaymentError(null);

      const selectedService = availableServices.find(
        (service) => service.name === values.serviceType,
      );
      const amount = selectedService ? parseInt(selectedService.price, 10) : 500;

      const bookingData = {
        providerId: provider.id || 'demo-provider-id',
        providerName: provider.businessName || provider.name,
        customerName: user?.name || 'Customer',
        customerEmail: user?.email,
        customerPhone: user?.phone || values.phone,
        serviceType: values.serviceType,
        date: values.date,
        timeSlot: values.timeSlot,
        address: values.address,
        phone: values.phone,
        notes: values.notes,
        amount,
        status: 'pending' as const,
        customerLocation: customerLocation
          ? {
              lat: customerLocation.lat,
              lng: customerLocation.lng,
              formattedAddress:
                customerLocation.formattedAddress ?? values.address,
            }
          : undefined,
      };

      setPendingBooking(bookingData);
      setPaymentAmount(amount);

      await initiatePaymentSession(bookingData);
    } catch (error) {
      console.error('Booking initiation error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.',
      });
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.name} value={service.name}>
                      {service.displayText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Service Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time Slot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Address</FormLabel>
              <div className="flex gap-2">
                <FormControl className="flex-1">
                  <Textarea
                    placeholder="Enter your complete address..."
                    className="resize-none"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setCustomerLocation(null);
                    }}
                  />
                </FormControl>
              </div>
              <FormDescription className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={loadingLocation}
                  className="mt-2"
                >
                  {loadingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Use Current Location
                    </>
                  )}
                </Button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 98765 43210" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific requirements or details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isCreatingSession || isPaymentDialogOpen}
        >
          {isCreatingSession ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Securing payment session...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
      </form>
    </Form>
    <Dialog
      open={isPaymentDialogOpen}
      onOpenChange={(open) => {
        if (open) {
          setIsPaymentDialogOpen(true);
          return;
        }

        if (isPaymentProcessing) {
          return;
        }

        setIsPaymentDialogOpen(false);
        handleCancelPayment();
      }}
    >
      <DialogContent
        onInteractOutside={(event) => {
          if (isPaymentProcessing) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Pay ₹{paymentAmount.toLocaleString('en-IN')} to confirm your booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {paymentSessionId && (
            <p className="text-sm text-muted-foreground">
              Cashfree Order ID: {cashfreeOrderId ?? 'pending'}
            </p>
          )}

          {!isCashfreeReady && !cashfreeError && (
            <Alert>
              <AlertTitle>Preparing payment gateway</AlertTitle>
              <AlertDescription>
                We&apos;re loading secure payment options. This usually takes a second.
              </AlertDescription>
            </Alert>
          )}

          {cashfreeError && (
            <Alert variant="destructive">
              <AlertTitle>Payment gateway unavailable</AlertTitle>
              <AlertDescription>{cashfreeError.message}</AlertDescription>
            </Alert>
          )}

          {paymentError && (
            <Alert variant="destructive">
              <AlertTitle>Payment issue</AlertTitle>
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          <p className="text-sm text-muted-foreground">
            You&apos;ll be redirected to Cashfree&apos;s secure checkout to choose your preferred
            payment method. Keep this window open until the payment is completed.
          </p>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            onClick={handlePaymentCheckout}
            disabled={
              !paymentSessionId ||
              !isCashfreeReady ||
              isPaymentProcessing ||
              Boolean(cashfreeError)
            }
          >
            {isPaymentProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${paymentAmount.toLocaleString('en-IN')}`
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleRetry}
            disabled={
              isCreatingSession ||
              isPaymentProcessing ||
              !pendingBooking
            }
          >
            Retry with different method
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (!isPaymentProcessing) {
                setIsPaymentDialogOpen(false);
              }
            }}
            disabled={isPaymentProcessing}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

