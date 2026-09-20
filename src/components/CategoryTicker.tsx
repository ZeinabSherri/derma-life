const CATEGORIES = ["Skincare", "Haircare", "Body Care", "Private Label"];

// Rendered twice back-to-back so the marquee animation (-50%) loops
// seamlessly - see the `marquee` keyframe in tailwind.config.js.
const ITEMS = [...CATEGORIES, ...CATEGORIES];

export default function CategoryTicker() {
  return (
    <div className="relative z-[75] overflow-hidden bg-[#2B302B] py-5">
      {/* Desktop: the animated scrolling marquee. */}
      <div className="hidden w-max animate-marquee items-center lg:flex">
        {ITEMS.map((label, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-10 pr-10 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            {label}
            <span aria-hidden="true" className="text-lg leading-none text-[#8FAE8F]">
              +
            </span>
          </span>
        ))}
      </div>

      {/* Mobile/tablet: a still, wrapped row instead of the scrolling
          marquee - no continuous motion, and only the categories shown
          once each (not doubled, since there's no loop to seam). */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 lg:hidden">
        {CATEGORIES.map((label, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-3 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            {label}
            {i < CATEGORIES.length - 1 && (
              <span aria-hidden="true" className="text-lg leading-none text-[#8FAE8F]">
                +
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
