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
    <Bounded className="min-h-screen bg-[#FAFAF8] pb-24 text-[#2B302B]">
      {/* See blog/page.tsx for why this is a nested-wrapper margin-top and
          not a pt-* utility on Bounded itself. */}
      <div className="mx-auto mt-32 max-w-3xl">
        {/* Plain anchor - see BlogTeaser.tsx for why. */}
        <a
          href="/blog"
          className="text-sm font-bold uppercase tracking-wide text-[#6B8F71] hover:underline"
        >
          ← Back to Blog
        </a>

        <span
          className="mt-6 block w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: post.categoryColor }}
        >
          {post.category}
        </span>

        <h1 className="mt-4 text-balance text-4xl font-black leading-tight lg:text-5xl">
          {post.title}
        </h1>

        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-[#EDE3DD]">
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

        <div className="mt-10 flex flex-col gap-5 text-lg leading-relaxed">
          {post.body.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2 key={i} className="mt-4 text-2xl font-bold">
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
                        <span className="font-bold">{item.label}: </span>
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
              className="rounded-full bg-[#2B302B]/5 px-3 py-1 text-sm font-medium opacity-70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-12">
          {/* Plain anchor - see BlogTeaser.tsx for why. */}
          <a
            href="/blog"
            className="inline-block rounded-xl bg-[#6B8F71] px-6 py-4 text-center text-xl font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#597861]"
          >
            Back to Blog
          </a>
        </div>
      </div>
    </Bounded>
  );
}
