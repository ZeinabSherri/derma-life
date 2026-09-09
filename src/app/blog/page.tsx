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
        {BLOG_POSTS.map((post) => {
          const hasImage = imageExists(post.image);
          return (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-[#2B302B]/10 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md"
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
                <h2 className="text-balance text-2xl font-bold leading-tight group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-base font-normal opacity-80">
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
          className="inline-block rounded-xl bg-[#6B8F71] px-6 py-4 text-center text-xl font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#597861]"
        >
          Back to Home
        </a>
      </div>
    </Bounded>
  );
}
