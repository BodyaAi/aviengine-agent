interface BrainIconProps {
  size?: number;
  color?: string;
}

export function BrainIcon({ size = 26, color = "white" }: BrainIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left hemisphere */}
      <path
        d="M24 8C24 8 20 8 17 10C13 12 10 16 10 21C10 24 11 26.5 13 28.5C11.5 29.5 10.5 31.5 10.5 33.5C10.5 37 13.5 40 17 40C19 40 20.5 39.2 22 38V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Right hemisphere */}
      <path
        d="M24 8C24 8 28 8 31 10C35 12 38 16 38 21C38 24 37 26.5 35 28.5C36.5 29.5 37.5 31.5 37.5 33.5C37.5 37 34.5 40 31 40C29 40 27.5 39.2 26 38V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center divider */}
      <line x1="24" y1="8" x2="24" y2="40" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      {/* Left circuit nodes */}
      <circle cx="14" cy="16" r="2" fill={color} />
      <circle cx="11" cy="25" r="2" fill={color} />
      <circle cx="15" cy="33" r="2" fill={color} />
      <circle cx="19" cy="22" r="1.5" fill={color} />
      {/* Left circuit lines */}
      <path d="M14 16L19 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 25L19 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 33L19 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 16L10 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 25L10 25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 33L13 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Right circuit nodes */}
      <circle cx="34" cy="16" r="2" fill={color} />
      <circle cx="37" cy="25" r="2" fill={color} />
      <circle cx="33" cy="33" r="2" fill={color} />
      <circle cx="29" cy="22" r="1.5" fill={color} />
      {/* Right circuit lines */}
      <path d="M34 16L29 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M37 25L29 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33 33L29 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 16L38 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M37 25L38 25" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33 33L35 36" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
