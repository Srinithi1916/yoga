import { BlossomSpray, FloralCorner, LeafWisp, LotusBloom } from './Decorations';
import FloatingParticles from './FloatingParticles';

export default function PastelBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-200 to-purple-200" />
      <div className="absolute -left-16 -top-10 h-[420px] w-[420px] rounded-full bg-pink-300 blur-3xl opacity-30" />
      <div className="absolute -bottom-16 -right-10 h-[420px] w-[420px] rounded-full bg-purple-300 blur-3xl opacity-30" />
      <div className="absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-rose-200 blur-3xl opacity-20" />
      <div className="absolute right-[16%] top-[46%] h-[280px] w-[280px] rounded-full bg-orange-200 blur-3xl opacity-30" />
      <div className="absolute left-[9%] top-[56%] h-[240px] w-[240px] rounded-full bg-fuchsia-200 blur-3xl opacity-20" />
      <div className="absolute inset-x-0 top-0 h-48 bg-white/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_34%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.22),transparent_30%)]" />
      <FloatingParticles />
      <FloralCorner className="absolute left-0 top-24 h-44 w-44 opacity-70 md:h-56 md:w-56" />
      <FloralCorner className="absolute bottom-0 left-0 h-48 w-48 opacity-80 md:h-64 md:w-64" />
      <FloralCorner className="absolute bottom-0 right-0 h-52 w-52 -scale-x-100 opacity-80 md:h-64 md:w-64" />
      <FloralCorner className="absolute right-0 top-56 h-44 w-44 -scale-x-100 opacity-60 md:h-56 md:w-56" />
      <FloralCorner className="absolute left-1/2 top-[46%] hidden h-40 w-40 -translate-x-1/2 opacity-40 lg:block" />
      <BlossomSpray className="absolute left-[6%] top-[33%] h-24 w-24 opacity-80 md:h-28 md:w-28" tone="rose" />
      <BlossomSpray className="absolute right-[9%] top-[18%] hidden h-28 w-28 opacity-75 md:block" tone="lavender" />
      <BlossomSpray className="absolute left-[12%] bottom-[22%] hidden h-28 w-28 opacity-80 md:block" tone="peach" />
      <BlossomSpray className="absolute right-[14%] bottom-[26%] h-24 w-24 opacity-75 md:h-28 md:w-28" tone="rose" />
      <BlossomSpray className="absolute left-[32%] top-[14%] hidden h-20 w-20 opacity-65 lg:block" tone="peach" />
      <BlossomSpray className="absolute right-[28%] top-[58%] hidden h-24 w-24 opacity-60 lg:block" tone="lavender" />
      <LotusBloom className="absolute bottom-2 left-1/2 hidden h-24 w-44 -translate-x-1/2 opacity-65 md:block" />
      <LeafWisp className="absolute left-3 top-[16rem] hidden h-44 w-32 opacity-55 lg:block" />
      <LeafWisp className="absolute right-6 top-[22rem] hidden h-48 w-36 -scale-x-100 opacity-55 lg:block" />
    </div>
  );
}