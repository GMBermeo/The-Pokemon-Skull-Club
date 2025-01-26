"use server";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <FloatingMenu />
      </body>
    </html>
  );
}
