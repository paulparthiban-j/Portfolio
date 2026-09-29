"use client";

import { Suspense } from "react";
import { PortfolioContent } from "@/types/portfolio";
import { HeroSection } from "@/components/sections/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { IntroCurtain } from "@/components/ui/IntroCurtain";

// Imported directly rather than with React.lazy: lazy sections suspended on
// the server, which streamed a 50vh placeholder that was then swapped for the
// real section - a layout shift on every load. They are all in the initial
// HTML anyway, so splitting them out bought nothing.
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CredibilitySection } from "@/components/sections/CredibilitySection";
import { CustomSections } from "@/components/sections/CustomSections";
import { Footer } from "@/components/sections/Footer";

// Content is resolved on the server (app/page.tsx) so the very first HTML
// already contains the real hero - no spinner, no blank fade-in waiting on a
// client-side fetch.
export function HomePage({ content }: { content: PortfolioContent }) {
  return (
    <>
      <div className={`min-h-screen relative ${content.theme?.mode === "light" ? "bg-slate-50 text-slate-900" : "bg-[#0A0A0B] text-white"}`}>
        <IntroCurtain name={content.name} />
        <Navbar content={content} />
        {/* Each below-the-fold section is its own Suspense boundary. Nothing here
            suspends (the HTML is complete), but separate boundaries let React
            hydrate section by section and yield to the browser in between,
            instead of one long main-thread task (lower Total Blocking Time). */}
        <main className="relative z-10" role="main">
          <div id="hero" aria-label="Hero section"><HeroSection content={content} /></div>
          <Suspense><div id="about" className="scroll-mt-20 section-reveal" aria-label="About section"><AboutSection content={content} /></div></Suspense>
          <Suspense><div id="skills" className="scroll-mt-20 section-reveal" aria-label="Skills section"><SkillsSection content={content} /></div></Suspense>
          <Suspense><div id="projects" className="scroll-mt-20" aria-label="Projects section"><ProjectsSection content={content} /></div></Suspense>
          <Suspense><div id="experience" className="scroll-mt-20 section-reveal" aria-label="Experience section"><ExperienceSection content={content} /></div></Suspense>
          <Suspense><div id="credibility" className="scroll-mt-20 section-reveal" aria-label="Credibility section"><CredibilitySection content={content} /></div></Suspense>
          <Suspense><div id="education" className="scroll-mt-20 section-reveal" aria-label="Education section"><EducationSection content={content} /></div></Suspense>
          <Suspense><CustomSections content={content} /></Suspense>
          <Suspense><div id="contact" aria-label="Contact section"><Footer content={content} /></div></Suspense>
        </main>
      </div>
    </>
  );
}
