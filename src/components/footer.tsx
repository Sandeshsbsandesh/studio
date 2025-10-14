import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold font-headline text-lg mb-2">UrbanEzii</h3>
            <p className="text-sm text-muted-foreground">Your Local Service Bridge.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Users</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/#services">
                  Our Services
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/login">
                  Book a Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Providers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/features">
                  Features
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-muted-foreground hover:text-primary" href="/provider/dashboard">
                  Provider Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear() + 1} UrbanEzii Technologies. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link className="hover:text-primary" href="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="hover:text-primary" href="/terms-of-use">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
