import { Metadata } from "next";

import { Bounded } from "@/components/Bounded";

export const metadata: Metadata = {
  title: "Blog | DermaLife",
  description:
    "Insights on skincare science, formulation trends, and industry updates from DermaLife.",
};

type Post = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
};

const POSTS: Post[] = [
  {
    category: "Skincare Science",
    title: "The Science Behind Hyaluronic Acid: Why It's a Skincare Staple",
    excerpt:
      "How this naturally occurring humectant holds up to 1,000 times its weight in water - and what that means for formulating effective hydrating serums.",
    date: "2026-08-12",
  },
  {
    category: "Formulation Trends",
    title: "2026 Formulation Trends: Waterless Beauty and Solid Skincare",
    excerpt:
      "Anhydrous formulations are reshaping private label skincare - lower shipping weight, longer shelf life, and less packaging waste.",
    date: "2026-08-05",
  },
  {
    category: "Industry Updates",
    title: "Understanding GMP Compliance in Cosmetic Manufacturing",
    excerpt:
      "A practical look at what Good Manufacturing Practice certification actually covers, and why it matters when you're choosing a contract manufacturer.",
    date: "2026-07-29",
  },
  {
    category: "Skincare Science",
    title:
      "Niacinamide vs. Vitamin C: Choosing the Right Active for Your Brand",
    excerpt:
      "Two of the most requested actives in private label skincare, compared - stability, pH sensitivity, and how they perform together.",
    date: "2026-07-18",
  },
  {
    category: "Industry Updates",
    title: "The Rise of Clean Beauty: What Private Label Brands Need to Know",
    excerpt:
      "Consumer demand for transparent, ethically sourced ingredients is accelerating - here's how it's shaping ingredient sourcing across the industry.",
    date: "2026-07-09",
  },
  {
    category: "Formulation Trends",
    title:
      "From Concept to Shelf: A Guide to New Product Development Timelines",
    excerpt:
      "What actually happens between an initial formulation brief and a market-ready product, and how to plan your launch timeline around it.",
    date: "2026-06-27",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Skincare Science": "#A9746E",
  "Formulation Trends": "#C4915B",
  "Industry Updates": "#7C6A8E",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  return (
    <Bounded className="min-h-screen bg-[#FAFAF8] pb-24 text-[#2B302B]">
      {/*
        Bounded's own `first:pt-10` has higher CSS specificity than a plain
        `pt-*` utility passed via className (the pseudo-class beats a bare
        utility), so it silently wins and the header's logo (which floats
        over the next element via a negative margin) ends up overlapping
        the heading. Using a nested wrapper's margin-top instead sidesteps
        that specificity fight entirely.
      */}
      <div className="mx-auto mt-32 max-w-3xl text-center">
        <h1 className="text-balance text-6xl font-black uppercase leading-[.9] text-[#6B8F71] lg:text-7xl">
          From Our Blog
        </h1>
        <p className="mt-6 text-balance text-xl font-normal opacity-80">
          Insights on skincare science, formulation trends, and industry
          updates — stay ahead with DermaLife&apos;s latest articles.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
        {POSTS.map((post) => (
          <article
            key={post.title}
            className="flex flex-col gap-4 rounded-lg border border-[#2B302B]/10 bg-white p-6 shadow-sm"
          >
            <span
              className="w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
              style={{
                backgroundColor: CATEGORY_COLORS[post.category] ?? "#6B8F71",
              }}
            >
              {post.category}
            </span>
            <h2 className="text-balance text-2xl font-bold leading-tight">
              {post.title}
            </h2>
            <p className="text-base font-normal opacity-80">{post.excerpt}</p>
            <time
              dateTime={post.date}
              className="mt-auto text-sm font-medium opacity-60"
            >
              {formatDate(post.date)}
            </time>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl text-center">
        {/* Plain anchor - see BlogTeaser.tsx for why. */}
        <a
          href="/"
          className="inline-block rounded-xl bg-[#6B8F71] px-6 py-4 text-center text-xl font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#597861]"
        >
          Back to Home
        </a>
      </div>
    </Bounded>
  );
}
