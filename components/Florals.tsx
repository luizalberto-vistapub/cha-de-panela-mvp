type FloralProps = {
  className?: string;
  flip?: boolean;
  opacity?: number;
};

export function FloralCorner({ className, flip = false, opacity = 0.95 }: FloralProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined, opacity }}
      viewBox="0 0 240 320"
    >
      <defs>
        <radialGradient id="petal-blue" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#a8bccd" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#7892ab" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3f5872" />
        </radialGradient>
        <radialGradient id="petal-blue-2" cx="60%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#bccbd9" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#6f879e" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#324a63" />
        </radialGradient>
        <linearGradient id="leaf-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9bb1c4" />
          <stop offset="60%" stopColor="#5a7592" />
          <stop offset="100%" stopColor="#2f4761" />
        </linearGradient>
      </defs>
      <g>
        <path d="M60 300Q90 220 110 160Q125 110 150 60" stroke="url(#leaf-blue)" strokeWidth="2.2" fill="none" opacity="0.75" />
        <path d="M110 160Q80 130 50 110" stroke="url(#leaf-blue)" strokeWidth="1.8" fill="none" opacity="0.7" />
        <path d="M125 110Q165 95 195 70" stroke="url(#leaf-blue)" strokeWidth="1.8" fill="none" opacity="0.7" />
        <path d="M50 110Q25 100 10 80Q25 95 50 110Z" fill="#9bb1c4" opacity="0.9" />
        <path d="M50 110Q35 130 20 145Q38 128 50 110Z" fill="#5a7592" opacity="0.9" />
        <path d="M195 70Q225 55 235 30Q215 55 195 70Z" fill="#9bb1c4" opacity="0.9" />
        <path d="M80 200Q50 195 30 210Q60 205 80 200Z" fill="#5a7592" opacity="0.85" />
        <path d="M95 175Q120 165 140 145Q115 168 95 175Z" fill="#bccbd9" opacity="0.9" />
        <g transform="translate(140 90)">
          <path d="M0 30Q-22 10-18-18Q0-28 18-18Q22 10 0 30Z" fill="url(#petal-blue)" />
          <path d="M0 30Q-10 12-6-10Q0-16 6-10Q10 12 0 30Z" fill="url(#petal-blue-2)" opacity="0.85" />
        </g>
        <g transform="translate(75 175)">
          <path d="M0 18Q-14 6-10-10Q0-16 10-10Q14 6 0 18Z" fill="url(#petal-blue)" />
        </g>
        <g transform="translate(95 240)">
          <ellipse cx="-8" cy="-2" rx="9" ry="14" fill="url(#petal-blue)" transform="rotate(-25)" />
          <ellipse cx="8" cy="-2" rx="9" ry="14" fill="url(#petal-blue-2)" transform="rotate(25)" />
          <ellipse cx="0" cy="6" rx="7" ry="10" fill="url(#petal-blue)" />
        </g>
      </g>
    </svg>
  );
}

export function FloralSpray({ className, opacity = 0.9 }: FloralProps) {
  return (
    <svg aria-hidden="true" className={className} style={{ opacity }} viewBox="0 0 180 240">
      <defs>
        <radialGradient id="spray-petal" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#bccbd9" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#6f879e" />
          <stop offset="100%" stopColor="#324a63" />
        </radialGradient>
        <linearGradient id="spray-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9bb1c4" />
          <stop offset="100%" stopColor="#3f5872" />
        </linearGradient>
      </defs>
      <path d="M90 230Q90 150 90 70" stroke="url(#spray-leaf)" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M90 180Q60 160 35 165" stroke="url(#spray-leaf)" strokeWidth="1.6" fill="none" opacity="0.6" />
      <path d="M90 130Q130 115 150 90" stroke="url(#spray-leaf)" strokeWidth="1.6" fill="none" opacity="0.6" />
      <path d="M35 165Q12 158 0 140Q18 162 35 165Z" fill="url(#spray-leaf)" opacity="0.9" />
      <path d="M150 90Q170 75 178 55Q162 80 150 90Z" fill="url(#spray-leaf)" opacity="0.9" />
      <g transform="translate(90 70)">
        <path d="M0 25Q-18 8-14-14Q0-22 14-14Q18 8 0 25Z" fill="url(#spray-petal)" />
      </g>
      <g transform="translate(60 130)">
        <path d="M0 16Q-12 6-9-8Q0-13 9-8Q12 6 0 16Z" fill="url(#spray-petal)" />
      </g>
    </svg>
  );
}
