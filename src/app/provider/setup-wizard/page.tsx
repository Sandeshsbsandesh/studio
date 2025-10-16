'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Building2, Briefcase, Clock, FileText, MapPin, Upload, Check, Plus, X, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth-context';
import { saveProviderProfile } from './actions';

const step1Schema = z.object({
  companyLogo: z.string().optional(),
  companyName: z.string().min(2, 'Company name is required'),
  businessType: z.enum(['individual', 'firm', 'company']),
  city: z.string().min(2, 'City is required'),
  address: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  businessDescription: z.string().min(20, 'Please provide at least 20 characters'),
});

const step2Schema = z.object({
  experience: z.string().min(1, 'Experience is required'),
  specialization: z.string().optional(),
});

const step3Schema = z.object({
  availability: z.array(z.string()).min(1, 'Select at least one day'),
  workingHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
  priceRange: z.string().min(1, 'Price range is required'),
});

const step4Schema = z.object({
  idProof: z.string().optional(),
  addressProof: z.string().optional(),
  certifications: z.string().optional(),
  bankDetails: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

const serviceCategories: Record<string, string[]> = {
  'Electricians': [
    'Fan Installation/Repair',
    'AC Installation/Repair',
    'Geyser Installation/Repair',
    'Kitchen Appliances Service',
    'TV Installation/Repair',
    'Wiring & Rewiring',
    'Switch & Socket Installation',
    'MCB & DB Installation',
    'Light Fixture Installation',
    'Electrical Safety Inspection',
  ],
  'Plumbers': [
    'Pipe Leakage Repair',
    'Tap Installation/Repair',
    'Toilet Repair',
    'Drainage Cleaning',
    'Water Tank Cleaning',
    'Bathroom Fitting Installation',
    'Sink Installation/Repair',
    'Overhead Tank Installation',
    'Water Heater Installation',
    'Sewer Line Cleaning',
  ],
  'Cleaners': [
    'Deep Cleaning',
    'Kitchen Cleaning',
    'Bathroom Cleaning',
    'Sofa Cleaning',
    'Carpet Cleaning',
    'Post-Construction Cleaning',
    'Window Cleaning',
    'Floor Polishing',
    'Balcony Cleaning',
    'Full Home Sanitization',
  ],
  'Doctor On Call': [
    'General Checkup',
    'Pediatrician Consultation',
    'Emergency Consultation',
    'Follow-up Visit',
    'Health Monitoring',
    'Blood Pressure Check',
    'Diabetes Management',
    'Elderly Care Visit',
    'Post-Surgery Care',
    'Vaccination',
  ],
  'Water Can Delivery': [
    '20L Can Delivery',
    '25L Can Delivery',
    'Bulk Order (10+ Cans)',
    'Monthly Subscription',
    'Weekly Subscription',
    'Emergency Delivery',
  ],
  'Cylinder Delivery': [
    'Domestic Cylinder (14.2kg)',
    'Commercial Cylinder (19kg)',
    'Refill Service',
    'New Connection',
    'Regulator Replacement',
    'Safety Inspection',
  ],
  'Personal Cooks': [
    'Daily Meals (2 times)',
    'Daily Meals (3 times)',
    'Party/Event Cooking',
    'Special Diet Cooking',
    'Trial Session',
    'Breakfast Only',
    'Lunch Only',
    'Dinner Only',
    'Tiffin Service',
  ],
  'House Maids': [
    'Part-time (4 hours)',
    'Full-time (8 hours)',
    'Live-in Maid',
    'Hourly Service',
    'Cooking Only',
    'Cleaning Only',
    'Baby Care',
    'Elderly Care',
  ],
  'Painters': [
    'Interior Painting',
    'Exterior Painting',
    'Texture Painting',
    'Waterproofing',
    'Wood Polishing',
    'Wall Putty',
    'Color Consultation',
    'Ceiling Painting',
    'Door/Window Painting',
  ],
  'Shifters': [
    'Local Shifting (Within City)',
    'Office Shifting',
    'Inter-city Shifting',
    'Packing & Unpacking',
    'Vehicle Transport',
    'Furniture Assembly',
    'Storage Service',
    'Pet Relocation',
  ],
  'Local Buddy': [
    'City Tour Guide',
    'Shopping Assistant',
    'Language Translator',
    'Personal Assistant',
    'Event Companion',
    'Airport Pickup/Drop',
    'Hospital Assistance',
    'Government Office Assistance',
  ],
};

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SetupWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Array<{
    category: string;
    subcategories: Array<{ name: string; price: number; }>;
  }>>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Load saved services when navigating to step 2
  useEffect(() => {
    if (currentStep === 2 && formData[2]?.services) {
      setSelectedServices(formData[2].services);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      default: return step1Schema;
    }
  };

  // @ts-ignore - Dynamic schema based on current step
  const form = useForm<any>({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: formData[currentStep] || {},
  });

  const handleLocationAccess = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(loc);
          form.setValue('location', loc);
          toast({
            title: 'Location Captured!',
            description: 'Your location has been successfully recorded.',
          });
          setLoadingLocation(false);
        },
        (error) => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not get location access. Please enable it in your browser settings.',
          });
          setLoadingLocation(false);
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Geolocation is not supported by this browser.',
      });
      setLoadingLocation(false);
    }
  };

  const onNext = async (data: any) => {
    // For Step 2, validate and add services data
    if (currentStep === 2) {
      if (selectedServices.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please select at least one service category.',
        });
        return;
      }
      
      // Check if all selected services have at least one subcategory
      const hasInvalidServices = selectedServices.some(s => s.subcategories.length === 0);
      if (hasInvalidServices) {
        toast({
          variant: 'destructive',
          title: 'Validation Error',
          description: 'Please select at least one subcategory for each service category.',
        });
        return;
      }
      
      data.services = selectedServices;
    }
    
    setFormData({ ...formData, [currentStep]: data });
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      form.reset(formData[currentStep + 1] || {});
    } else {
      await handleSubmit(data);
    }
  };

  const onBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      form.reset(formData[currentStep - 1] || {});
      
      // Restore selectedServices if going back to step 2
      if (currentStep - 1 === 2 && formData[2]?.services) {
        setSelectedServices(formData[2].services);
      }
    }
  };

  const handleSubmit = async (finalData: any) => {
    if (!user || !user.uid || !user.email || !user.name) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User information not found. Please log in again.',
      });
      router.push('/login?as=provider');
      return;
    }

    setSaving(true);
    
    const allData = { ...formData, [currentStep]: finalData };
    
    // Prepare profile data for Firebase
    const profileData = {
      // Step 1
      companyLogo: allData[1]?.companyLogo || '',
      companyName: allData[1]?.companyName || '',
      businessType: allData[1]?.businessType || 'individual',
      city: allData[1]?.city || '',
      address: allData[1]?.address || '',
      location: allData[1]?.location || null,
      businessDescription: allData[1]?.businessDescription || '',
      
      // Step 2
      services: allData[2]?.services || [],
      experience: allData[2]?.experience || '',
      specialization: allData[2]?.specialization || '',
      
      // Step 3
      availability: allData[3]?.availability || [],
      workingHours: allData[3]?.workingHours || { start: '', end: '' },
      priceRange: allData[3]?.priceRange || '',
      
      // Step 4
      idProof: allData[4]?.idProof || '',
      addressProof: allData[4]?.addressProof || '',
      certifications: allData[4]?.certifications || '',
      bankDetails: allData[4]?.bankDetails || '',
      termsAccepted: allData[4]?.termsAccepted || false,
    };
    
    // Save to Firebase
    const result = await saveProviderProfile(
      user.uid,
      user.email,
      user.name,
      user.phone || '',
      profileData as any
    );
    
    setSaving(false);
    
    if (result.success) {
      // Set flag for welcome message on dashboard
      sessionStorage.setItem('justCompletedSetup', 'true');
      
      toast({
        title: '🎉 Setup Complete!',
        description: 'Your provider profile has been saved successfully. Redirecting to your dashboard...',
        duration: 3000,
      });
      
      setTimeout(() => {
        router.push('/provider/dashboard');
      }, 2000);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Saving Profile',
        description: result.error || 'Unable to save your profile. Please try again.',
      });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex flex-col items-center ${step <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-all ${
              step < currentStep ? 'bg-primary border-primary text-white' :
              step === currentStep ? 'border-primary text-primary' :
              'border-muted-foreground/30'
            }`}>
              {step < currentStep ? <Check className="h-5 w-5" /> : step}
            </div>
            <span className="text-xs mt-1 hidden md:block">
              {step === 1 ? 'Business' : step === 2 ? 'Services' : step === 3 ? 'Availability' : 'Documents'}
            </span>
          </div>
          {step < 4 && (
            <Separator className={`w-12 md:w-24 mx-2 ${step < currentStep ? 'bg-primary' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/[0.02] to-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="UrbanEzii" width={40} height={40} />
            <h1 className="text-2xl font-bold font-headline">UrbanEzii</h1>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Card */}
        <Card className="shadow-2xl border-2">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-primary border-primary">
                Step {currentStep} of 4
              </Badge>
            </div>
            <CardTitle className="text-2xl">
              {currentStep === 1 && 'Business Information'}
              {currentStep === 2 && 'Service Details'}
              {currentStep === 3 && 'Availability & Pricing'}
              {currentStep === 4 && 'Documents & Verification'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Tell us about your company or brand.'}
              {currentStep === 2 && 'What services do you provide?'}
              {currentStep === 3 && 'When are you available to work?'}
              {currentStep === 4 && 'Upload your documents for verification.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
                {/* Step 1: Business Information */}
                {currentStep === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="companyLogo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Logo</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center bg-muted/50">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <div>
                                <Button type="button" variant="outline" size="sm">
                                  Upload Logo
                                </Button>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 2MB.</p>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company / Brand Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="individual" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Individual</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="firm" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Firm</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="company" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Company</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Bangalore" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (Optional, for detail)</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <FormLabel className="text-base font-semibold">Precise Location (for "nearby" feature)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-3 border-primary/50"
                        onClick={handleLocationAccess}
                        disabled={loadingLocation}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {loadingLocation ? 'Getting Location...' : location ? '✓ Location Captured' : 'Allow Location Access'}
                      </Button>
                      <FormDescription className="mt-2">
                        {location 
                          ? `✓ Location captured successfully`
                          : 'Or, enter your address manually above. Capturing your precise location helps customers find you easily.'}
                      </FormDescription>
                    </div>

                    <FormField
                      control={form.control}
                      name="businessDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your business, services, and what makes you stand out..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Step 2: Service Details */}
                {currentStep === 2 && (
                  <>
                    <div className="space-y-4">
                      <FormLabel className="text-base">Services Offered</FormLabel>
                      <p className="text-sm text-muted-foreground">Select service categories and add pricing for each subcategory.</p>
                      
                      <div className="space-y-3">
                        {Object.keys(serviceCategories).map((category) => {
                          const service = selectedServices.find(s => s.category === category);
                          const isExpanded = expandedCategory === category;
                          
                          return (
                            <Card key={category} className="overflow-hidden">
                              <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={!!service}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedServices([...selectedServices, {
                                          category,
                                          subcategories: [],
                                        }]);
                                        setExpandedCategory(category);
                                      } else {
                                        setSelectedServices(selectedServices.filter(s => s.category !== category));
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className="font-semibold">{category}</span>
                                  {service && service.subcategories.length > 0 && (
                                    <Badge variant="secondary" className="ml-2">
                                      {service.subcategories.length} service{service.subcategories.length > 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                                {service && (
                                  isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />
                                )}
                              </div>
                              
                              {service && isExpanded && (
                                <div className="border-t bg-muted/30 p-4 space-y-3">
                                  <div className="text-sm font-medium mb-3">Select services and set prices:</div>
                                  
                                  {serviceCategories[category].map((subcategory) => {
                                    const existingSub = service.subcategories.find(s => s.name === subcategory);
                                    
                                    return (
                                      <div key={subcategory} className="flex items-center gap-3 bg-background p-3 rounded-lg">
                                        <Checkbox
                                          checked={!!existingSub}
                                          onCheckedChange={(checked) => {
                                            const updatedServices = selectedServices.map(s => {
                                              if (s.category === category) {
                                                if (checked) {
                                                  return {
                                                    ...s,
                                                    subcategories: [...s.subcategories, { name: subcategory, price: 500 }],
                                                  };
                                                } else {
                                                  return {
                                                    ...s,
                                                    subcategories: s.subcategories.filter(sub => sub.name !== subcategory),
                                                  };
                                                }
                                              }
                                              return s;
                                            });
                                            setSelectedServices(updatedServices);
                                          }}
                                        />
                                        <span className="flex-1 text-sm">{subcategory}</span>
                                        {existingSub && (
                                          <div className="flex items-center gap-2">
                                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                              type="number"
                                              min="0"
                                              value={existingSub.price}
                                              onChange={(e) => {
                                                const updatedServices = selectedServices.map(s => {
                                                  if (s.category === category) {
                                                    return {
                                                      ...s,
                                                      subcategories: s.subcategories.map(sub =>
                                                        sub.name === subcategory
                                                          ? { ...sub, price: parseInt(e.target.value) || 0 }
                                                          : sub
                                                      ),
                                                    };
                                                  }
                                                  return s;
                                                });
                                                setSelectedServices(updatedServices);
                                              }}
                                              className="w-24 h-8"
                                              placeholder="Price"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                  
                                  {/* Custom Subcategory */}
                                  <div className="pt-3 border-t">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      onClick={() => {
                                        const customName = prompt('Enter custom service name:');
                                        if (customName) {
                                          const updatedServices = selectedServices.map(s => {
                                            if (s.category === category) {
                                              return {
                                                ...s,
                                                subcategories: [...s.subcategories, { name: customName, price: 500 }],
                                              };
                                            }
                                            return s;
                                          });
                                          setSelectedServices(updatedServices);
                                        }
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Custom Service
                                    </Button>
                                  </div>
                                  
                                  {/* Show custom subcategories */}
                                  {service.subcategories
                                    .filter(sub => !serviceCategories[category].includes(sub.name))
                                    .map((customSub, idx) => (
                                      <div key={`custom-${idx}`} className="flex items-center gap-3 bg-primary/5 p-3 rounded-lg border border-primary/20">
                                        <Badge variant="outline" className="text-xs">Custom</Badge>
                                        <span className="flex-1 text-sm font-medium">{customSub.name}</span>
                                        <div className="flex items-center gap-2">
                                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                          <Input
                                            type="number"
                                            min="0"
                                            value={customSub.price}
                                            onChange={(e) => {
                                              const updatedServices = selectedServices.map(s => {
                                                if (s.category === category) {
                                                  return {
                                                    ...s,
                                                    subcategories: s.subcategories.map(sub =>
                                                      sub.name === customSub.name
                                                        ? { ...sub, price: parseInt(e.target.value) || 0 }
                                                        : sub
                                                    ),
                                                  };
                                                }
                                                return s;
                                              });
                                              setSelectedServices(updatedServices);
                                            }}
                                            className="w-24 h-8"
                                            placeholder="Price"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => {
                                              const updatedServices = selectedServices.map(s => {
                                                if (s.category === category) {
                                                  return {
                                                    ...s,
                                                    subcategories: s.subcategories.filter(sub => sub.name !== customSub.name),
                                                  };
                                                }
                                                return s;
                                              });
                                              setSelectedServices(updatedServices);
                                            }}
                                          >
                                            <X className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                      
                      {selectedServices.length === 0 && (
                        <p className="text-sm text-destructive">Please select at least one service category.</p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0-1">Less than 1 year</SelectItem>
                              <SelectItem value="1-3">1-3 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any specific skills or specializations you'd like to highlight..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Step 3: Availability & Pricing */}
                {currentStep === 3 && (
                  <>
                    <FormField
                      control={form.control}
                      name="availability"
                      render={() => (
                        <FormItem>
                          <FormLabel>Working Days</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                            {weekDays.map((day) => (
                              <FormField
                                key={day}
                                control={form.control}
                                name="availability"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || [];
                                          field.onChange(
                                            checked
                                              ? [...current, day]
                                              : current.filter((val: string) => val !== day)
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">{day.slice(0, 3)}</FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="workingHours.start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workingHours.end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="priceRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Range</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your price range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="budget">Budget (₹200-500)</SelectItem>
                              <SelectItem value="standard">Standard (₹500-1000)</SelectItem>
                              <SelectItem value="premium">Premium (₹1000-2000)</SelectItem>
                              <SelectItem value="luxury">Luxury (₹2000+)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Step 4: Documents */}
                {currentStep === 4 && (
                  <>
                    <div className="space-y-4">
                      <FormItem>
                        <FormLabel>ID Proof (Aadhar/PAN/Driving License)</FormLabel>
                        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                          <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <Button type="button" variant="outline" size="sm">
                            Upload Document
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG up to 5MB</p>
                        </div>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Address Proof</FormLabel>
                        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                          <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <Button type="button" variant="outline" size="sm">
                            Upload Document
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG up to 5MB</p>
                        </div>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Certifications (Optional)</FormLabel>
                        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                          <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                          <Button type="button" variant="outline" size="sm">
                            Upload Document
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG up to 5MB</p>
                        </div>
                      </FormItem>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              I accept the Terms and Conditions
                            </FormLabel>
                            <FormDescription>
                              You agree to our Terms of Service and Privacy Policy.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormMessage />
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={onBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                  )}
                <Button type="submit" className="ml-auto" disabled={saving}>
                  {currentStep === 4 ? (
                    <>
                      {saving ? (
                        <>
                          <span className="mr-2">Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Complete Setup
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

