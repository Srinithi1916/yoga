import { useId } from 'react';
import { motion } from 'framer-motion';

export function FloralCorner({ className = '' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
    >
      <svg viewBox="0 0 260 220" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id={`leafWash-${uid}`}
            x1="18"
            y1="42"
            x2="214"
            y2="210"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="1" stopColor="#EAB6D4" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient
            id={`petalWash-${uid}`}
            x1="92"
            y1="60"
            x2="168"
            y2="176"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFEFF7" />
            <stop offset="1" stopColor="#F4B0D0" />
          </linearGradient>
        </defs>
        <path
          d="M25 185C67 116 108 97 178 69C166 119 138 166 88 206"
          fill={`url(#leafWash-${uid})`}
          opacity="0.8"
        />
        <path
          d="M63 208C136 170 183 132 232 73C225 131 190 186 125 216"
          fill={`url(#leafWash-${uid})`}
          opacity="0.55"
        />
        <path
          d="M116 96C124 66 141 52 150 34C160 53 177 68 183 97C169 92 160 92 150 92C140 92 132 92 116 96Z"
          fill={`url(#petalWash-${uid})`}
        />
        <path d="M80 128C96 101 120 95 141 89C130 112 131 136 134 157C112 151 92 148 80 128Z" fill="#FFD6E7" />
        <path d="M164 88C186 95 208 104 222 132C205 150 186 153 165 157C169 136 170 111 164 88Z" fill="#FBC6DD" />
        <path d="M103 111C110 83 128 72 150 58C170 71 188 84 197 111C181 106 167 104 150 104C133 104 121 106 103 111Z" fill="#FFF6FB" opacity="0.88" />
        <circle cx="150" cy="116" r="14" fill="#F7A6C8" />
        <circle cx="150" cy="116" r="6" fill="#FFF5FA" />
        <circle cx="45" cy="72" r="5" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="214" cy="32" r="4" fill="#FFFFFF" fillOpacity="0.8" />
        <circle cx="228" cy="146" r="5" fill="#FFD6E7" fillOpacity="0.8" />
      </svg>
    </motion.div>
  );
}

export function LeafWisp({ className = '' }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 180 200" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M92 12C105 64 103 102 94 188"
          stroke="#FFFFFF"
          strokeOpacity="0.6"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M95 80C63 56 36 54 18 62C40 73 60 92 82 122"
          stroke="#FFF7FB"
          strokeOpacity="0.7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M98 96C128 67 151 63 166 70C147 79 128 95 110 124"
          stroke="#FFF7FB"
          strokeOpacity="0.7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M90 126C58 107 29 111 12 121C34 131 57 148 80 176"
          stroke="#FFDDEC"
          strokeOpacity="0.72"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M102 138C132 118 158 121 170 129C148 138 126 152 110 176"
          stroke="#FFDDEC"
          strokeOpacity="0.72"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

const blossomPalettes = {
  rose: {
    center: '#F69AC2',
    petalOne: '#FFF6FB',
    petalTwo: '#FFD6E7',
    petalThree: '#F4B9D3',
    leaf: '#FFFFFF',
  },
  peach: {
    center: '#F5B18C',
    petalOne: '#FFF9F3',
    petalTwo: '#FFE2D1',
    petalThree: '#F7C4B4',
    leaf: '#FFF5EF',
  },
  lavender: {
    center: '#B48EE8',
    petalOne: '#FBF7FF',
    petalTwo: '#E8DBFF',
    petalThree: '#D1B6F9',
    leaf: '#F8F4FF',
  },
};

export function BlossomSpray({ className = '', tone = 'rose' }) {
  const uid = useId().replace(/:/g, '');
  const palette = blossomPalettes[tone] ?? blossomPalettes.rose;

  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 220 180" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient
            id={`glow-${uid}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(114 88) rotate(90) scale(96 112)"
          >
            <stop stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="92" rx="92" ry="68" fill={`url(#glow-${uid})`} />
        <path d="M45 146C62 118 80 101 102 92C92 117 92 136 96 159C75 156 58 155 45 146Z" fill={palette.leaf} fillOpacity="0.5" />
        <path d="M125 92C145 102 162 117 176 142C163 152 147 155 126 158C130 134 130 117 125 92Z" fill={palette.leaf} fillOpacity="0.5" />
        <g transform="translate(28 82)">
          <ellipse cx="20" cy="22" rx="12" ry="24" fill={palette.petalTwo} transform="rotate(-40 20 22)" />
          <ellipse cx="40" cy="22" rx="12" ry="24" fill={palette.petalThree} transform="rotate(40 40 22)" />
          <ellipse cx="30" cy="12" rx="11" ry="23" fill={palette.petalOne} />
          <ellipse cx="30" cy="34" rx="11" ry="21" fill={palette.petalTwo} />
          <circle cx="30" cy="22" r="8" fill={palette.center} />
        </g>
        <g transform="translate(82 30)">
          <ellipse cx="24" cy="28" rx="15" ry="31" fill={palette.petalOne} transform="rotate(-42 24 28)" />
          <ellipse cx="52" cy="28" rx="15" ry="31" fill={palette.petalTwo} transform="rotate(42 52 28)" />
          <ellipse cx="38" cy="14" rx="13" ry="27" fill={palette.petalThree} />
          <ellipse cx="38" cy="42" rx="13" ry="25" fill={palette.petalOne} />
          <circle cx="38" cy="28" r="10" fill={palette.center} />
        </g>
        <g transform="translate(144 92)">
          <ellipse cx="12" cy="16" rx="8" ry="17" fill={palette.petalOne} transform="rotate(-38 12 16)" />
          <ellipse cx="28" cy="16" rx="8" ry="17" fill={palette.petalTwo} transform="rotate(38 28 16)" />
          <ellipse cx="20" cy="8" rx="7" ry="15" fill={palette.petalThree} />
          <ellipse cx="20" cy="24" rx="7" ry="15" fill={palette.petalOne} />
          <circle cx="20" cy="16" r="5" fill={palette.center} />
        </g>
        <circle cx="182" cy="44" r="4" fill="#FFFFFF" fillOpacity="0.75" />
        <circle cx="164" cy="24" r="3" fill="#FFD6E7" fillOpacity="0.75" />
        <circle cx="42" cy="34" r="4" fill="#FFFFFF" fillOpacity="0.75" />
      </svg>
    </motion.div>
  );
}

export function LotusBloom({ className = '' }) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
      transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 260 120" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="130" cy="98" rx="86" ry="14" fill="#FFF6FB" fillOpacity="0.45" />
        <path d="M64 82C82 58 101 48 124 44C111 63 108 79 110 98C90 95 75 92 64 82Z" fill="#FFDCEB" />
        <path d="M196 82C178 58 159 48 136 44C149 63 152 79 150 98C170 95 185 92 196 82Z" fill="#FFDCEB" />
        <path d="M96 78C108 49 121 35 130 20C141 35 153 49 166 78C154 72 143 70 130 70C117 70 106 72 96 78Z" fill="#FFF6FB" />
        <path d="M74 76C86 60 100 54 118 50C107 67 106 83 109 96C94 93 82 88 74 76Z" fill="#F6BED7" />
        <path d="M186 76C174 60 160 54 142 50C153 67 154 83 151 96C166 93 178 88 186 76Z" fill="#F6BED7" />
        <circle cx="130" cy="80" r="10" fill="#F69AC2" />
      </svg>
    </motion.div>
  );
}
