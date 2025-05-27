"use server";
import "./globals.css";
import { JSX } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { baseMetadata, jsonLd } from "@lib";
import { FloatingMenu } from "@components";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  return (
    <html lang="en">
      <head>
        <meta
          name="impact-site-verification"
          content={process.env.NEXT_PUBLIC_IMPACT_SITE_VERIFICATION}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="epn-config"
          dangerouslySetInnerHTML={{
            __html: `window._epn = {campaign: 5339099221};`,
          }}
        />
        <Script src="https://epnt.ebay.com/static/epn-smart-tools.js" />
      </head>
      <body className={inter.className}>
        {children}
        <FloatingMenu />
        <VercelAnalytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        />
      </body>
    </html>
  );
}
