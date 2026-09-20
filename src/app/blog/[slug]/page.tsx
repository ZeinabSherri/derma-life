import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

import { Bounded } from "@/components/Bounded";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-posts";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | DermaLife Blog`,
    description: post.excerpt,
  };
}

function imageExists(filename: string) {
  return fs.existsSync(path.join(process.cwd(), "public", "blog", filename));
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const hasImage = imageExists(post.image);

  return (
    <Bounded className="min-h-screen bg-white pb-24 text-[#2B302B]">
      {/* Padding lives here, not on the Bounded/section itself - see
          src/app/contact/page.tsx for why (Bounded's own first:pt-10 beats
          a plain pt-* class on CSS specificity since this Bounded is the
          first child of <main>). */}
      <div className="mx-auto w-full max-w-3xl pt-32 md:pt-40">
        {/* Plain anchor - see BlogTeaser.tsx for why. */}
        <a
          href="/blog"
          className="inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.2em] text-[#2B302B] transition-colors duration-150 hover:text-[#6B8F71]"
        >
          <span aria-hidden="true">←</span>
          Back to Blog
        </a>

        <span
          className="mt-8 block w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: post.categoryColor }}
        >
          {post.category}
        </span>

        <h1 className="mt-4 text-balance font-serif text-4xl font-bold leading-[1.05] text-[#2B302B] lg:text-5xl">
          {post.title}
        </h1>

        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#F3F1EC] shadow-lg">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/blog/${post.image}`}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div
              className="flex size-full items-center justify-center text-white/70"
              style={{ backgroundColor: post.categoryColor }}
            >
              Image coming soon
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-5 text-lg leading-relaxed text-[#2B302B]/90">
          {post.body.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={i}
                  className="mt-4 font-serif text-2xl font-bold text-[#2B302B]"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={i} className="flex flex-col gap-4">
                  {block.items.map((item, j) => (
                    <li key={j}>
                      {item.label && (
                        <span className="font-bold text-[#2B302B]">
                          {item.label}:{" "}
                        </span>
                      )}
                      {item.text}
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#2B302B]/5 px-3 py-1 text-sm font-medium text-[#2B302B]/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-12">
          {/* Plain anchor - see BlogTeaser.tsx for why. */}
          <a
            href="/blog"
            className="inline-flex items-center gap-10 rounded-full bg-[#1F3A2E] py-3 pl-6 pr-3 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-150 hover:bg-[#16291f]"
          >
            Back to Blog
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-white/15 text-lg"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </Bounded>
  );
}
