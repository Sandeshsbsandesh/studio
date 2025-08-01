
'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  hours: z.number().min(1).max(8),
});

export default function CooksForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  const { toast } = useToast();
  const [hours, setHours] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hours: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Booking Confirmed!',
      description: `Personal cook from ${provider.name} has been booked for ${values.hours} hours.`,
    });
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Hours (Charge: ₹600/hr)</FormLabel>
              <FormControl>
                <>
                  <Slider
                    min={1}
                    max={8}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
                      setHours(value[0]);
                    }}
                  />
                  <div className="text-center font-bold">{hours} hour(s)</div>
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
