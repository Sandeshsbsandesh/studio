'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Wrench } from 'lucide-react';
import { fixProviderServiceCategories } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function CheckProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fixing, setFixing] = useState(false);
  const { toast } = useToast();

  const handleAutoFix = async () => {
    if (!confirm('This will automatically regenerate serviceCategories array for all providers missing it. Continue?')) {
      return;
    }

    setFixing(true);
    try {
      const result = await fixProviderServiceCategories();
      
      if (result.success) {
        toast({
          title: '✅ Auto-Fix Complete',
          description: `Fixed: ${result.fixed}, Skipped (already good): ${result.skipped}, Total: ${result.total}`,
        });

        if (result.errors.length > 0) {
          console.warn('Some providers could not be fixed:', result.errors);
          toast({
            variant: 'destructive',
            title: 'Some providers had issues',
            description: `${result.errors.length} providers could not be auto-fixed. Check console for details.`,
          });
        }

        // Refresh the list
        await fetchProviders();
      } else {
        toast({
          variant: 'destructive',
          title: 'Auto-Fix Failed',
          description: result.error || 'Unknown error occurred',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fix providers',
      });
    } finally {
      setFixing(false);
    }
  };

  const fetchProviders = async () => {
    try {
      setRefreshing(true);
      const providersCol = collection(db, 'providers');
      const snapshot = await getDocs(providersCol);
      
      const providersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProviders(providersList);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const getStatusIcon = (provider: any) => {
    const hasServiceCategories = Array.isArray(provider.serviceCategories) && provider.serviceCategories.length > 0;
    const hasServices = Array.isArray(provider.services) && provider.services.length > 0;
    const isActive = provider.active !== false;

    if (hasServiceCategories && hasServices && isActive) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (!isActive) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusMessage = (provider: any) => {
    const hasServiceCategories = Array.isArray(provider.serviceCategories) && provider.serviceCategories.length > 0;
    const hasServices = Array.isArray(provider.services) && provider.services.length > 0;
    const isActive = provider.active !== false;

    if (!isActive) {
      return { text: 'Provider is INACTIVE', color: 'text-red-600', variant: 'destructive' as const };
    }
    if (!hasServiceCategories && !hasServices) {
      return { text: 'No services/categories configured', color: 'text-red-600', variant: 'destructive' as const };
    }
    if (!hasServiceCategories) {
      return { text: 'serviceCategories array is MISSING or EMPTY', color: 'text-yellow-600', variant: 'warning' as const };
    }
    if (!hasServices) {
      return { text: 'services array is MISSING or EMPTY', color: 'text-yellow-600', variant: 'warning' as const };
    }
    return { text: 'All Good! Will appear in customer search', color: 'text-green-600', variant: 'default' as const };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading providers...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Provider Database Check</h1>
            <p className="text-muted-foreground mt-2">Total Providers: {providers.length}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleAutoFix} 
              disabled={fixing || refreshing}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <Wrench className={`h-4 w-4 mr-2 ${fixing ? 'animate-spin' : ''}`} />
              Auto-Fix All
            </Button>
            <Button onClick={fetchProviders} disabled={refreshing || fixing} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {providers.map((provider) => {
            const status = getStatusMessage(provider);
            
            return (
              <Card key={provider.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(provider)}
                      <div>
                        <CardTitle className="text-xl">
                          {provider.businessName || provider.companyName || provider.name || 'Unnamed Provider'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">ID: {provider.id}</p>
                      </div>
                    </div>
                    <Badge variant={status.variant as any}>{status.text}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Active Status */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Active:</span>{' '}
                      <Badge variant={provider.active === false ? 'destructive' : 'default'}>
                        {provider.active === false ? 'NO' : 'YES'}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span>{' '}
                      <span className="text-muted-foreground">{provider.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span>{' '}
                      <span className="text-muted-foreground">{provider.phone || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Service Categories */}
                  <div>
                    <div className="font-semibold text-sm mb-2">
                      serviceCategories Array (used for customer search):
                    </div>
                    {Array.isArray(provider.serviceCategories) && provider.serviceCategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {provider.serviceCategories.map((cat: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-green-50">
                            ✅ {cat}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="destructive">❌ EMPTY OR MISSING</Badge>
                    )}
                  </div>

                  {/* Services Detail */}
                  <div>
                    <div className="font-semibold text-sm mb-2">
                      services Array (full service details):
                    </div>
                    {Array.isArray(provider.services) && provider.services.length > 0 ? (
                      <div className="space-y-2">
                        {provider.services.map((service: any, idx: number) => (
                          <div key={idx} className="border rounded p-3 bg-muted/30">
                            <div className="font-medium">{service.category || 'Unnamed Category'}</div>
                            {Array.isArray(service.subcategories) && service.subcategories.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {service.subcategories.length} subcategory/subcategories:{' '}
                                {service.subcategories.map((sub: any) => sub.name).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="destructive">❌ EMPTY OR MISSING</Badge>
                    )}
                  </div>

                  {/* Old Category Field (backward compatibility) */}
                  {provider.category && (
                    <div>
                      <div className="font-semibold text-sm mb-2">
                        Old "category" field (legacy):
                      </div>
                      <Badge variant="outline">{provider.category}</Badge>
                    </div>
                  )}

                  {/* Diagnosis */}
                  <div className="border-t pt-4">
                    <div className="font-semibold text-sm mb-2">🔍 Diagnosis:</div>
                    <div className={`text-sm ${status.color}`}>
                      {provider.active === false && (
                        <div className="mb-2">
                          ❌ <strong>Problem:</strong> Provider is marked as inactive. Set active=true or remove this field.
                        </div>
                      )}
                      {(!Array.isArray(provider.serviceCategories) || provider.serviceCategories.length === 0) && (
                        <div className="mb-2">
                          ❌ <strong>Problem:</strong> serviceCategories array is missing or empty. This is required for
                          customer searches to work. Provider should go to /provider/services and save their services.
                        </div>
                      )}
                      {(!Array.isArray(provider.services) || provider.services.length === 0) && (
                        <div className="mb-2">
                          ⚠️ <strong>Warning:</strong> services array is missing or empty. While not critical for search,
                          customers won't be able to see specific service options.
                        </div>
                      )}
                      {Array.isArray(provider.serviceCategories) && 
                       provider.serviceCategories.length > 0 && 
                       provider.active !== false && (
                        <div className="text-green-600">
                          ✅ <strong>Success:</strong> This provider should appear in customer searches for:{' '}
                          <strong>{provider.serviceCategories.join(', ')}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {providers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No providers found in database.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

