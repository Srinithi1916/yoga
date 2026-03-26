export function BrandLogo({
  className = '',
  showWordmark = true,
  markClassName = 'h-14 w-14',
  markWrapClassName = '',
  imageClassName = '',
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`${markClassName} flex shrink-0 items-center justify-center ${markWrapClassName}`.trim()}>
        <img
          src="/jeevanam-360-logo.png"
          alt="Jeevanam 360 logo"
          width="531"
          height="491"
          loading="eager"
          decoding="async"
          className={`block h-full w-full object-contain object-center ${imageClassName}`.trim()}
        />
      </span>

      {showWordmark ? (
        <div className="min-w-0">
          <p className="font-display text-[2rem] font-semibold leading-none tracking-[0.06em] text-teal-900 sm:text-[2.2rem]">
            JEEVANAM 360
          </p>
          <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.34em] text-emerald-700/85 sm:text-[0.72rem]">
            Yoga | Wellness | Balance
          </p>
        </div>
      ) : null}
    </div>
  );
}