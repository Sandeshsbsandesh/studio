
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-2 md:col-span-1">
             <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="UrbanEzii Logo" width={32} height={32} />
                <span className="font-bold text-lg">UrbanEzii</span>
             </div>
            <p className="text-muted-foreground">Your Local Service Bridge.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Users</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-muted-foreground hover:text-primary">Our Services</Link></li>
              <li><Link href="/faqs" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Book a Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">For Providers</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Provider Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} UrbanEzii. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
