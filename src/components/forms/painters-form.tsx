
'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  propertySize: z.string().min(1, 'Please select a property size.'),
  customSize: z.string().optional(),
  painterCount: z.number().min(1).max(10),
});

const propertySizeSuggestions = {
  '1bhk': 2,
  '2bhk': 3,
  '3bhk': 4,
  '4bhk': 5,
  'custom': 1,
};

export default function PaintersForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertySize: '',
      painterCount: 1,
    },
  });

  const propertySize = form.watch('propertySize');

  const handleSizeChange = (value: string) => {
    form.setValue('propertySize', value);
    if (value !== 'custom') {
      const suggestedPainters = propertySizeSuggestions[value as keyof typeof propertySizeSuggestions];
      form.setValue('painterCount', suggestedPainters);
    } else {
      form.setValue('painterCount', 1);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Painting Service Booked!',
      description: `Your booking with ${provider.name} for ${values.painterCount} painter(s) is confirmed.`,
    });
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="propertySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Size</FormLabel>
              <Select onValueChange={handleSizeChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1bhk">1 BHK</SelectItem>
                  <SelectItem value="2bhk">2 BHK</SelectItem>
                  <SelectItem value="3bhk">3 BHK</SelectItem>
                  <SelectItem value="4bhk">4 BHK</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {propertySize === 'custom' && (
          <FormField
            control={form.control}
            name="customSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Requirements</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="e.g., '1 large hall and 2 balconies'"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="painterCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Number of Painters (Suggested: {propertySize && propertySize !== 'custom' ? propertySizeSuggestions[propertySize as keyof typeof propertySizeSuggestions] : 'N/A'})
              </FormLabel>
              <FormControl>
                <>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                  <div className="text-center font-bold">{field.value} painter(s)</div>
                </>
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
