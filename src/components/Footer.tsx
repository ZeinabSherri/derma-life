import React from "react";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="bg-[#14211A] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/social-logo.png"
              alt="DermaLife"
              className="h-12 w-auto invert"
            />
          </div>
          <p className="max-w-md text-[#F5F3EE]/80 md:text-right">
            We specialize in private labeling and custom formulations
            tailored to your brand across skincare, hair care, personal
            care, and baby care.
          </p>
        </div>

        <div className="relative my-8 h-px w-full bg-white/10">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C98F5E]"
          />
        </div>

        <div className="flex flex-col gap-4 text-sm text-[#F5F3EE]/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Derma Life.</p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              className="text-[#8FAEC0] transition-colors duration-150 hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-and-conditions"
              className="text-[#8FAEC0] transition-colors duration-150 hover:text-white"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
