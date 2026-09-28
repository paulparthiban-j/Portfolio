"use client";

import { lazy, Suspense } from "react";
import { PortfolioContent } from "@/types/portfolio";
import { ParticleBackground } from "@/components/sections/ParticleBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { SectionLoader } from "@/components/ui/SectionLoader";
import { IntroCurtain } from "@/components/ui/IntroCurtain";

// Lazy load heavy sections using dynamic imports
const AboutSection = lazy(() => import("@/components/sections/AboutSection").then(mod => ({ default: mod.AboutSection })));
const SkillsSection = lazy(() => import("@/components/sections/SkillsSection").then(mod => ({ default: mod.SkillsSection })));
const ProjectsSection = lazy(() => import("@/components/sections/ProjectsSection").then(mod => ({ default: mod.ProjectsSection })));
const ExperienceSection = lazy(() => import("@/components/sections/ExperienceSection").then(mod => ({ default: mod.ExperienceSection })));
const EducationSection = lazy(() => import("@/components/sections/EducationSection").then(mod => ({ default: mod.EducationSection })));
const CredibilitySection = lazy(() => import("@/components/sections/CredibilitySection").then(mod => ({ default: mod.CredibilitySection })));
const CustomSections = lazy(() => import("@/components/sections/CustomSections").then(mod => ({ default: mod.CustomSections })));
const Footer = lazy(() => import("@/components/sections/Footer").then(mod => ({ default: mod.Footer })));

// Content is resolved on the server (app/page.tsx) so the very first HTML
// already contains the real hero - no spinner, no blank fade-in waiting on a
// client-side fetch.
export function HomePage({ content }: { content: PortfolioContent }) {
  return (
    <div className={`min-h-screen relative ${content.theme?.mode === "light" ? "bg-slate-50 text-slate-900" : "bg-[#0A0A0B] text-white"}`}>
      <IntroCurtain name={content.name} />
      <ParticleBackground theme={content.theme} />
      <Navbar content={content} />
      <main className="relative z-10" role="main">
        <div id="hero" aria-label="Hero section"><HeroSection content={content} /></div>
        <Suspense fallback={<SectionLoader />}>
          <div id="about" className="scroll-mt-20 section-reveal" aria-label="About section"><AboutSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="skills" className="scroll-mt-20 section-reveal" aria-label="Skills section"><SkillsSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="projects" className="scroll-mt-20" aria-label="Projects section"><ProjectsSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="experience" className="scroll-mt-20 section-reveal" aria-label="Experience section"><ExperienceSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="credibility" className="scroll-mt-20 section-reveal" aria-label="Credibility section"><CredibilitySection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="education" className="scroll-mt-20 section-reveal" aria-label="Education section"><EducationSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CustomSections content={content} />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="contact" aria-label="Contact section"><Footer content={content} /></div>
        </Suspense>
      </main>
    </div>
  );
}
