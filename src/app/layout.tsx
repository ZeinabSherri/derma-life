import { Inter, Manrope } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

import "./app.css";
import Header from "@/components/Header";
import ViewCanvas from "@/components/ViewCanvas";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

// The site's 2-font system: Manrope for headings/eyebrows/nav/buttons, Inter
// for body copy/forms (see app.css for how these map to --font-heading /
// --font-body). No italic accent font - headings render plainly, including
// the words that used to be italicized. Loaded once, globally, via
// next/font (not a <link> tag) so there's a single source of truth and no
// render-blocking request.
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} overflow-x-hidden bg-white font-body`}
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
