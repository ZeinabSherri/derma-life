import { Metadata } from "next";

import { Bounded } from "@/components/Bounded";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | DermaLife",
  description:
    "Ready to bring your brand to life? Get in touch with DermaLife about your product, packaging, and manufacturing needs.",
};

const CONTACT_DETAILS: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  icon: JSX.Element;
}[] = [
  {
    label: "Location",
    value: "Beirut, Lebanon",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+39 351 584 6229",
    href: "tel:+393515846229",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    value: "+961 71 503 354",
    href: "https://wa.me/96171503354",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "info@dermalifelb.com",
    href: "mailto:info@dermalifelb.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <Bounded className="min-h-screen bg-white pb-24 text-[#2B302B]">
      {/* Padding lives here, not on the Bounded/section itself - Bounded's
          own `first:pt-10` (it's the first child of <main>) beats a plain
          pt-* class on higher CSS specificity (pseudo-class > class),
          which was leaving only 40px of clearance under the absolutely
          positioned header and causing a real overlap on mobile. */}
      <div className="mx-auto w-full max-w-2xl pt-32 text-center md:pt-40">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
          Contact Us
        </p>
        <h1 className="mt-2 text-balance font-serif text-6xl font-bold leading-[.95] text-[#2B302B] lg:text-7xl">
          Get in <em className="font-normal italic">touch.</em>
        </h1>
        <p className="mt-6 text-balance text-lg font-normal text-[#2B302B]/80 lg:text-xl">
          Ready to bring your brand to life? Let&apos;s talk about your product,
          packaging, and manufacturing needs.
        </p>
      </div>

      <div className="mx-auto mt-14 grid w-full max-w-4xl gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        <ContactForm />

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
            Reach Us
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#2B302B]">
            Keep in touch.
          </h2>
          <ul className="mt-6 flex flex-col gap-5">
            {CONTACT_DETAILS.map((item) => (
              <li key={item.label} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1F3A2E]/10 text-[#1F3A2E]">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#2B302B]/60">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="font-serif text-lg font-bold text-[#2B302B] transition-colors duration-150 hover:text-[#6B8F71]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-serif text-lg font-bold text-[#2B302B]">
                      {item.value}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl text-center">
        {/* Plain anchor - see src/slices/AlternatingText/BlogTeaser.tsx for why. */}
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
