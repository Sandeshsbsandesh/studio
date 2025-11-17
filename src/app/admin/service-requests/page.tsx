'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Search, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceRequest {
  id: string;
  serviceName: string;
  location: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  createdAt?: any;
  reviewedAt?: any;
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    let filtered = requests;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => (r.status || 'pending') === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.serviceName?.toLowerCase().includes(query) ||
          r.name?.toLowerCase().includes(query) ||
          r.email?.toLowerCase().includes(query) ||
          r.phone?.includes(query) ||
          r.location?.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  }, [searchQuery, statusFilter, requests]);

  async function fetchServiceRequests() {
    try {
      const requestsSnap = await getDocs(collection(db, 'serviceRequests'));
      const requestsData = requestsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ServiceRequest[];

      // Sort by creation date (newest first)
      requestsData.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || 0;
        const bTime = b.createdAt?.toMillis?.() || 0;
        return bTime - aTime;
      });

      setRequests(requestsData);
      setFilteredRequests(requestsData);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast.error('Failed to fetch service requests');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(requestId: string, newStatus: string) {
    try {
      await updateDoc(doc(db, 'serviceRequests', requestId), {
        status: newStatus,
        reviewedAt: new Date(),
      });
      toast.success('Request status updated');
      fetchServiceRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  }

  async function handleDeleteRequest(requestId: string) {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await deleteDoc(doc(db, 'serviceRequests', requestId));
      toast.success('Request deleted successfully');
      fetchServiceRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => !r.status || r.status === 'pending').length,
    reviewed: requests.filter((r) => r.status === 'reviewed').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading service requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Service Requests</h1>
        <p className="text-muted-foreground">Review and manage customer service requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Reviewed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Service Info */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Service Request</h3>
                  <div className="space-y-2">
                    <div className="font-bold text-lg text-primary">{request.serviceName}</div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="flex-1">{request.location}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-3">
                      <strong>Details:</strong>
                      <p className="mt-1">{request.details}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Customer</h3>
                  <div className="space-y-2">
                    <div className="font-medium">{request.name}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${request.email}`} className="hover:text-primary">
                        {request.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${request.phone}`} className="hover:text-primary">
                        {request.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                      <Calendar className="w-3 h-3" />
                      Submitted: {request.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="font-semibold mb-3 text-sm text-muted-foreground">Actions</h3>
                  <div className="space-y-3">
                    <select
                      value={request.status || 'pending'}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg border-0 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(request.id, 'completed')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? 'No requests found matching your filters'
              : 'No service requests yet'}
          </div>
        )}
      </div>
    </div>
  );
}

