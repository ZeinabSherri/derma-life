import { Metadata } from "next";

import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// This component renders your homepage.
//
// Use Next's generateMetadata function to render page metadata.
//
// Use the SliceZone to render the content of the page.

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "DermaLife",
    description:
      "DermaLife specializes in private labeling and custom formulations for skincare, hair care, personal care, and baby care brands worldwide.",
    openGraph: {
      title: "DermaLife | Skincare & Haircare Manufacturing",
    },
  };
}

export default async function Index() {
  // The client queries content from the Prismic API
  const client = createClient();
  const home = await client.getByUID("page", "home");

  // SkyDive and BigText ("Science that makes you Beautiful") are removed
  // from the site entirely - filtered here rather than deleted from Prismic
  // content, so they stay out even though editors could still re-add them
  // in the CMS without a code change.
  const slices = home.data.slices.filter(
    (slice) => slice.slice_type !== "sky_dive" && slice.slice_type !== "big_text",
  );

  return <SliceZone slices={slices} components={components} />;
}
