import { motion } from 'framer-motion';

export default function GlassPanel({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`section-shell ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay }}
    >
      {children}
    </motion.div>
  );
}
