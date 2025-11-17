'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Briefcase, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ServiceRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    serviceName: '',
    location: '',
    details: '',
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: 'Request Submitted!',
          description: 'We\'ll get back to you soon with available providers.',
        });
        
        // Reset form
        setFormData({
          serviceName: '',
          location: '',
          details: '',
          name: '',
          phone: '',
          email: '',
        });
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(data.error || 'Failed to submit request');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSuccess) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mx-auto bg-green-100 rounded-full p-4 w-fit mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold font-headline mb-4">Request Submitted!</h2>
          <p className="text-muted-foreground">
            We've received your request and will get back to you soon with available service providers in your area.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="pt-8">
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-headline tracking-tight">Can't Find Your Service?</h2>
          <p className="mt-2 text-muted-foreground">
            Tell us what you need and we'll help you find the right provider
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium mb-2">
                <Briefcase className="inline w-4 h-4 mr-1" />
                Service Needed *
              </label>
              <Input
                id="serviceName"
                name="serviceName"
                placeholder="e.g., Carpenter, Gardener, Pest Control"
                value={formData.serviceName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location *
              </label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Koramangala, Bangalore"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium mb-2">
              Additional Details
            </label>
            <Textarea
              id="details"
              name="details"
              placeholder="Describe your requirements in detail..."
              value={formData.details}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="border-t pt-4 mt-6">
            <p className="text-sm font-medium mb-4">Your Contact Information</p>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                name="name"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We'll review your request and connect you with available providers within 24 hours
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

