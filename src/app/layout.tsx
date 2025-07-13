import type { Metadata } from "next";
import { Suspense } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://crafti-nagma.vercel.app/'),
  title: "Crafti Nagma — Product Entry Page",
  description: "This is a page where we can generate product object.",
  openGraph: {
    title: "Crafti Nagma — Product Entry Page",
    description: "This is a page where we can generate product object.",
    siteName: "Crafti Nagma - Product Entry Page",
    images: [
      {
        url: "/Logo/website-logo.png",
        width: 1200,
        height: 630,
        alt: "Crafti Nagma Logo",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/Logo/website-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-t from-amber-600/30 to-amber-600/60">
        <Suspense fallback={<div>Loading...</div>} >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
