
import type { SVGProps } from 'react';
import Image from 'next/image';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <Image
      src="https://i.ibb.co/K1cFJqJ/Urbanezii-logo.png"
      alt="Urbanezii Logo"
      width={150}
      height={40}
    />
  ),
  ambulance: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 10H6" />
      <path d="M8 8v4" />
      <path d="M12 18h-5" />
      <path d="M19 18h-2" />
      <path d="M19 15h.01" />
      <path d="m21 15-3.4-4" />
      <path d="M15 11h-3" />
      <path d="M3 11h7" />
      <path d="M18 11h-2.8" />
      <path d="M12.5 1.7 10 5H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  truck: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H15" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
  plumberVan: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H15" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M4.5 11h5" />
      <path d="M9 8v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8" />
      <path d="M7 11v2" />
    </svg>
  ),
  cleaningVan: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H15" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="m5 11 3 3" />
      <path d="m6 10 4 4" />
      <path d="M9 11h.01" />
      <path d="m10 12 3-3" />
    </svg>
  ),
};
