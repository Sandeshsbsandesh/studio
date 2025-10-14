
import { notFound } from 'next/navigation';
import { services, providers } from '@/lib/data';
import ServiceProvidersList from './service-providers-list';

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find(s => s.href === `/service/${params.slug}`);

  if (!service) {
    notFound();
  }

  const serviceProviders = providers[params.slug] || [];

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

        <ServiceProvidersList serviceSlug={params.slug} serviceProviders={serviceProviders} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return services.map(service => ({
    slug: service.href.split('/').pop(),
  }));
}
