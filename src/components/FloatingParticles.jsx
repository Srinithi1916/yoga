import { motion } from 'framer-motion';

const particles = [
  { top: '6%', left: '9%', size: 8, color: 'bg-white/70', delay: 0.1, duration: 8 },
  { top: '11%', left: '74%', size: 10, color: 'bg-rose-100/80', delay: 1.2, duration: 10 },
  { top: '20%', left: '18%', size: 6, color: 'bg-pink-100/80', delay: 0.6, duration: 9 },
  { top: '26%', left: '82%', size: 12, color: 'bg-white/60', delay: 1.8, duration: 12 },
  { top: '33%', left: '65%', size: 5, color: 'bg-pink-50/90', delay: 0.3, duration: 7 },
  { top: '39%', left: '28%', size: 11, color: 'bg-rose-50/70', delay: 1.6, duration: 11 },
  { top: '47%', left: '90%', size: 7, color: 'bg-white/60', delay: 0.9, duration: 8 },
  { top: '55%', left: '8%', size: 12, color: 'bg-pink-100/70', delay: 1.4, duration: 13 },
  { top: '63%', left: '75%', size: 8, color: 'bg-white/70', delay: 2.1, duration: 9 },
  { top: '68%', left: '43%', size: 6, color: 'bg-rose-50/80', delay: 0.8, duration: 10 },
  { top: '75%', left: '15%', size: 10, color: 'bg-white/60', delay: 1.1, duration: 12 },
  { top: '83%', left: '58%', size: 7, color: 'bg-pink-50/80', delay: 0.4, duration: 8 },
  { top: '88%', left: '88%', size: 14, color: 'bg-white/55', delay: 1.7, duration: 13 },
];

export default function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.top}-${particle.left}-${index}`}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            boxShadow: '0 0 22px rgba(255,255,255,0.6)',
          }}
          animate={{
            y: [0, -24, 0],
            x: [0, 12, 0],
            opacity: [0.35, 0.85, 0.35],
            scale: [1, 1.35, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
