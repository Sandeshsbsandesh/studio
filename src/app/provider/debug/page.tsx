'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ProviderDebugPage() {
  const { user } = useAuth();
  const [providerData, setProviderData] = useState<any>(null);
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (user?.uid) {
      loadDebugInfo();
    }
  }, [user]);

  const loadDebugInfo = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setIssues([]);
    setRecommendations([]);
    
    try {
      // Load current provider data
      const providerDoc = await getDoc(doc(db, 'providers', user.uid));
      
      if (providerDoc.exists()) {
        const data = providerDoc.data();
        setProviderData(data);
        
        // Check for issues
        const foundIssues: string[] = [];
        const foundRecommendations: string[] = [];
        
        // Check active status
        if (data.active === false) {
          foundIssues.push('❌ Provider is marked as INACTIVE');
          foundRecommendations.push('Set active: true in your provider profile');
        } else {
          console.log('✅ Provider is ACTIVE');
        }
        
        // Check services
        if (!data.services || data.services.length === 0) {
          foundIssues.push('❌ No services added');
          foundRecommendations.push('Add at least one service category with subcategories');
        } else {
          console.log('✅ Services found:', data.services.length);
        }
        
        // Check serviceCategories array
        if (!data.serviceCategories || data.serviceCategories.length === 0) {
          foundIssues.push('❌ serviceCategories array is empty or missing');
          foundRecommendations.push('This array is required for provider discovery. Update your services to fix this.');
        } else {
          console.log('✅ Service categories:', data.serviceCategories);
        }
        
        // Check verified status
        if (data.verified === false) {
          foundRecommendations.push('⚠️ Provider not verified yet (this may limit visibility in future)');
        }
        
        // Check location
        if (!data.location && !data.latitude && !data.longitude) {
          foundRecommendations.push('⚠️ No location set - customers may not be able to find you based on location');
        }
        
        // Check business name
        if (!data.businessName && !data.name) {
          foundIssues.push('❌ No business name set');
        }
        
        // Check city
        if (!data.city) {
          foundRecommendations.push('⚠️ No city set - may affect local search');
        }
        
        setIssues(foundIssues);
        setRecommendations(foundRecommendations);
      } else {
        setIssues(['❌ Provider document does not exist in database!']);
        setRecommendations(['Complete the setup wizard to create your provider profile']);
      }
      
      // Load all providers to compare
      const providersSnapshot = await getDocs(collection(db, 'providers'));
      setAllProviders(providersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      
    } catch (error) {
      console.error('Error loading debug info:', error);
      setIssues([`❌ Error loading data: ${error}`]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Loading debug information...</p>
      </div>
    );
  }

  if (!user?.uid) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Please log in to view debug information</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Provider Debug Information</h1>
          <p className="text-muted-foreground mt-2">
            Diagnostic information to help identify why your provider profile may not be visible to customers
          </p>
        </div>
        <Button onClick={loadDebugInfo} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">All Good!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">{issues.length} Issue(s) Found</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Status</CardTitle>
          </CardHeader>
          <CardContent>
            {providerData?.active !== false ? (
              <Badge className="bg-green-600">ACTIVE</Badge>
            ) : (
              <Badge variant="destructive">INACTIVE</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{allProviders.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {allProviders.filter(p => p.active !== false).length} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Critical Issues
            </CardTitle>
            <CardDescription>These issues are preventing your profile from showing to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {issues.map((issue, index) => (
                <li key={index} className="text-red-800">{issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recommendations
            </CardTitle>
            <CardDescription>Suggestions to improve your profile visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-yellow-800">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Provider Data Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Provider Data</CardTitle>
          <CardDescription>Raw data from Firestore</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Basic Information:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">UID:</span>{' '}
                  <span className="font-mono">{user.uid}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Business Name:</span>{' '}
                  {providerData?.businessName || providerData?.name || 'Not set'}
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>{' '}
                  {providerData?.email || 'Not set'}
                </div>
                <div>
                  <span className="text-muted-foreground">City:</span>{' '}
                  {providerData?.city || 'Not set'}
                </div>
                <div>
                  <span className="text-muted-foreground">Active:</span>{' '}
                  <Badge variant={providerData?.active !== false ? 'default' : 'destructive'}>
                    {String(providerData?.active !== false)}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Verified:</span>{' '}
                  <Badge variant={providerData?.verified ? 'default' : 'secondary'}>
                    {String(providerData?.verified || false)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold mb-2">Service Categories Array:</p>
              {providerData?.serviceCategories && providerData.serviceCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {providerData.serviceCategories.map((cat: string, idx: number) => (
                    <Badge key={idx} variant="outline">{cat}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-red-600">❌ No service categories found!</p>
              )}
            </div>

            <div>
              <p className="font-semibold mb-2">Services Details:</p>
              {providerData?.services && providerData.services.length > 0 ? (
                <div className="space-y-2">
                  {providerData.services.map((service: any, idx: number) => (
                    <div key={idx} className="border rounded p-3 bg-gray-50">
                      <p className="font-medium">{service.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.subcategories?.length || 0} subcategories
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-red-600">❌ No services found!</p>
              )}
            </div>

            <div>
              <p className="font-semibold mb-2">Location Data:</p>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Latitude:</span>{' '}
                  {providerData?.location?.latitude || providerData?.latitude || 'Not set'}
                </p>
                <p>
                  <span className="text-muted-foreground">Longitude:</span>{' '}
                  {providerData?.location?.longitude || providerData?.longitude || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How Customer Discovery Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Customer Discovery Works</CardTitle>
          <CardDescription>Technical details about how customers find providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>When a customer searches for a service (e.g., "Electricians"), the system:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Fetches ALL providers from the database</li>
              <li>Filters out providers where <code className="bg-gray-100 px-1">active === false</code></li>
              <li>
                Checks if provider's <code className="bg-gray-100 px-1">serviceCategories</code> array includes the searched category
              </li>
              <li>Returns matching providers to display</li>
            </ol>
            <p className="mt-4 font-semibold">For your provider to appear:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <code className="bg-gray-100 px-1">active</code> must be <code className="bg-green-100 px-1">true</code> or undefined
              </li>
              <li>
                <code className="bg-gray-100 px-1">serviceCategories</code> array must include the category name
              </li>
              <li>
                <code className="bg-gray-100 px-1">services</code> array should have at least one service with subcategories
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Fix Button */}
      {issues.length > 0 && (
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => window.location.href = '/provider/services'}
              className="w-full"
            >
              Go to Services Page to Add/Update Services
            </Button>
            <Button 
              onClick={() => window.location.href = '/provider/profile'}
              variant="outline"
              className="w-full"
            >
              Go to Profile Page to Update Information
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

