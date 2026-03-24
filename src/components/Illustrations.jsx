import { useId } from 'react';

const paletteMap = {
  rose: {
    skyOne: '#FFF1F6',
    skyTwo: '#F4DBFF',
    glow: '#FFD6E6',
    water: '#F6D1E5',
    accent: '#D979A7',
    mat: '#F0BCD6',
  },
  violet: {
    skyOne: '#F7EFFF',
    skyTwo: '#FBD7EC',
    glow: '#E9D3FF',
    water: '#EFD3F7',
    accent: '#A573D6',
    mat: '#D7B9F1',
  },
  peach: {
    skyOne: '#FFF2EA',
    skyTwo: '#FFDDE3',
    glow: '#FFE1C7',
    water: '#F8D6D0',
    accent: '#E49A84',
    mat: '#F2C3B1',
  },
  blush: {
    skyOne: '#FFF0F4',
    skyTwo: '#F8E4FF',
    glow: '#FFD8E5',
    water: '#F4D7E7',
    accent: '#D98AAA',
    mat: '#EABBD0',
  },
  mauve: {
    skyOne: '#F8F1FB',
    skyTwo: '#FBDDEB',
    glow: '#E5D8FF',
    water: '#EEDAF3',
    accent: '#A36AAC',
    mat: '#D6B6E0',
  },
  sunrise: {
    skyOne: '#FFF6EA',
    skyTwo: '#FFE2D4',
    glow: '#FFE9B9',
    water: '#F7DFC4',
    accent: '#E89A6A',
    mat: '#F0C19E',
  },
  lavender: {
    skyOne: '#F5F0FF',
    skyTwo: '#F7DFF7',
    glow: '#DCD6FF',
    water: '#E5D9F6',
    accent: '#8D73CF',
    mat: '#C8B5EE',
  },
  lotus: {
    skyOne: '#FFF0F8',
    skyTwo: '#FDE2EF',
    glow: '#FFD5F4',
    water: '#F4D4E7',
    accent: '#C76AA3',
    mat: '#E4B4D3',
  },
  dusk: {
    skyOne: '#F3ECFB',
    skyTwo: '#F9DFEB',
    glow: '#D9D2FF',
    water: '#E2D8F4',
    accent: '#7E6DBA',
    mat: '#C2B2E6',
  },
};

