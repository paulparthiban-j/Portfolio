"use client";

import { MotionConfig } from "framer-motion";
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
    <MotionConfig reducedMotion="user">
      <div className={`min-h-screen relative ${content.theme?.mode === "light" ? "bg-slate-50 text-slate-900" : "bg-[#0A0A0B] text-white"}`}>
        <IntroCurtain name={content.name} />
        <Navbar content={content} />
        <main className="relative z-10" role="main">
          <div id="hero" aria-label="Hero section"><HeroSection content={content} /></div>
          <div id="about" className="scroll-mt-20 section-reveal" aria-label="About section"><AboutSection content={content} /></div>
          <div id="skills" className="scroll-mt-20 section-reveal" aria-label="Skills section"><SkillsSection content={content} /></div>
          <div id="projects" className="scroll-mt-20" aria-label="Projects section"><ProjectsSection content={content} /></div>
          <div id="experience" className="scroll-mt-20 section-reveal" aria-label="Experience section"><ExperienceSection content={content} /></div>
          <div id="credibility" className="scroll-mt-20 section-reveal" aria-label="Credibility section"><CredibilitySection content={content} /></div>
          <div id="education" className="scroll-mt-20 section-reveal" aria-label="Education section"><EducationSection content={content} /></div>
          <CustomSections content={content} />
          <div id="contact" aria-label="Contact section"><Footer content={content} /></div>
        </main>
      </div>
    </MotionConfig>
  );
}
