import { Metadata } from "next";
import fs from "fs";
import path from "path";

import { Bounded } from "@/components/Bounded";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog | DermaLife",
  description:
    "Insights on skincare science, formulation trends, and industry updates from DermaLife.",
};

function imageExists(filename: string) {
  return fs.existsSync(path.join(process.cwd(), "public", "blog", filename));
}

export default function BlogIndexPage() {
  return (
    <Bounded className="min-h-screen bg-white pb-24 text-[#2B302B]">
      {/* Padding lives here, not on the Bounded/section itself - see
          src/app/contact/page.tsx for why (Bounded's own first:pt-10 beats
          a plain pt-* class on CSS specificity since this Bounded is the
          first child of <main>). */}
      <div className="mx-auto w-full max-w-3xl pt-32 text-center md:pt-40">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
          Our Blog
        </p>
        <h1 className="mt-2 text-balance font-serif text-6xl font-bold leading-[.95] text-[#2B302B] lg:text-7xl">
          From our <em className="font-normal italic">blog.</em>
        </h1>
        <p className="mt-6 text-balance text-lg font-normal text-[#2B302B]/80 lg:text-xl">
          Insights on skincare science, formulation trends, and industry
          updates &mdash; stay ahead with DermaLife&apos;s latest articles.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
        {BLOG_POSTS.map((post) => {
          const hasImage = imageExists(post.image);
          return (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-150 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EDE3DD]">
                {hasImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/blog/${post.image}`}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex size-full items-center justify-center text-sm font-medium text-white/70"
                    style={{ backgroundColor: post.categoryColor }}
                  >
                    Image coming soon
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <span
                  className="w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: post.categoryColor }}
                >
                  {post.category}
                </span>
                <h2 className="text-balance font-serif text-2xl font-bold leading-tight text-[#2B302B] group-hover:text-[#6B8F71]">
                  {post.title}
                </h2>
                <p className="text-base font-normal text-[#2B302B]/80">
                  {post.excerpt}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="mx-auto mt-16 max-w-3xl text-center">
        {/* Plain anchor - see BlogTeaser.tsx for why. */}
        <a
          href="/"
          className="inline-flex items-center gap-2 border-b border-[#2B302B] pb-1 font-sans text-sm font-bold uppercase tracking-[0.2em] text-[#2B302B] transition-colors duration-150 hover:border-[#6B8F71] hover:text-[#6B8F71]"
        >
          Back to Home
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </Bounded>
  );
}
