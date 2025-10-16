'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Plus, Edit, Trash2, IndianRupee, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Subcategory {
  name: string;
  price: number;
}

interface Service {
  category: string;
  subcategories: Subcategory[];
}

const availableCategories = [
  'Electricians',
  'Plumbers',
  'Cleaners',
  'Doctor On Call',
  'Water Can Delivery',
  'Cylinder Delivery',
  'Personal Cooks',
  'House Maids',
  'Painters',
  'Shifters',
  'Local Buddy',
];

export default function ProviderServicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Add Service Dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // Edit Subcategory Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<{ categoryIndex: number; subIndex: number } | null>(null);
  const [editSubName, setEditSubName] = useState('');
  const [editSubPrice, setEditSubPrice] = useState('');
  
  // Add Subcategory Dialog
  const [isAddSubDialogOpen, setIsAddSubDialogOpen] = useState(false);
  const [addSubCategory, setAddSubCategory] = useState<number | null>(null);
  const [newSubName, setNewSubName] = useState('');
  const [newSubPrice, setNewSubPrice] = useState('');

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadServices = async () => {
    console.log('loadServices called, user:', user);
    
    if (!user?.uid) {
      console.log('No user UID found, stopping load');
      setLoading(false);
      return;
    }
    
    console.log('Loading services for user:', user.uid);
    setLoading(true);
    try {
      const providerDoc = await getDoc(doc(db, 'providers', user.uid));
      if (providerDoc.exists()) {
        const data = providerDoc.data();
        console.log('Provider document found, services:', data.services);
        setServices(data.services || []);
      } else {
        console.log('No provider document found for UID:', user.uid);
        setServices([]);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load services',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveServices = async (updatedServices: Service[]) => {
    if (!user?.uid) return;
    
    setSaving(true);
    try {
      const serviceCategories = updatedServices.map(s => s.category);
      await updateDoc(doc(db, 'providers', user.uid), {
        services: updatedServices,
        serviceCategories: serviceCategories,
      });
      
      setServices(updatedServices);
      toast({
        title: 'Success',
        description: 'Services updated successfully',
      });
    } catch (error) {
      console.error('Error saving services:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save services',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = async () => {
    if (!newCategory) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a category',
      });
      return;
    }
    
    if (services.some(s => s.category === newCategory)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'This category already exists',
      });
      return;
    }
    
    const updatedServices = [...services, { category: newCategory, subcategories: [] }];
    await saveServices(updatedServices);
    setIsAddDialogOpen(false);
    setNewCategory('');
  };

  const handleDeleteService = async (index: number) => {
    if (confirm('Are you sure you want to delete this service category?')) {
      const updatedServices = services.filter((_, i) => i !== index);
      await saveServices(updatedServices);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubName || !newSubPrice || addSubCategory === null) return;
    
    const updatedServices = [...services];
    updatedServices[addSubCategory].subcategories.push({
      name: newSubName,
      price: parseInt(newSubPrice),
    });
    
    await saveServices(updatedServices);
    setIsAddSubDialogOpen(false);
    setAddSubCategory(null);
    setNewSubName('');
    setNewSubPrice('');
  };

  const handleEditSubcategory = async () => {
    if (!editingService || !editSubName || !editSubPrice) return;
    
    const updatedServices = [...services];
    updatedServices[editingService.categoryIndex].subcategories[editingService.subIndex] = {
      name: editSubName,
      price: parseInt(editSubPrice),
    };
    
    await saveServices(updatedServices);
    setIsEditDialogOpen(false);
    setEditingService(null);
    setEditSubName('');
    setEditSubPrice('');
  };

  const handleDeleteSubcategory = async (categoryIndex: number, subIndex: number) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      const updatedServices = [...services];
      updatedServices[categoryIndex].subcategories.splice(subIndex, 1);
      await saveServices(updatedServices);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Services</h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading your services...</p>
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
              <p className="text-muted-foreground mb-4">Please log in to view your services</p>
              <Button onClick={() => window.location.href = '/login?as=provider'}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-background via-primary/[0.02] to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-headline">My Services</h1>
            <p className="text-muted-foreground mt-1">Manage your service offerings and pricing</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service Category
          </Button>
        </div>

        {/* Services List */}
        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No services added yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {services.map((service, categoryIndex) => (
              <Card key={categoryIndex} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{service.category}</CardTitle>
                      <CardDescription>
                        {service.subcategories.length} subcategories
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAddSubCategory(categoryIndex);
                          setIsAddSubDialogOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subcategory
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteService(categoryIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {service.subcategories.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No subcategories added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {service.subcategories.map((sub, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{sub.name}</span>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              {sub.price}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingService({ categoryIndex, subIndex });
                                setEditSubName(sub.name);
                                setEditSubPrice(sub.price.toString());
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubcategory(categoryIndex, subIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Service Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Service Category</DialogTitle>
              <DialogDescription>Select a new service category to add</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Service Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories
                      .filter(cat => !services.some(s => s.category === cat))
                      .map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddService} disabled={saving}>
                {saving ? 'Adding...' : 'Add Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Subcategory Dialog */}
        <Dialog open={isAddSubDialogOpen} onOpenChange={setIsAddSubDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subcategory</DialogTitle>
              <DialogDescription>Add a new service subcategory with pricing</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subcategory Name</Label>
                <Input
                  placeholder="e.g., Fan Installation/Repair"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 500"
                  value={newSubPrice}
                  onChange={(e) => setNewSubPrice(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSubDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubcategory} disabled={saving}>
                {saving ? 'Adding...' : 'Add Subcategory'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Subcategory Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subcategory</DialogTitle>
              <DialogDescription>Update service name and pricing</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subcategory Name</Label>
                <Input
                  value={editSubName}
                  onChange={(e) => setEditSubName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={editSubPrice}
                  onChange={(e) => setEditSubPrice(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubcategory} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

