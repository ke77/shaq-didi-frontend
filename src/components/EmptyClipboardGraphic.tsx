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
      <ellipse cx="100" cy="180" rx="55" ry="8" fill="#F1F5F9" />

      {/* Back tilted clipboard */}
      <g transform="rotate(-10 65 105)">
        {/* Board Shadow */}
        <rect x="36" y="38" width="80" height="114" rx="8" fill="#E2E8F0" />
        {/* Board Outline */}
        <rect
          x="35"
          y="36"
          width="80"
          height="114"
          rx="7"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="2.5"
        />
        {/* Paper Sheet */}
        <rect x="42" y="52" width="66" height="90" rx="4" fill="#EAEFF5" />

        {/* Clip Wire Ring */}
        <path
          d="M68 28 C68 24 82 24 82 28"
          stroke="#FF7E67"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Clip Base */}
        <rect x="62" y="32" width="26" height="14" rx="3" fill="#FF7E67" />
      </g>

      {/* Front upright clipboard */}
      <g>
        {/* Board Shadow */}
        <rect x="74" y="44" width="84" height="118" rx="8" fill="#CBD5E1" opacity="0.4" />
        {/* Board Base */}
        <rect
          x="72"
          y="42"
          width="84"
          height="118"
          rx="8"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="2.5"
        />
        {/* Paper Sheet */}
        <rect x="80" y="58" width="68" height="94" rx="4" fill="#EAEFF5" />

        {/* Clip Wire Ring */}
        <path
          d="M107 34 C107 29 121 29 121 34"
          stroke="#FF7E67"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Clip Base */}
        <rect x="101" y="38" width="26" height="14" rx="3" fill="#FF7E67" />
      </g>
    </svg>
  );
};
