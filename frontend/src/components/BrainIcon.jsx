export function BrainIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 6.5 6 6.5 6 8.5C6 10.5 7.5 11 7.5 11C7.5 13 9 14.5 11 14.5V22H13V14.5C15 14.5 16.5 13 16.5 11C16.5 11 18 10.5 18 8.5C18 6.5 16.5 6.5 16.5 6.5C16.5 4 14.5 2 12 2Z"
        fill={color}
        opacity="0.2"
      />
      <path
        d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 6.5 6 6.5 6 8.5C6 10.5 7.5 11 7.5 11C7.5 13 9 14.5 11 14.5V22H13V14.5C15 14.5 16.5 13 16.5 11C16.5 11 18 10.5 18 8.5C18 6.5 16.5 6.5 16.5 6.5C16.5 4 14.5 2 12 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5H15M9 11H15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
