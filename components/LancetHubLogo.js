'use client';

export default function LancetHubLogo({ size = 200, showText = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Background circle */}
      <circle cx="100" cy="100" r="95" fill="#1e3a5f" />
      
      {/* Global grid lines - representing pandemic spread */}
      <g opacity="0.3">
        {/* Latitude lines */}
        <circle cx="100" cy="100" r="30" fill="none" stroke="#4a90e2" strokeWidth="1" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="#4a90e2" strokeWidth="1" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#4a90e2" strokeWidth="1" />
        
        {/* Longitude lines */}
        <line x1="100" y1="30" x2="100" y2="170" stroke="#4a90e2" strokeWidth="1" />
        <line x1="30" y1="100" x2="170" y2="100" stroke="#4a90e2" strokeWidth="1" />
        <line x1="50" y1="50" x2="150" y2="150" stroke="#4a90e2" strokeWidth="1" />
        <line x1="150" y1="50" x2="50" y2="150" stroke="#4a90e2" strokeWidth="1" />
      </g>
      
      {/* Central shield - representing resilience */}
      <g transform="translate(100, 100)">
        {/* Shield shape */}
        <path
          d="M 0,-40 C -25,-40 -35,-20 -35,0 C -35,25 -20,45 0,55 C 20,45 35,25 35,0 C 35,-20 25,-40 0,-40 Z"
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth="3"
        />
        
        {/* Medical cross */}
        <rect x="-4" y="-20" width="8" height="30" fill="#ffffff" />
        <rect x="-12" y="-8" width="24" height="8" fill="#ffffff" />
      </g>
      
      {/* Virus particles around the shield */}
      <g opacity="0.6">
        <circle cx="40" cy="40" r="8" fill="#ef4444">
          <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="45" r="6" fill="#f59e0b">
          <animate attributeName="r" values="6;8;6" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="150" r="7" fill="#ef4444">
          <animate attributeName="r" values="7;9;7" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="155" r="5" fill="#f59e0b">
          <animate attributeName="r" values="5;7;5" dur="4.5s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Connection lines - representing global collaboration */}
      <g opacity="0.4">
        <line x1="48" y1="40" x2="65" y2="65" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="152" y1="45" x2="135" y2="65" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="142" y1="150" x2="125" y2="125" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="58" y1="155" x2="75" y2="130" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
        </line>
      </g>
      
      {/* Text */}
      {showText && (
        <g>
          <text x="100" y="185" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold" fontFamily="Arial, sans-serif">
            LancetHub
          </text>
        </g>
      )}
    </svg>
  );
}

// SVG version for use in navigation
export function LancetHubLogoSmall({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48" fill="#1e3a5f" />
      
      {/* Simplified shield */}
      <path
        d="M 50,20 C 35,20 28,30 28,40 C 28,55 35,70 50,78 C 65,70 72,55 72,40 C 72,30 65,20 50,20 Z"
        fill="#2563eb"
        stroke="#ffffff"
        strokeWidth="2"
      />
      
      {/* Medical cross */}
      <rect x="47" y="35" width="6" height="25" fill="#ffffff" />
      <rect x="40" y="42" width="20" height="6" fill="#ffffff" />
    </svg>
  );
}