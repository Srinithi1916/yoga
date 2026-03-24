import { LotusIcon } from './Illustrations';

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}) {
  const alignment =
    align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div className={`mx-auto flex max-w-3xl flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <span className="pill-chip bg-white/45 text-xs font-bold uppercase tracking-[0.28em] text-rose-700/80">
          {eyebrow}
        </span>
      ) : null}
      <div className={`flex items-center gap-3 ${align === 'left' ? '' : 'justify-center'}`}>
        <LotusIcon className="h-7 w-7 text-rose-400" />
        <h2 className="font-display text-5xl font-semibold text-rose-950 text-shadow-soft md:text-6xl">
          {title}
        </h2>
        <LotusIcon className="h-7 w-7 text-rose-400" />
      </div>
      {description ? <p className="section-copy max-w-3xl">{description}</p> : null}
    </div>
  );
}