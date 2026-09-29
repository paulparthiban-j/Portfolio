import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";

import { getPortfolioData } from "@/lib/portfolio";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0A0A0B",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getPortfolioData();
    const title = `${data.name} | ${data.title}`;
    const description = data.description || "Senior Software Engineer Portfolio";

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
    title: "Paul Parthiban J | Senior Software Engineer",
    description: "Senior Software Engineer specializing in React, Node.js, .NET, and enterprise applications.",
  };
}

import { CustomCursor } from "@/components/ui/CustomCursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const INTRO_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem("intro-seen")){d.classList.add("intro-seen")}else{sessionStorage.setItem("intro-seen","1")}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="custom" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: play the intro curtain only once per session */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body
        className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased noise-overlay`}
      >
        <MotionProvider>
          <ScrollProgress />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:font-bold focus:transition-all"
          >
            Skip to main content
          </a>
          <SmoothScroll>
            <CustomCursor />
            <div id="main-content">
              {children}
            </div>
          </SmoothScroll>
        </MotionProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
