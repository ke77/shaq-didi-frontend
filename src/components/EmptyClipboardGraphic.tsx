import React from 'react';

interface EmptyClipboardGraphicProps {
  className?: string;
}

export const EmptyClipboardGraphic: React.FC<EmptyClipboardGraphicProps> = ({
  className = 'w-44 h-44',
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Empty orders illustration"
    >
      {/* Background/Shadow glow */}
      <ellipse cx="100" cy="180" rx="55" ry="8" fill="#F4F7FA" />

      {/* Back tilted clipboard */}
      <g transform="rotate(-10 65 105)">
        <rect x="36" y="38" width="80" height="114" rx="8" fill="#DEE6EE" />
        <rect
          x="35"
          y="36"
          width="80"
          height="114"
          rx="7"
          fill="#FFFFFF"
          stroke="#DEE6EE"
          strokeWidth="2.5"
        />
        <rect x="42" y="52" width="66" height="90" rx="4" fill="#F4F7FA" />

        <path
          d="M68 28 C68 24 82 24 82 28"
          stroke="#FF6347"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="62" y="32" width="26" height="14" rx="3" fill="#FF6347" />
      </g>

      {/* Front upright clipboard */}
      <g>
        <rect x="74" y="44" width="84" height="118" rx="8" fill="#CDD5E1" opacity="0.45" />
        <rect
          x="72"
          y="42"
          width="84"
          height="118"
          rx="8"
          fill="#FFFFFF"
          stroke="#DEE6EE"
          strokeWidth="2.5"
        />
        <rect x="80" y="58" width="68" height="94" rx="4" fill="#F4F7FA" />

        <path
          d="M107 34 C107 29 121 29 121 34"
          stroke="#FF6347"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="101" y="38" width="26" height="14" rx="3" fill="#FF6347" />
      </g>
    </svg>
  );
};