export function BrandMark({ className = 'h-10 w-10' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 84 84" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`brandWash-${uid}`} x1="12" y1="10" x2="72" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8BDD7" />
          <stop offset="0.55" stopColor="#E6B8FB" />
          <stop offset="1" stopColor="#F7C5A7" />
        </linearGradient>
        <radialGradient id={`brandGlow-${uid}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 24) rotate(48) scale(40 34)">
          <stop stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="42" cy="42" r="36" fill={`url(#brandWash-${uid})`} />
      <circle cx="42" cy="42" r="35" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2" />
      <circle cx="29" cy="24" r="26" fill={`url(#brandGlow-${uid})`} />
      <path d="M42 18C46 25 50 29 56 32C51 34 46 38 42 44C38 38 33 34 28 32C34 29 38 25 42 18Z" fill="#FFF9FC" />
      <path d="M32 31C34 37 38 42 42 46C46 42 50 37 52 31" stroke="#FFF9FC" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 44C34 47 39 51 42 55C45 51 50 47 55 44" stroke="#FFF9FC" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M48 24C47 26 46 27 44 29" stroke="#FFF9FC" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="58" cy="25" r="3.2" fill="#FFF9FC" fillOpacity="0.9" />
      <circle cx="63" cy="34" r="1.8" fill="#FFF9FC" fillOpacity="0.9" />
      <circle cx="24" cy="57" r="2.4" fill="#FFF9FC" fillOpacity="0.72" />
    </svg>
  );
}
export function LotusIcon({ className = 'h-6 w-6', stroke = 'currentColor' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 14C36 22 41 27 48 31C42 32 37 35 32 41C27 35 22 32 16 31C23 27 28 22 32 14Z"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 29C23 35 27 40 32 45C37 40 41 35 43 29"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 39C23 43 28 46 32 50C36 46 41 43 47 39"
        stroke={stroke}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroIllustration({ className = '' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 620 500" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`heroSky-${uid}`} x1="92" y1="44" x2="518" y2="428" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7FB" />
          <stop offset="0.55" stopColor="#FFDDEB" />
          <stop offset="1" stopColor="#E6D8FF" />
        </linearGradient>
        <radialGradient id={`heroSun-${uid}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(324 142) rotate(90) scale(146)">
          <stop stopColor="#FFF7D8" stopOpacity="0.95" />
          <stop offset="0.62" stopColor="#FFDCD6" stopOpacity="0.58" />
          <stop offset="1" stopColor="#FFDCD6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`heroWater-${uid}`} x1="306" y1="244" x2="310" y2="392" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE5EE" stopOpacity="0.96" />
          <stop offset="1" stopColor="#F6C5D9" />
        </linearGradient>
        <linearGradient id={`heroMat-${uid}`} x1="300" y1="340" x2="481" y2="383" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE0EE" />
          <stop offset="1" stopColor="#F5BACF" />
        </linearGradient>
        <linearGradient id={`heroWing-${uid}`} x1="458" y1="204" x2="580" y2="338" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F0CAFF" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`heroSkin-${uid}`} x1="403" y1="176" x2="434" y2="248" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8D2C1" />
          <stop offset="1" stopColor="#E7B09D" />
        </linearGradient>
      </defs>

      <rect x="18" y="18" width="584" height="464" rx="94" fill="url(#heroSky-${uid})" fillOpacity="0.72" stroke="#FFFFFF" strokeOpacity="0.48" strokeWidth="2" />
      <circle cx="324" cy="142" r="146" fill={`url(#heroSun-${uid})`} />

      <path d="M46 214C104 180 165 175 228 192C274 204 335 211 404 194C454 181 509 180 568 208L568 298L46 298V214Z" fill="#C7B5A7" fillOpacity="0.22" />
      <path d="M44 250C119 219 209 213 290 233C377 254 457 252 574 220V390H44V250Z" fill="url(#heroWater-${uid})" />
      <path d="M74 266C176 246 252 246 336 262C408 275 470 274 540 257" stroke="#FFFFFF" strokeOpacity="0.58" strokeWidth="4" strokeLinecap="round" />
      <path d="M90 290C188 278 259 280 336 293C413 307 468 307 532 292" stroke="#FFFFFF" strokeOpacity="0.42" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 298C111 332 186 351 295 349C404 347 507 325 572 286V392H48V298Z" fill="#FDE7F2" fillOpacity="0.55" />
      <path d="M96 198C128 166 161 160 195 178C169 182 145 191 118 212" fill="#9C8A6A" fillOpacity="0.16" />
      <path d="M172 188C213 150 254 149 303 174C266 181 231 192 190 221" fill="#A38E70" fillOpacity="0.14" />
      <path d="M236 176C278 141 332 142 390 177C347 186 305 197 253 226" fill="#A1886A" fillOpacity="0.15" />

      <path d="M480 202C515 206 544 228 554 264C527 255 498 257 468 278C462 247 467 224 480 202Z" fill="url(#heroWing-${uid})" stroke="#FFFFFF" strokeOpacity="0.42" />
      <path d="M496 180C531 184 565 214 582 250C548 241 517 245 484 269C478 234 481 203 496 180Z" fill="url(#heroWing-${uid})" stroke="#FFFFFF" strokeOpacity="0.34" />

      <path d="M328 352C373 335 422 335 486 353C468 360 430 369 402 371C372 373 345 368 328 352Z" fill="url(#heroMat-${uid})" />

      <circle cx="418" cy="172" r="18" fill="url(#heroSkin-${uid})" />
      <path d="M405 152C415 138 433 137 446 152C443 158 438 165 433 173C422 170 413 165 405 152Z" fill="#55344A" />
      <path d="M392 196C398 178 410 170 426 170C443 170 455 178 461 198L470 246C462 250 452 251 440 248L431 210H421L412 248C398 250 388 248 379 244L392 196Z" fill="#FFF7FB" />
      <path d="M392 246C410 241 425 240 440 244C452 247 465 252 474 259L450 282C441 275 430 271 418 271C404 271 392 275 379 284L362 259C371 253 381 249 392 246Z" fill="#FFF7FB" />
      <path d="M381 284C401 297 410 306 418 330C392 327 373 319 356 305C361 295 369 289 381 284Z" fill="url(#heroSkin-${uid})" />
      <path d="M455 282C436 297 426 306 418 330C446 328 466 320 482 305C476 295 467 288 455 282Z" fill="url(#heroSkin-${uid})" />
      <path d="M379 246C369 258 363 270 360 284" stroke="#E2A997" strokeWidth="6" strokeLinecap="round" />
      <path d="M470 246C479 258 486 270 490 282" stroke="#E2A997" strokeWidth="6" strokeLinecap="round" />

      <path d="M478 332C500 315 523 312 552 324C532 337 515 351 500 370C493 353 486 342 478 332Z" fill="#FDD7E7" fillOpacity="0.8" />
      <path d="M70 335C102 316 131 316 162 332C139 344 119 360 103 380C95 360 85 347 70 335Z" fill="#FEE4EF" fillOpacity="0.8" />
      <path d="M516 334C531 320 545 318 560 324C548 333 539 345 531 358C526 348 521 340 516 334Z" fill="#FFD2E6" />
      <path d="M91 341C104 327 116 324 130 330C118 338 108 349 100 362C96 354 93 348 91 341Z" fill="#FFD2E6" />
      <circle cx="532" cy="332" r="7" fill="#FFF7FB" />
      <circle cx="111" cy="340" r="6" fill="#FFF7FB" />
    </svg>
  );
}

export function YogaCardArt({ palette = 'rose', className = '' }) {
  const uid = useId().replace(/:/g, '');
  const tone = paletteMap[palette] || paletteMap.rose;

  return (
    <svg viewBox="0 0 260 172" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`cardSky-${uid}`} x1="48" y1="18" x2="214" y2="162" gradientUnits="userSpaceOnUse">
          <stop stopColor={tone.skyOne} />
          <stop offset="1" stopColor={tone.skyTwo} />
        </linearGradient>
        <radialGradient id={`cardGlow-${uid}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(128 58) rotate(90) scale(74)">
          <stop stopColor={tone.glow} stopOpacity="0.95" />
          <stop offset="1" stopColor={tone.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="8" y="8" width="244" height="156" rx="26" fill="url(#cardSky-${uid})" />
      <circle cx="128" cy="62" r="74" fill={`url(#cardGlow-${uid})`} />
      <path d="M18 92C52 78 83 75 110 81C139 88 164 88 188 82C210 77 229 78 242 84V152H18V92Z" fill={tone.water} fillOpacity="0.95" />
      <path d="M32 124C66 116 97 117 124 123C150 129 181 130 222 120" stroke="#FFFFFF" strokeOpacity="0.62" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 118C130 112 146 112 168 120C158 126 146 130 136 130C129 130 122 126 118 118Z" fill={tone.mat} />
      <circle cx="138" cy="70" r="8" fill="#F4C8B4" />
      <path d="M132 60C137 53 145 53 150 60C148 63 146 66 144 69C139 68 135 65 132 60Z" fill="#5F4A58" />
      <path d="M124 82C128 74 133 70 140 70C148 70 153 74 156 82L161 102C157 104 151 104 147 103L143 88H139L135 103C130 104 126 104 121 102L124 82Z" fill="#FFF7FB" />
      <path d="M120 103C128 101 136 100 145 101C152 102 160 105 165 109L154 120C149 116 144 114 138 114C131 114 126 116 120 121L111 109C114 106 117 104 120 103Z" fill="#FFF7FB" />
      <path d="M122 120C130 125 135 131 139 142C128 141 119 137 111 130C113 125 117 122 122 120Z" fill="#F4C8B4" />
      <path d="M156 120C149 125 144 131 140 142C151 141 160 137 168 130C165 125 162 122 156 120Z" fill="#F4C8B4" />
      <path d="M190 98C201 98 211 107 214 118C205 115 196 116 186 124C185 112 186 104 190 98Z" fill="#FFFFFF" fillOpacity="0.55" stroke="#FFFFFF" strokeOpacity="0.38" />
      <path d="M48 126C57 118 65 117 75 121C67 126 60 134 55 143C52 137 50 132 48 126Z" fill="#FFE6F0" fillOpacity="0.92" />
      <circle cx="63" cy="123" r="4" fill="#FFFFFF" fillOpacity="0.88" />
    </svg>
  );
}

export function ContactIllustration({ className = '' }) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg viewBox="0 0 420 360" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`contactBg-${uid}`} x1="58" y1="30" x2="336" y2="330" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF6FB" />
          <stop offset="1" stopColor="#F3DCFF" />
        </linearGradient>
        <radialGradient id={`contactGlow-${uid}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(202 140) rotate(90) scale(120)">
          <stop stopColor="#FFE8C9" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE8C9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="18" y="18" width="384" height="324" rx="52" fill="url(#contactBg-${uid})" fillOpacity="0.75" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="2" />
      <circle cx="202" cy="144" r="120" fill={`url(#contactGlow-${uid})`} />
      <rect x="140" y="80" width="138" height="206" rx="28" fill="#FFFFFF" fillOpacity="0.7" stroke="#F1C9DD" strokeWidth="3" />
      <rect x="162" y="104" width="94" height="134" rx="18" fill="#FFEAF4" />
      <path d="M164 260C187 241 231 241 254 260" stroke="#E997B7" strokeWidth="4" strokeLinecap="round" />
      <circle cx="209" cy="91" r="5" fill="#F0B3D2" />
      <path d="M181 132C193 144 199 156 204 178C183 176 168 168 156 155C161 145 169 138 181 132Z" fill="#FFD9E7" />
      <path d="M236 132C224 144 218 156 213 178C234 176 249 168 261 155C256 145 248 138 236 132Z" fill="#FFD9E7" />
      <path d="M209 115C217 128 228 137 242 142C230 145 219 151 209 162C199 151 188 145 176 142C190 137 201 128 209 115Z" stroke="#C46C97" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M187 172H231" stroke="#E6A4C3" strokeWidth="3" strokeLinecap="round" />
      <path d="M187 191H231" stroke="#E6A4C3" strokeWidth="3" strokeLinecap="round" />
      <path d="M187 210H222" stroke="#E6A4C3" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 260C114 216 152 204 194 202" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      <path d="M339 258C307 221 279 207 242 202" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="86" cy="268" r="8" fill="#FFF6FB" fillOpacity="0.8" />
      <circle cx="333" cy="262" r="7" fill="#FFF6FB" fillOpacity="0.8" />
    </svg>
  );
}
