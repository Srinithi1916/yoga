import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ImageSlideshow({ slides, className = '', imageClassName = 'h-[420px] sm:h-[480px]' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!slides?.length || slides.length === 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [slides]);

  if (!slides?.length) {
    return null;
  }

  const activeSlide = slides[activeIndex];

  return (
    <div className={`relative overflow-hidden rounded-[3rem] border border-white/60 bg-white/30 p-3 shadow-[0_30px_70px_-28px_rgba(157,90,127,0.45)] backdrop-blur-xl ${className}`}>
      <div className="relative overflow-hidden rounded-[2.5rem]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide.imageUrl}
            src={activeSlide.imageUrl}
            alt={activeSlide.imageAlt}
            className={`w-full rounded-[2.5rem] object-cover object-center ${imageClassName}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(50,23,38,0.05),rgba(50,23,38,0.34))]" />
      </div>

      <motion.div
        key={`${activeSlide.title}-content`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="absolute inset-x-6 bottom-6 rounded-[2rem] border border-white/45 bg-white/30 px-5 py-4 text-white backdrop-blur-md"
      >
        <h3 className="font-display text-3xl leading-tight text-white">{activeSlide.title}</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-white/90">{activeSlide.description}</p>
      </motion.div>

      {slides.length > 1 ? (
        <div className="absolute bottom-4 right-6 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/75'
              }`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
