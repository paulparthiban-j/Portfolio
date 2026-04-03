"use client";

import { useEffect, useState } from "react";
import { PortfolioContent } from "@/types/portfolio";
import { ParticleBackground } from "@/components/sections/ParticleBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CredibilitySection } from "@/components/sections/CredibilitySection";
import { CustomSections } from "@/components/sections/CustomSections";
import { Footer } from "@/components/sections/Footer";

const fallbackContent: PortfolioContent = {
  name: "Paul Parthiban J",
  title: "AI-Powered Web Architect",
  subtitle: "I build scalable AI-powered web apps that solve real business problems.",
  description: "Associate Software Developer specializing in building high-performance supply chain ecosystems and AI-integrated web applications.",
  email: "paulparthiban85085@gmail.com",
  phone: "6374178098",
  location: "Tirunelveli, India",
  github: "https://github.com/parthi25",
  linkedin: "https://linkedin.com/in/paul-parthiban-j",
  twitter: "",
  website: "",
  boldStatement: "I don’t just build apps. I build things that people actually use.",
  currentWork: "Architecting an AI-driven predictive maintenance module.",
  skills: ["Node.js", "Express.js", "Java", "JavaScript", "Sequelize", "MySQL", "React.js", "Spring Boot", "Python", "AWS EC2", "Linux"],
  projects: [
    {
      title: "P2P - Supply Chain Ecosystem",
      description: "Enterprise-grade supply chain platform handling procurement, logistics, and warehouse operations for 100+ active industrial users.",
      tech: "Node.js, Express, Sequelize, MySQL, SAP API",
      link: "",
      github: "",
      problem: "Legacy procurement processes were fragmented and slow.",
      solution: "Architected a unified P2P platform with real-time SAP integration.",
      impact: ["Reduced processing time by 40%", "Handled 10k+ transactions per month"],
      architecture: "Microservices-based architecture using Express.js and Sequelize."
    }
  ],
  experience: [
    {
      company: "Jeyachandran Industries",
      position: "Associate Software Developer",
      duration: "2025 - Present",
      description: "Leading backend modernization effort and SAP integration.",
    }
  ],
  education: [
    {
      institution: "St. Johns College",
      degree: "MS Computer Science",
      year: "2024",
    },
  ],
  theme: {
    primaryColor: "indigo",
    primaryGradient: "from-indigo-600 to-violet-600",
    accent: "indigo-500",
    bg: "from-[#0f172a] via-[#1e1b4b] to-black",
    mode: "dark",
    autoTheme: true,
  },
  stats: [
    { number: 10, label: "Projects Completed" },
    { number: 1.5, label: "Years Experience" },
  ],
  customSections: [],
  testimonials: [
    { name: "Senior Architect", role: "Jeyachandran Industries", text: "Paul transformed our fragmented logistics module." }
  ],
  certifications: [
    { name: "Full Stack Web Development", issuer: "Meta", year: "2024" }
  ]
};

export default function Home() {
  const [content, setContent] = useState<PortfolioContent>(fallbackContent);
  const [mounted, setMounted] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const portfolioData = await res.json();
          if (portfolioData.theme?.autoTheme) {
            const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            portfolioData.theme.mode = isDarkMode ? "dark" : "light";
          }
          setContent(portfolioData);
          setContentLoaded(true);
        }
      } catch {
        setContentLoaded(true);
        // use fallback silently
      }
    };

    fetchPortfolio();
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0b] flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-500 tracking-widest uppercase font-bold">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${content.theme?.mode === "light" ? "bg-slate-50 text-slate-900" : "bg-[#0a0a0b] text-white"} transition-opacity duration-1000 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <ParticleBackground theme={content.theme} />
      <main className="relative z-10">
        <HeroSection content={content} />
        <AboutSection content={content} />
        <SkillsSection content={content} />
        <ProjectsSection content={content} />
        <ExperienceSection content={content} />
        <CredibilitySection content={content} />
        <EducationSection content={content} />
        <CustomSections content={content} />
        <Footer content={content} />
      </main>
    </div>
  );
}
