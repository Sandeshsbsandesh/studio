import Link from 'next/link';
import { Icons } from './icons';

export default function Footer() {
  return (
    <footer className="bg-transparent text-sidebar-foreground/70 text-xs p-2">
        <p>
          © {new Date().getFullYear()} Urbanezii
        </p>
    </footer>
  );
}
