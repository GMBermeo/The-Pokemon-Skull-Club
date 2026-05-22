import "./globals.css";
import type { JSX } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { baseMetadata, baseViewport, jsonLd } from "@lib";
import { FloatingMenu } from "@components";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = baseViewport;

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const IMPACT_VERIFICATION = process.env.NEXT_PUBLIC_IMPACT_SITE_VERIFICATION;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://images.pokemontcg.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.pokemontcg.io" />
        {IMPACT_VERIFICATION && (
          <meta
            name="impact-site-verification"
            content={IMPACT_VERIFICATION}
          />
        )}
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <FloatingMenu />
        <VercelAnalytics />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
