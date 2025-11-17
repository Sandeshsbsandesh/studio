import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Admin Panel - UrbanEzii',
  description: 'Manage your UrbanEzii platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

