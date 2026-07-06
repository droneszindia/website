import type { Metadata } from "next";
import "../styles/global.css";
import { inter, display } from "./fonts";
import { LenisGSAPProvider } from "@/components/providers/LenisGSAPProvider";
import { Nav } from "@/components/nav/Nav";

export const metadata: Metadata = {
  title: "DronesZ India — Redefining Flight. Assembling the Future.",
  description:
    "DronesZ India: custom drones, counter-UAS systems, consumer drones, components, and lab setup services. Mumbai-based.",
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
        </LenisGSAPProvider>
      </body>
    </html>
  );
}
