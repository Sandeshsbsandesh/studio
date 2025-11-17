'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Search, Edit, Save, X, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface Provider {
  id: string;
  name: string;
  category?: string;
  services?: Record<string, Record<string, number>>;
}

interface EditingService {
  providerId: string;
  category: string;
  serviceName: string;
  currentPrice: number;
}

export default function PricingEditorPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<EditingService | null>(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProviders(providers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProviders(
        providers.filter(
          (p) =>
            p.name?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, providers]);

  async function fetchProviders() {
    try {
      const providersSnap = await getDocs(collection(db, 'providers'));
      const providersData = providersSnap.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name || 'Unknown',
          category: doc.data().category,
          services: doc.data().services || {},
        }))
        .filter((p) => p.services && Object.keys(p.services).length > 0);

      setProviders(providersData);
      setFilteredProviders(providersData);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to fetch providers');
    } finally {
      setIsLoading(false);
    }
  }

  function startEditing(provider: Provider, category: string, serviceName: string, currentPrice: number) {
    setEditingService({
      providerId: provider.id,
      category,
      serviceName,
      currentPrice,
    });
    setNewPrice(currentPrice.toString());
  }

  function cancelEditing() {
    setEditingService(null);
    setNewPrice('');
  }

  async function savePrice() {
    if (!editingService) return;

    const priceValue = parseFloat(newPrice);
    if (isNaN(priceValue) || priceValue < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const provider = providers.find((p) => p.id === editingService.providerId);
      if (!provider || !provider.services) return;

      const updatedServices = { ...provider.services };
      if (updatedServices[editingService.category]) {
        updatedServices[editingService.category] = {
          ...updatedServices[editingService.category],
          [editingService.serviceName]: priceValue,
        };
      }

      await updateDoc(doc(db, 'providers', editingService.providerId), {
        services: updatedServices,
      });

      toast.success('Price updated successfully!');
      fetchProviders();
      cancelEditing();
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Failed to update price');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Pricing Editor</h1>
        <p className="text-muted-foreground">
          Edit service prices for all providers ({providers.length} providers with pricing)
        </p>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search providers by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Providers with Pricing */}
      <div className="space-y-6">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-card rounded-xl border p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold">{provider.name}</h2>
                <p className="text-sm text-muted-foreground">{provider.category}</p>
              </div>

              {provider.services && Object.entries(provider.services).map(([category, services]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="font-semibold mb-3 text-primary">{category}</h3>
                  <div className="space-y-2">
                    {Object.entries(services).map(([serviceName, price]) => {
                      const isEditing =
                        editingService?.providerId === provider.id &&
                        editingService?.category === category &&
                        editingService?.serviceName === serviceName;

                      return (
                        <div
                          key={serviceName}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/20 transition-colors"
                        >
                          <span className="font-medium">{serviceName}</span>

                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 border rounded-lg px-3 py-1">
                                <IndianRupee className="w-4 h-4" />
                                <input
                                  type="number"
                                  value={newPrice}
                                  onChange={(e) => setNewPrice(e.target.value)}
                                  className="w-24 outline-none"
                                  autoFocus
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') savePrice();
                                    if (e.key === 'Escape') cancelEditing();
                                  }}
                                />
                              </div>
                              <button
                                onClick={savePrice}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 font-semibold text-green-600">
                                <IndianRupee className="w-4 h-4" />
                                {typeof price === 'number' ? price : String(price).replace(/[₱₹£$€¥]/g, '').trim()}
                              </div>
                              <button
                                onClick={() => startEditing(provider, category, serviceName, typeof price === 'number' ? price : parseFloat(String(price).replace(/[₱₹£$€¥]/g, '').trim()))}
                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                title="Edit Price"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">
            {searchQuery ? 'No providers found matching your search' : 'No providers with pricing data'}
          </div>
        )}
      </div>
    </div>
  );
}

