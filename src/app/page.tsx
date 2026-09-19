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

  // SkyDive is removed from the site entirely - filtered here rather than
  // deleted from Prismic content, so it stays out even though editors could
  // still re-add it in the CMS without a code change.
  const slices = home.data.slices.filter(
    (slice) => slice.slice_type !== "sky_dive",
  );

  return <SliceZone slices={slices} components={components} />;
}
