'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Edit, MapPin, Phone, Mail, Star, Briefcase, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function ViewProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [providerId, setProviderId] = useState<string>('');
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setProvider({ id: docSnap.id, ...docSnap.data() });
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

  if (!provider) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/providers"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-headline">{provider.name}</h1>
            <p className="text-muted-foreground">Service Type: {provider.category}</p>
          </div>
        </div>
        <Link
          href={`/admin/providers/${providerId}/edit`}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Provider
        </Link>
      </div>

      {/* Provider Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <div className="space-y-4">
            {provider.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a href={`tel:${provider.phone}`} className="font-medium hover:text-primary">
                    {provider.phone}
                  </a>
                </div>
              </div>
            )}
            {provider.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${provider.email}`} className="font-medium hover:text-primary">
                    {provider.email}
                  </a>
                </div>
              </div>
            )}
            {provider.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{provider.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-xl font-bold mb-4">Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">{provider.rating?.toFixed(1) || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                <p className="text-2xl font-bold">{provider.completedJobs || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${provider.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-bold capitalize">{provider.status || 'Active'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Pricing */}
      {provider.services && Object.keys(provider.services).length > 0 && (
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-xl font-bold mb-4">Services & Pricing</h2>
          <div className="space-y-6">
            {Object.entries(provider.services).map(([category, services]: [string, any]) => (
              <div key={category}>
                <h3 className="font-semibold text-primary mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(services).map(([serviceName, price]) => (
                    <div
                      key={serviceName}
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      <span className="font-medium">{serviceName}</span>
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        {typeof price === 'number' ? price : String(price).replace(/[₱₹£$€¥]/g, '').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Coordinates */}
      {(provider.latitude || provider.longitude) && (
        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-xl font-bold mb-4">Location Coordinates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Latitude</p>
              <p className="font-mono font-medium">{provider.latitude}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Longitude</p>
              <p className="font-mono font-medium">{provider.longitude}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

