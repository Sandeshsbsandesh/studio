
'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  request: z.string().min(10, 'Please describe your request in at least 10 characters.'),
});

export default function LocalBuddyForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Request Sent!',
      description: `Your request has been sent to ${provider.name}. They will get in touch with you shortly.`,
    });
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="request"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What do you need help with?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., 'I'm sick and need someone to pick up groceries and medicine for me.' or 'Can you pick up a food order from...' "
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Send Request
        </Button>
      </form>
    </Form>
  );
}
