import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Cinzel, Inter, Montserrat, Roboto_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { SITE } from "@/lib/data";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-cinzel" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-montserrat" });
const mono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-face" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || SITE.url),
  title: {
    default: "Saving Solutions Group | Insurance, Risk Management & Property Solutions, Miami",
    template: "%s | Saving Solutions Group",
  },
  description:
    "Business, home, auto, private client, and life insurance from Miami, plus performance-based water conservation. Quote online in minutes, then talk to a real advisor. Digital speed. Human advice.",
  keywords: [
    "Miami insurance agency", "Florida business insurance", "commercial property insurance Florida", "high net worth insurance Miami",
    "yacht insurance Miami", "flood insurance Florida", "workers compensation Florida", "certificate of insurance", "water conservation Miami",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Saving Solutions Group | Digital Speed. Human Advice.",
    description: "What do you need to protect? Business, home, auto, private client, life, and water. Start a quote in minutes.",
    images: [{ url: "/media/og.jpg", width: 1200, height: 670, alt: "Miami skyline at blue hour, Saving Solutions Group" }],
  },
  twitter: { card: "summary_large_image", images: ["/media/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#04070c", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: SITE.name,
  url: SITE.url,
  telephone: SITE.phone,
  email: SITE.email,
  areaServed: ["Miami-Dade County", "Broward County", "Palm Beach County", "Florida"],
  founder: { "@type": "Person", name: "Elizabeth Mesegue", jobTitle: "Founder & CEO" },
  slogan: SITE.tagline,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} ${montserrat.variable} ${mono.variable}`}>
      <body data-custom-cursor="on">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Cursor />
        <Nav />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
        <MobileBar />
      </body>
    </html>
  );
}
