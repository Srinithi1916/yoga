export default function ReviewStars({ rating = 0, size = 'text-base', className = '' }) {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <span className={`inline-flex items-center gap-1 ${size} ${className}`} aria-label={`${roundedRating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-[1em] w-[1em] ${star <= roundedRating ? 'text-amber-400' : 'text-rose-200'}`}
          fill="currentColor"
        >
          <path d="M10 1.75l2.55 5.17 5.7.83-4.12 4.01.97 5.68L10 14.76 4.9 17.44l.97-5.68L1.75 7.75l5.7-.83L10 1.75z" />
        </svg>
      ))}
    </span>
  );
}
