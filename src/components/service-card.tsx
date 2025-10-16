
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  return (
    <Link href={href} className="group h-full">
      <Card className="h-full transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-primary group-hover:scale-105 bg-card cursor-pointer">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-6 transition-all duration-300">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-lg font-headline font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
          <CardDescription className="font-body">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
