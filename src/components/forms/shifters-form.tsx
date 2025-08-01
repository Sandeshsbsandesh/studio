'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '../ui/checkbox';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const formSchema = z.object({
  fromLocation: z.string().min(1, 'From location is required.'),
  toLocation: z.string().min(1, 'To location is required.'),
  distance: z.coerce.number().min(1, 'Distance must be at least 1 km.'),
  vehicleSize: z.enum(['small', 'medium', 'large'], {
    required_error: 'Please select a vehicle size.',
  }),
  packing: z.boolean().default(false),
  unpacking: z.boolean().default(false),
});

const vehicleCosts = {
  small: 50,
  medium: 100,
  large: 150,
};

const serviceCosts = {
  packing: 75,
  unpacking: 50,
  perKm: 2,
};

export default function ShiftersForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  const { toast } = useToast();
  const [cost, setCost] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromLocation: '',
      toLocation: '',
      distance: 1,
      packing: false,
      unpacking: false,
    },
  });

  const { distance, vehicleSize, packing, unpacking } = form.watch();

  useMemo(() => {
    let total = 0;
    if (distance > 0) {
      total += distance * serviceCosts.perKm;
    }
    if (vehicleSize) {
      total += vehicleCosts[vehicleSize];
    }
    if (packing) {
      total += serviceCosts.packing;
    }
    if (unpacking) {
      total += serviceCosts.unpacking;
    }
    setCost(total);
  }, [distance, vehicleSize, packing, unpacking]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Shifting Service Booked!',
      description: `Your booking with ${provider.name} for an estimated cost of $${cost.toFixed(2)} is confirmed.`,
    });
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Koramangala" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., HSR Layout" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance (km)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicleSize"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Vehicle Size</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="small" />
                    </FormControl>
                    <FormLabel className="font-normal">Small Truck (1-2 BHK)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="medium" />
                    </FormControl>
                    <FormLabel className="font-normal">Medium Truck (2-3 BHK)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="large" />
                    </FormControl>
                    <FormLabel className="font-normal">Large Truck (4+ BHK)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="packing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Packing Service ($75)</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unpacking"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Unpacking Service ($50)</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Card>
            <CardHeader className='p-4'>
                <CardTitle className='text-lg'>Estimated Cost</CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
                <p className='text-2xl font-bold'>${cost.toFixed(2)}</p>
            </CardContent>
        </Card>
        <Button type="submit" className="w-full">
          Confirm Booking
        </Button>
      </form>
    </Form>
  );
}
