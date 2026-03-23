import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getPortfolioData } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getPortfolioData();
    return {
      title: `${data.name} | ${data.title}`,
      description: data.description || "Full Stack Developer Portfolio",
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
  }

  return {
    title: "Paul Parthiban J | Backend Developer",
    description: "Full Stack Developer Portfolio",
  };
}

import { CustomCursor } from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="custom" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased noise-overlay`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
