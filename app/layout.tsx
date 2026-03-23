import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
        className={`${inter.variable} font-sans antialiased noise-overlay`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
