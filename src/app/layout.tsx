import { Inter, Manrope, Instrument_Serif } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

import "./app.css";
import Header from "@/components/Header";
import ViewCanvas from "@/components/ViewCanvas";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

// The site's whole 3-font system: Manrope for headings/eyebrows/nav/buttons,
// Inter for body copy/forms, Instrument Serif Italic for the single accent
// word inside headings (see app.css for how these map to --font-heading /
// --font-body / --font-accent, and the em{} rule that targets the accent
// markup). Loaded once, globally, via next/font (not a <link> tag) so
// there's a single source of truth and no render-blocking request.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} ${instrumentSerif.variable} overflow-x-hidden bg-white font-body`}
      >
        <CustomCursor />
        <Header />
        <main>
          {children}
          <ViewCanvas />
        </main>
        <Footer />
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
