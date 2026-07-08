import type { Metadata } from "next";
import "../styles/global.css";
import { inter, display } from "./fonts";
import { LenisGSAPProvider } from "@/components/providers/LenisGSAPProvider";
import { Nav } from "@/components/nav/Nav";
import { SoundToggle } from "@/components/audio/SoundToggle";

// Absolute base for OG/canonical URLs. Vercel injects VERCEL_URL per deploy; override with
// NEXT_PUBLIC_SITE_URL once the client's domain is connected.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const title = "DronesZ India — Redefining Flight. Assembling the Future.";
const description =
  "DronesZ India: custom drones, counter-UAS systems, consumer drones, components, and lab setup services. Mumbai-based.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // og:image / twitter:image are auto-wired from app/opengraph-image.tsx.
  openGraph: { title, description, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>
        <LenisGSAPProvider>
          <Nav />
          {children}
          <SoundToggle />
        </LenisGSAPProvider>
      </body>
    </html>
  );
}
