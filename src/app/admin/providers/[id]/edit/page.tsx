'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  completedJobs: number;
  status: string;
}

export default function EditProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [providerId, setProviderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    address: '',
    latitude: '',
    longitude: '',
    rating: '',
    completedJobs: '',
    status: 'active',
  });

  useEffect(() => {
    params.then((p) => {
      setProviderId(p.id);
      fetchProvider(p.id);
    });
  }, []);

  async function fetchProvider(id: string) {
    try {
      const docRef = doc(db, 'providers', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Provider data loaded:', data); // Debug log
        console.log('Category value:', data.category); // Debug log
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          category: data.category || '', // Will be empty if not set
          address: data.address || '',
          latitude: data.latitude?.toString() || '',
          longitude: data.longitude?.toString() || '',
          rating: data.rating?.toString() || '4.5',
          completedJobs: data.completedJobs?.toString() || '0',
          status: data.status || 'active',
        });
        
        // If service type is missing, show a warning
        if (!data.category) {
          console.warn('⚠️ Service Type is missing for this provider. Please select one.');
          toast.info('Please select a service type for this provider', { duration: 5000 });
        }
      } else {
        toast.error('Provider not found');
        router.push('/admin/providers');
      }
    } catch (error) {
      console.error('Error fetching provider:', error);
      toast.error('Failed to fetch provider');
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!formData.name || !formData.phone || !formData.category) {
        toast.error('Please fill in all required fields (Name, Phone, Service Type)');
        setIsSaving(false);
        return;
      }

      const updateData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone,
        category: formData.category,
        address: formData.address || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        rating: parseFloat(formData.rating),
        completedJobs: parseInt(formData.completedJobs),
        status: formData.status,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'providers', providerId), updateData);

      toast.success('Provider updated successfully!');
      router.push('/admin/providers');
    } catch (error) {
      console.error('Error updating provider:', error);
      toast.error('Failed to update provider');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading provider...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/providers"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-headline">Edit Provider</h1>
          <p className="text-muted-foreground">Update provider information</p>
        </div>
      </div>

      {/* Debug Info - Remove after testing */}
      {formData.name && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-semibold mb-2">🔍 Debug Info (Current values loaded from Firebase):</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>Name:</strong> {formData.name || '❌ Not loaded'}</div>
            <div className={!formData.category ? 'text-orange-600' : ''}>
              <strong>Service Type:</strong> {formData.category || '⚠️ MISSING - Select one below'}
            </div>
            <div><strong>Phone:</strong> {formData.phone || '❌ Not loaded'}</div>
            <div><strong>Email:</strong> {formData.email || '❌ Not loaded'}</div>
            <div><strong>Status:</strong> {formData.status || '❌ Not loaded'}</div>
            <div><strong>Rating:</strong> {formData.rating || '❌ Not loaded'}</div>
          </div>
          {!formData.category && (
            <p className="mt-3 text-xs text-orange-700 bg-orange-100 p-2 rounded">
              ⚠️ <strong>Action Required:</strong> This provider was created without a service type. Please select one from the dropdown below and save.
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Provider Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Service Type <span className="text-red-500">*</span>
                {!formData.category && (
                  <span className="ml-2 text-xs text-orange-600 font-normal">⚠️ Not set - please select one</span>
                )}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${!formData.category ? 'border-orange-400 bg-orange-50' : 'border-input'}`}
                required
              >
                <option value="">⚠️ Select service type (required)</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="House Cleaning">House Cleaning</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Appliance Repair">Appliance Repair</option>
                <option value="Pest Control">Pest Control</option>
                <option value="AC Repair">AC Repair</option>
                <option value="Home Appliance Repair">Home Appliance Repair</option>
                {/* Show current value if it doesn't match any option */}
                {formData.category && !['Electrician', 'Plumber', 'House Cleaning', 'Carpenter', 'Painter', 'Appliance Repair', 'Pest Control', 'AC Repair', 'Home Appliance Repair'].includes(formData.category) && (
                  <option value={formData.category}>{formData.category} (Current)</option>
                )}
              </select>
              {formData.category && (
                <p className="text-xs text-muted-foreground mt-1">
                  Current Service Type: {formData.category}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="12.9716"
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-sm font-medium mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="77.5946"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium mb-2">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="completedJobs" className="block text-sm font-medium mb-2">
                Completed Jobs
              </label>
              <input
                type="number"
                min="0"
                id="completedJobs"
                name="completedJobs"
                value={formData.completedJobs}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
          <Link
            href="/admin/providers"
            className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors font-semibold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

