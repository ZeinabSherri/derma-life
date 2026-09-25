import { Jost } from "next/font/google";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

import "./app.css";
import Header from "@/components/Header";
import ViewCanvas from "@/components/ViewCanvas";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

// The site otherwise uses only system fonts (Helvetica Neue/Arial, Georgia
// - see tailwind.config.js `fontFamily`). Jost is loaded here as a CSS
// variable only, scoped via the `font-heroSans` utility to the Header and
// Hero restyle - registering the variable on <body> doesn't change body's
// own font-family (that's still the `sans`/`serif` Tailwind classes below),
// it just makes `var(--font-jost)` available to opt into further down.
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} overflow-x-hidden bg-white`}>
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
