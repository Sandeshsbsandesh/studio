'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  Clock, 
  Star,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface ProviderProfile {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  city: string;
  address: string;
  businessDescription: string;
  experience: string;
  specialization?: string;
  availability: string[];
  workingHours: { start: string; end: string };
  priceRange: string;
  rating: number;
  totalRatings: number;
  reviews: number;
  totalBookings: number;
  completedJobs: number;
  monthlyEarnings: number;
  createdAt: Date;
}

export default function ProviderProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<ProviderProfile>>({});

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const providerDoc = await getDoc(doc(db, 'providers', user.uid));
      if (providerDoc.exists()) {
        const data = providerDoc.data();
        const profileData: ProviderProfile = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          businessName: data.businessName || '',
          businessType: data.businessType || '',
          city: data.city || '',
          address: data.address || '',
          businessDescription: data.businessDescription || '',
          experience: data.experience || '',
          specialization: data.specialization || '',
          availability: Array.isArray(data.availability) ? data.availability : [],
          workingHours: data.workingHours || { start: '', end: '' },
          priceRange: data.priceRange || '',
          rating: data.rating || 0,
          totalRatings: data.totalRatings || 0,
          reviews: data.reviews || 0,
          totalBookings: data.totalBookings || 0,
          completedJobs: data.completedJobs || 0,
          monthlyEarnings: data.monthlyEarnings || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
        setProfile(profileData);
        setEditedProfile(profileData);
      } else {
        console.log('No provider profile found');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid || !editedProfile) return;
    
    setSaving(true);
    try {
      await updateDoc(doc(db, 'providers', user.uid), {
        name: editedProfile.name,
        phone: editedProfile.phone,
        businessName: editedProfile.businessName,
        businessDescription: editedProfile.businessDescription,
        city: editedProfile.city,
        address: editedProfile.address,
        specialization: editedProfile.specialization,
      });
      
      setProfile(editedProfile as ProviderProfile);
      setEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.uid) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
              <Button onClick={() => window.location.href = '/login?as=provider'}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Provider profile not found. Please complete the setup wizard.</p>
              <Button onClick={() => window.location.href = '/provider/setup-wizard'}>
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-primary/[0.02] to-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your professional information</p>
          </div>
          {!editing ? (
            <Button onClick={() => setEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setEditing(false);
                setEditedProfile(profile);
              }}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={`https://avatar.vercel.sh/${profile.name}.png`} />
                <AvatarFallback className="text-2xl font-bold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-1">{profile.businessName}</CardTitle>
                    <CardDescription className="text-base">
                      {profile.name} • Member since {format(profile.createdAt, 'MMMM yyyy')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Star className="h-5 w-5 mr-1 text-yellow-500 fill-yellow-500" />
                    {profile.rating > 0 ? profile.rating.toFixed(1) : 'New'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  {editing ? (
                    <Input
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{profile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="font-medium">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {editing ? (
                    <Input
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Business Type
                  </Label>
                  <p className="font-medium capitalize">{profile.businessType}</p>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">Business Details</h3>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Business Name
                  </Label>
                  {editing ? (
                    <Input
                      value={editedProfile.businessName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{profile.businessName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    City
                  </Label>
                  {editing ? (
                    <Input
                      value={editedProfile.city}
                      onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                    />
                  ) : (
                    <p className="font-medium">{profile.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  {editing ? (
                    <Textarea
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                      rows={2}
                    />
                  ) : (
                    <p className="font-medium">{profile.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Experience
                  </Label>
                  <p className="font-medium">{profile.experience}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <Label className="text-muted-foreground">Business Description</Label>
              {editing ? (
                <Textarea
                  value={editedProfile.businessDescription}
                  onChange={(e) => setEditedProfile({ ...editedProfile, businessDescription: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="font-medium">{profile.businessDescription}</p>
              )}
            </div>

            {/* Specialization */}
            {(editing || profile.specialization) && (
              <div className="mt-4 space-y-2">
                <Label className="text-muted-foreground">Specialization</Label>
                {editing ? (
                  <Textarea
                    value={editedProfile.specialization}
                    onChange={(e) => setEditedProfile({ ...editedProfile, specialization: e.target.value })}
                    rows={2}
                    placeholder="Your areas of expertise..."
                  />
                ) : (
                  <p className="font-medium">{profile.specialization}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{profile.totalBookings}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{profile.completedJobs}</p>
              <p className="text-sm text-muted-foreground mt-1">Completed Jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-yellow-600">{profile.reviews}</p>
              <p className="text-sm text-muted-foreground mt-1">Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">₹{profile.monthlyEarnings}</p>
              <p className="text-sm text-muted-foreground mt-1">Monthly Earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Your working hours and days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Working Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(profile.availability) && profile.availability.length > 0 ? (
                    profile.availability.map((day) => (
                      <Badge key={day} variant="secondary">{day}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No working days set</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Working Hours</Label>
                <p className="font-medium mt-1">
                  {profile.workingHours?.start && profile.workingHours?.end 
                    ? `${profile.workingHours.start} - ${profile.workingHours.end}`
                    : 'Not set'}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Price Range</Label>
                <p className="font-medium mt-1 capitalize">{profile.priceRange || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

