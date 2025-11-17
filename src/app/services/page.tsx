import ServiceCard from '@/components/service-card';
import { services } from '@/lib/data';
import ServiceRequestForm from '@/components/service-request-form';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Our Services</h1>
        <p className="mt-4 text-lg text-muted-foreground font-body">
          From daily chores to urgent needs, we've got you covered. Browse our wide range of services designed to make your life easier.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map(service => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
            href={service.href}
          />
        ))}
      </div>
      
      {/* Service Request Form */}
      <div className="mt-20">
        <ServiceRequestForm />
      </div>
    </div>
  );
}
