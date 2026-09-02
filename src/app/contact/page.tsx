import { Metadata } from "next";

import { Bounded } from "@/components/Bounded";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | DermaLife",
  description:
    "Ready to bring your brand to life? Get in touch with DermaLife about your product, packaging, and manufacturing needs.",
};

export default function ContactPage() {
  return (
    <Bounded className="min-h-screen bg-[#FAFAF8] pb-24 text-[#2B302B]">
      {/* See src/app/blog/page.tsx for why this is a nested wrapper's
          margin-top rather than a pt-* utility on Bounded itself. */}
      <div className="mx-auto mt-32 max-w-2xl text-center">
        <h1 className="text-balance text-6xl font-black uppercase leading-[.9] text-[#6B8F71] lg:text-7xl">
          Get In Touch
        </h1>
        <p className="mt-6 text-balance text-xl font-normal opacity-80">
          Ready to bring your brand to life? Let&apos;s talk about your product,
          packaging, and manufacturing needs.
        </p>
      </div>

      <div className="mx-auto mt-12 w-full max-w-xl">
        <ContactForm />
      </div>

      <div className="mx-auto mt-12 max-w-xl text-center">
        <p className="text-base opacity-70">
          Prefer email? Reach us directly at{" "}
          <a
            href="mailto:hello@dermalifelb.com"
            className="font-bold text-[#6B8F71] underline"
          >
            hello@dermalifelb.com
          </a>
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl text-center">
        {/* Plain anchor - see src/slices/AlternatingText/BlogTeaser.tsx for why. */}
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
