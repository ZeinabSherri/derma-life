"use client";

import { FormEvent, useState } from "react";

/**
 * NOTE: this project has no backend/email service wired up, so this form
 * doesn't actually send anywhere yet - it just validates and shows a
 * confirmation locally. Wiring it to a real inbox needs either an email API
 * (e.g. Resend) or a destination address, which is a decision for whoever
 * owns this site, not something to invent silently.
 */
export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div className="rounded-2xl bg-[#F5F3EE] p-8 text-center">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#6B8F71]">
          Message Sent
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-[#2B302B]">
          Thank you!
        </h2>
        <p className="mt-2 text-lg text-[#2B302B]/80">
          We&apos;ve received your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl bg-[#F5F3EE] p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-left">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#2B302B]/70">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            className="rounded-xl border border-[#2B302B]/15 bg-white px-4 py-3 text-base text-[#2B302B] outline-none transition-colors duration-150 focus:border-[#6B8F71] focus:ring-2 focus:ring-[#6B8F71]/20"
          />
        </label>
        <label className="grid gap-1.5 text-left">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#2B302B]/70">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            className="rounded-xl border border-[#2B302B]/15 bg-white px-4 py-3 text-base text-[#2B302B] outline-none transition-colors duration-150 focus:border-[#6B8F71] focus:ring-2 focus:ring-[#6B8F71]/20"
          />
        </label>
      </div>

      <label className="grid gap-1.5 text-left">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#2B302B]/70">
          Company (optional)
        </span>
        <input
          type="text"
          name="company"
          className="rounded-xl border border-[#2B302B]/15 bg-white px-4 py-3 text-base text-[#2B302B] outline-none transition-colors duration-150 focus:border-[#6B8F71] focus:ring-2 focus:ring-[#6B8F71]/20"
        />
      </label>

      <label className="grid gap-1.5 text-left">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#2B302B]/70">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none rounded-xl border border-[#2B302B]/15 bg-white px-4 py-3 text-base text-[#2B302B] outline-none transition-colors duration-150 focus:border-[#6B8F71] focus:ring-2 focus:ring-[#6B8F71]/20"
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center gap-10 self-start rounded-full bg-[#1F3A2E] py-3 pl-6 pr-3 font-sans text-sm font-bold uppercase tracking-[0.2em] text-white transition-colors duration-150 hover:bg-[#16291f]"
      >
        Send Message
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-white/15 text-lg"
        >
          ↗
        </span>
      </button>
    </form>
  );
}
