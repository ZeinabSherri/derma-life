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
      <div className="rounded-lg border border-[#2B302B]/10 bg-white p-8 text-center">
        <h2 className="text-2xl font-bold text-[#6B8F71]">Thank you!</h2>
        <p className="mt-2 text-lg opacity-80">
          We&apos;ve received your message and will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border border-[#2B302B]/10 bg-white p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-left">
          <span className="text-sm font-bold uppercase tracking-wide">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            className="rounded-md border border-[#2B302B]/20 px-4 py-3 text-base outline-none focus:border-[#6B8F71]"
          />
        </label>
        <label className="grid gap-1 text-left">
          <span className="text-sm font-bold uppercase tracking-wide">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-[#2B302B]/20 px-4 py-3 text-base outline-none focus:border-[#6B8F71]"
          />
        </label>
      </div>

      <label className="grid gap-1 text-left">
        <span className="text-sm font-bold uppercase tracking-wide">
          Company (optional)
        </span>
        <input
          type="text"
          name="company"
          className="rounded-md border border-[#2B302B]/20 px-4 py-3 text-base outline-none focus:border-[#6B8F71]"
        />
      </label>

      <label className="grid gap-1 text-left">
        <span className="text-sm font-bold uppercase tracking-wide">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="resize-none rounded-md border border-[#2B302B]/20 px-4 py-3 text-base outline-none focus:border-[#6B8F71]"
        />
      </label>

      <button
        type="submit"
        className="mt-2 rounded-xl bg-[#6B8F71] px-6 py-4 text-center text-xl font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-[#597861]"
      >
        Send Message
      </button>
    </form>
  );
}
