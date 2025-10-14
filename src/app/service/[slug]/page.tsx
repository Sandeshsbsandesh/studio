
import { notFound } from 'next/navigation';
import { services } from '@/lib/data';
import ServiceProvidersList from './service-providers-list';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function getProviders(serviceSlug: string) {
  try {
    const providersCol = collection(db, 'providers');
    // Correcting the query to match the full path stored in Firestore
    const fullPath = `/service/${serviceSlug}`;
    const q = query(providersCol, where('serviceSlug', '==', fullPath));
    const querySnapshot = await getDocs(q);
    const providers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return providers;
  } catch (error) {
    console.error("Error fetching providers: ", error);
    return [];
  }
}


export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find(s => s.href === `/service/${params.slug}`);

  if (!service) {
    notFound();
  }

  const serviceProviders = await getProviders(params.slug);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <div className="inline-block bg-primary/10 p-4 rounded-full text-primary mb-4">
                {service.icon}
            </div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">{service.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{service.description}</p>
        </div>

        <ServiceProvidersList serviceSlug={params.slug} serviceProviders={serviceProviders as any} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return services.map(service => ({
    slug: service.href.split('/').pop(),
  }));
}
