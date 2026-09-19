const CATEGORIES = ["Skincare", "Haircare", "Body Care", "Private Label"];

// Rendered twice back-to-back so the marquee animation (-50%) loops
// seamlessly - see the `marquee` keyframe in tailwind.config.js.
const ITEMS = [...CATEGORIES, ...CATEGORIES];

export default function CategoryTicker() {
  return (
    <div className="relative z-[75] overflow-hidden bg-[#2B302B] py-5">
      <div className="flex w-max animate-marquee items-center">
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
    </div>
  );
}
