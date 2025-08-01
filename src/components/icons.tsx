import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="40"
      viewBox="0 0 150 40"
      {...props}
    ></svg>
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
      <path d="M9 18h6" />
      <path d="M18 18h-2" />
      <path d="M18 15h.01" />
      <path d="M12 15h.01" />
      <path d="M15 15h.01" />
      <path d="M7 15h.01" />
      <path d="M4 15h.01" />
      <path d="M10.29 1.71 3.71 8.29a1 1 0 0 0-.3.71V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-3.34a1 1 0 0 1-1-1l-2.66-4a1 1 0 0 0-.71-.29z" />
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
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v4h-8v-4c0-1.1.9-2 2-2z" />
      <circle cx="7.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </svg>
  ),
};
