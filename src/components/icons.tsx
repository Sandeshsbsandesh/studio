import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="40"
      viewBox="0 0 150 40"
      {...props}
    >
      <defs>
        <linearGradient id="swoosh-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#8EAF5E' }} />
          <stop offset="100%" style={{ stopColor: '#288B9A' }} />
        </linearGradient>
      </defs>
      
      {/* Cityscape */}
      <g transform="translate(5, 5)" fill="#1E2A4A">
        <path d="M0 30 V 10 L 5 10 V 30z" />
        <path d="M6 30 V 5 L 11 5 V 30z" />
        <path d="M12 30 V 15 L 17 15 V 30z" />
        <path d="M2 10 L 3 8 L 3 6 L 2 6z" />
        <path d="M8 5 L 9 3 L 9 1 L 8 1z" />
        <path d="M14 15 L 15 13 L 15 11 L 14 11z" />
      </g>
      
      {/* U shape */}
      <path d="M25 5 V 22 C25 28, 35 28, 35 22 V 5 H 45 V 22 C45 34, 20 34, 20 22 V 5 z" fill="#1E2A4A" />
      
      {/* Swoosh */}
      <path 
        d="M 15,30 C 25,35 45,35 55,25 L 65,20" 
        stroke="url(#swoosh-gradient)" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round"
      />
      {/* Arrow head */}
      <g transform="translate(65, 20) rotate(330)">
        <path d="M 0,0 L -5,2 L -5,-2 z" fill="#D4A04B" />
      </g>
      
      {/* Text */}
      <text x="75" y="28" fontFamily="sans-serif" fontSize="16" fontWeight="bold">
        <tspan fill="#1E2A4A">Urban</tspan>
        <tspan fill="#D4A04B">ease</tspan>
      </text>
    </svg>
  ),
};
