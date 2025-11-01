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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Import the action
      const { createBooking } = await import('@/app/actions/bookings');
      
      // Get the price for the selected service
      const selectedService = availableServices.find(s => s.name === values.serviceType);
      const amount = selectedService ? parseInt(selectedService.price) : 500;
      
      // Create booking data
      const bookingData = {
        providerId: provider.id || 'demo-provider-id',
        providerName: provider.businessName || provider.name,
        customerName: user?.name || 'Customer',
        customerPhone: user?.phone || values.phone,
        serviceType: values.serviceType,
        date: values.date,
        timeSlot: values.timeSlot,
        address: values.address,
        phone: values.phone,
        notes: values.notes,
        amount: amount,
        status: 'pending' as const,
        customerLocation: customerLocation
          ? {
              lat: customerLocation.lat,
              lng: customerLocation.lng,
              formattedAddress: customerLocation.formattedAddress ?? values.address,
            }
          : undefined,
      };

      // Save to Firebase
      const result = await createBooking(bookingData);

      if (result.success) {
        form.reset();
        setCustomerLocation(null);

        toast({
          title: '🎉 Booking Confirmed!',
          description: `${serviceName} appointment with ${provider.businessName} for ${values.serviceType} on ${format(values.date, 'PPP')} at ${values.timeSlot}.`,
        });
        onClose();
      } else {
        toast({
          variant: 'destructive',
          title: 'Booking Failed',
          description: result.error || 'Unable to create booking. Please try again.',
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        });
    }
  }

  return (
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

        <Button type="submit" className="w-full">
          Confirm Booking
        </Button>
      </form>
    </Form>
  );
}

