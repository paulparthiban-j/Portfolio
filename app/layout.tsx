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

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3006';
  try {
    const response = await fetch(`${baseUrl}/api/portfolio`, { next: { revalidate: 60 } });
    if (response.ok) {
      const data = await response.json();
      return {
        title: `${data.name} | ${data.title}`,
        description: data.description || "Full Stack Developer Portfolio",
      };
    }
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
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
