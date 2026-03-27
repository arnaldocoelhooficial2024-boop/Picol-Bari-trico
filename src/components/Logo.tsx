export function Logo({ className = "w-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 320" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradients */}
        <linearGradient id="popsicleTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="50%" stopColor="#FF7FA0" />
          <stop offset="100%" stopColor="#FF4F7A" />
        </linearGradient>
        <linearGradient id="popsicleLeft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF4F7A" />
          <stop offset="100%" stopColor="#C2224A" />
        </linearGradient>
        <linearGradient id="popsicleRight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E63963" />
          <stop offset="100%" stopColor="#9E1636" />
        </linearGradient>

        <linearGradient id="stickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E6C280" />
          <stop offset="50%" stopColor="#D4A373" />
          <stop offset="100%" stopColor="#C49A45" />
        </linearGradient>

        <linearGradient id="bariatricoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="20%" stopColor="#FF7FA0" />
          <stop offset="60%" stopColor="#FF4F7A" />
          <stop offset="100%" stopColor="#C2224A" />
        </linearGradient>

        <linearGradient id="swooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4F7A" />
          <stop offset="50%" stopColor="#FF7FA0" />
          <stop offset="100%" stopColor="#6A0DAD" />
        </linearGradient>

        <linearGradient id="picoleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6A0DAD" />
          <stop offset="50%" stopColor="#FF4F7A" />
          <stop offset="100%" stopColor="#6A0DAD" />
        </linearGradient>

        {/* Glow and Shadows */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#9E1636" floodOpacity="0.4" />
        </filter>
        
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* --- Glowing Popsicle --- */}
      <g transform="translate(0, -20)">
        {/* Popsicle Base Glow */}
        <path d="M 280 10 C 280 -10 320 -10 320 10 L 320 70 C 320 80 280 80 280 70 Z" fill="#FF4F7A" filter="url(#strongGlow)" opacity="0.5" />
        
        {/* Stick */}
        <path d="M 295 70 L 305 70 L 305 100 C 305 105 295 105 295 100 Z" fill="url(#stickGrad)" />
        <path d="M 295 70 L 305 70 L 305 75 C 305 75 300 78 295 75 Z" fill="#000000" fillOpacity="0.15" />

        {/* Popsicle Body */}
        <path d="M 280 20 C 280 0 320 0 320 20 L 320 70 C 320 75 315 80 300 80 C 285 80 280 75 280 70 Z" fill="url(#popsicleTop)" stroke="#ffffff" strokeWidth="2" />
        
        {/* Bite Mark */}
        <path d="M 315 10 C 310 12 310 18 315 20 C 318 22 322 20 325 18 L 325 10 Z" fill="#ffffff" />

        {/* Inner Highlights & Reflections */}
        <path d="M 285 25 C 285 15 295 10 300 10 L 300 65 C 295 65 285 60 285 25 Z" fill="#ffffff" opacity="0.4" filter="url(#glow)" />
        
        {/* Sparkles */}
        <g fill="#ffffff" filter="url(#glow)">
          <path d="M 260 30 Q 265 30 265 25 Q 265 30 270 30 Q 265 30 265 35 Q 265 30 260 30 Z" />
          <path d="M 340 40 Q 348 40 348 32 Q 348 40 356 40 Q 348 40 348 48 Q 348 40 340 40 Z" />
          <path d="M 270 15 Q 273 15 273 12 Q 273 15 276 15 Q 273 15 273 18 Q 273 15 270 15 Z" />
        </g>
      </g>

      {/* --- BARIÁTRICO Text --- */}
      <g transform="translate(300, 180)">
        {/* 3D Extrusion Layers */}
        <text x="0" y="15" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="#9E1636">BARIÁTRICO</text>
        <text x="0" y="12" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="#C2224A">BARIÁTRICO</text>
        <text x="0" y="9" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="#E63963">BARIÁTRICO</text>
        <text x="0" y="6" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="#FF4F7A">BARIÁTRICO</text>
        <text x="0" y="3" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="#FF7FA0">BARIÁTRICO</text>
        
        {/* Main Text Border */}
        <text x="0" y="0" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="none" stroke="#ffffff" strokeWidth="14" strokeLinejoin="round" filter="url(#dropShadow)">BARIÁTRICO</text>
        
        {/* Main Text Fill */}
        <text x="0" y="0" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="url(#bariatricoGrad)">BARIÁTRICO</text>
        
        {/* Inner Highlight for Glossy Effect */}
        <text x="0" y="-2" fontFamily="'Outfit', 'Arial Black', Impact, system-ui, sans-serif" fontSize="80" fontWeight="900" textAnchor="middle" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6">BARIÁTRICO</text>
      </g>

      {/* --- Swoosh --- */}
      <g transform="translate(0, 15)">
        {/* Swoosh Shadow */}
        <path d="M 80 210 Q 300 180 520 200 Q 300 195 80 210 Z" fill="#9E1636" transform="translate(0, 4)" />
        {/* Swoosh Border */}
        <path d="M 80 210 Q 300 180 520 200 Q 300 195 80 210 Z" fill="none" stroke="#ffffff" strokeWidth="4" />
        {/* Swoosh Fill */}
        <path d="M 80 210 Q 300 180 520 200 Q 300 195 80 210 Z" fill="url(#swooshGrad)" />
        {/* Swoosh Highlight */}
        <path d="M 85 208 Q 300 182 510 198 Q 300 190 85 208 Z" fill="#ffffff" opacity="0.4" />
      </g>

      {/* --- Picolé Text --- */}
      <g transform="translate(300, 275)">
        {/* Shadow/Border */}
        <text x="0" y="0" fontFamily="'Dancing Script', 'Great Vibes', cursive" fontSize="76" fontWeight="700" textAnchor="middle" fill="none" stroke="#ffffff" strokeWidth="14" strokeLinejoin="round" filter="url(#dropShadow)">Picolé</text>
        <text x="0" y="4" fontFamily="'Dancing Script', 'Great Vibes', cursive" fontSize="76" fontWeight="700" textAnchor="middle" fill="#9E1636">Picolé</text>
        
        {/* Fill */}
        <text x="0" y="0" fontFamily="'Dancing Script', 'Great Vibes', cursive" fontSize="76" fontWeight="700" textAnchor="middle" fill="url(#picoleGrad)">Picolé</text>
        
        {/* Inner Highlight */}
        <text x="-1" y="-1" fontFamily="'Dancing Script', 'Great Vibes', cursive" fontSize="76" fontWeight="700" textAnchor="middle" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5">Picolé</text>
      </g>
    </svg>
  );
}
