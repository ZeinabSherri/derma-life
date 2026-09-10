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

      <div className="mx-auto mt-12 grid w-full max-w-4xl gap-8 lg:grid-cols-2 lg:items-start">
        <ContactForm />

        <div className="rounded-lg border border-[#2B302B]/10 bg-white p-6">
          <h2 className="text-2xl font-bold text-[#6B8F71]">Keep In Touch</h2>
          <ul className="mt-6 flex flex-col gap-5">
            {CONTACT_DETAILS.map((item) => (
              <li key={item.label} className="flex items-start gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6B8F71]/10 text-[#6B8F71]">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide opacity-60">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-lg font-medium text-[#2B302B] transition-colors duration-150 hover:text-[#6B8F71]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-lg font-medium">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
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
