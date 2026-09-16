import React from "react";
import CircleText from "./CircleText";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="border-t border-[#2B302B]/10 bg-white text-[#2B302B]">
      <div className="relative mx-auto flex w-full max-w-4xl justify-center px-4 py-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/social-logo.png" alt="DermaLife" className="h-14 w-auto" />
        <div className="absolute right-24 top-0 size-28 origin-center -translate-y-14 md:size-48 md:-translate-y-28">
          <CircleText
            textColor="#6B8F71"
            backgroundColor="#F3F5F0"
            className="drop-shadow-sm"
          />
        </div>
      </div>
    </footer>
  );
}
