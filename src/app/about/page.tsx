import { CheckCircle, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight">About UrbanEzii</h1>
          <p className="mt-4 text-lg text-muted-foreground">Connecting communities with reliable local services.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
            <p className="mt-4 text-muted-foreground">
              Our mission is to simplify urban living by creating a single, trustworthy platform where users can effortlessly find and book essential local services. We aim to empower local service providers by giving them a platform to grow their business and connect with a wider customer base.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Empowering local economies.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Providing convenience and reliability.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Building a community of trust.</span>
              </li>
            </ul>
          </div>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-headline">Who We Are</h3>
                <p className="text-muted-foreground mt-1">We are a team of innovators passionate about solving everyday urban challenges with technology.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-headline">What We Do</h3>
                <p className="text-muted-foreground mt-1">We bridge the gap between skilled local professionals and residents in need of their services.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
