import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="150"
      height="40"
      viewBox="0 0 250 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="32" cy="32" r="30" fill="#2B3A85" stroke="white" strokeWidth="2" />
      <path
        d="M28.09 23.12L31.83 17.52L35.61 23.12H28.09Z"
        fill="#F37021"
      />
      <path
        d="M23.08 35.59L17.48 31.85L23.08 28.11V35.59Z"
        fill="#F37021"
      />
      <path
        d="M36.65 39.73L42.25 36L36.65 32.27V39.73Z"
        fill="#2B3A85"
        stroke="#2B3A85"
        strokeWidth="0.5"
      />
      <path
        d="M31.87 46.24L28.13 40.64H35.65L31.87 46.24Z"
        fill="#2B3A85"
        stroke="#2B3A85"
        strokeWidth="0.5"
      />
      <path
        d="M39.69 28.11V35.59L45.29 31.85L39.69 28.11Z"
        fill="#F37021"
      />
      <path
        d="M24.12 26.96L20.38 21.36H27.9L24.12 26.96Z"
        fill="#42B4E8"
      />
      <path d="M31.84 29.8L28.1 24.2H35.62L31.84 29.8Z" fill="#42B4E8" />
      <path
        d="M27.07 39.73L21.47 36L27.07 32.27V39.73Z"
        fill="#42B4E8"
      />
      <path
        d="M39.69 26.96L35.95 21.36H43.47L39.69 26.96Z"
        fill="#9370DB"
      />
      <path d="M31.88 39.52L28.14 33.92H35.66L31.88 39.52Z" fill="#9370DB" />
      <text
        fill="#2B3A85"
        xmlSpace="preserve"
        style={{ whiteSpace: 'pre' }}
        fontFamily="Poppins"
        fontSize="36"
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x="70" y="42.5">Urbanezii</tspan>
      </text>
    </svg>
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
