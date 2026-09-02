import React from "react";

type Props = {};

export default function Header({}: Props) {
  return (
    <header className="-mb-28 flex justify-center py-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dermalife-logo.jpg"
        alt="DermaLife"
        className="z-10 h-20 w-auto cursor-pointer"
      />
    </header>
  );
}
