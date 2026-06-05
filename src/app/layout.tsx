import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfuniverse.omadigital.net"),
  title: { default: "OMA PDF", template: "%s · OMA PDF" },
  description: "Outils PDF professionnels dans le navigateur, par OMA Digital.",
  openGraph: {
    siteName: "OMA PDF",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={`${inter.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] antialiased">
        {children}
      </body>
    </html>
  );
}
