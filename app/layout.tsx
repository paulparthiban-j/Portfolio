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
    const title = `${data.name} | ${data.title}`;
    const description = data.description || "Full Stack Developer Portfolio";

    return {
      title,
      description,
      keywords: [
        "Paul Parthiban", "Software Developer", "React", "Node.js", ".NET",
        "TypeScript", "Full Stack Developer", "Backend Developer",
        "Enterprise Applications", "SAP Integration", "Portfolio"
      ],
      authors: [{ name: data.name }],
      openGraph: {
        title,
        description,
        type: "website",
        locale: "en_US",
        siteName: `${data.name} Portfolio`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
  }

  return {
    title: "Paul Parthiban J | Full-Stack Developer",
    description: "Full-Stack Developer specializing in React, Node.js, .NET, and enterprise applications.",
  };
}

import { CustomCursor } from "@/components/ui/CustomCursor";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <SpeedInsights />
      </body>
    </html>
  );
}
