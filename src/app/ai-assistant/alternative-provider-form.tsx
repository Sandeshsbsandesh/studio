
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getAlternativeProviders, FormState } from './actions';
import { SuggestAlternativeServiceProviderOutput } from '@/ai/flows/suggest-alternative-service-provider';
import StarRating from '@/components/star-rating';
import { Loader2, AlertCircle, Sparkles, MapPin, Star } from 'lucide-react';
import UniqueLoader from '@/components/unique-loader';

const formSchema = z.object({
  city: z.string().min(1, 'City is required.'),
  neighborhood: z.string().min(1, 'Neighborhood is required.'),
  serviceCategory: z.string().min(1, 'Service category is required.'),
  currentProviderRating: z.number().min(1).max(5),
});

type FormData = z.infer<typeof formSchema>;

const serviceCategories = [
  'Water Can', 'Maid', 'Electrician', 'Doctor', 'Cylinder Delivery', 'Cleaner', 'Cook', 'Plumber'
];

export default function AlternativeProviderForm() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      neighborhood: '',
      serviceCategory: '',
      currentProviderRating: 3,
    },
  });

  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const result = await getAlternativeProviders(values);
      setFormState(result);
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Find Your Next Best Provider</CardTitle>
          <CardDescription className="font-body">Fill in the details to get AI-powered recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bangalore" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neighborhood</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Koramangala" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
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
                name="currentProviderRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Provider Rating ({field.value} / 5)</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        {isPending && (
          <div className="flex flex-col items-center justify-center gap-4 text-center p-8 border border-dashed rounded-lg">
             <UniqueLoader />
             <p className="text-muted-foreground">Our AI is finding the best providers for you...</p>
          </div>
        )}
        {formState?.error && !formState.data?.alternativeProviders.length && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.error}</AlertDescription>
          </Alert>
        )}
        {formState?.success && formState.data && (
          <div>
            <h2 className="text-2xl font-bold font-headline mb-4 text-center">Here are your recommendations!</h2>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {formState.data.alternativeProviders.map((provider, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">{provider.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-4 w-4 text-primary"/>
                      <span className="font-semibold">Rating:</span>
                      <StarRating rating={provider.rating} />
                       <span className="text-sm">({provider.rating.toFixed(1)})</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary"/>
                      <span className="font-semibold">Distance:</span>
                      <span>{provider.distance}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
