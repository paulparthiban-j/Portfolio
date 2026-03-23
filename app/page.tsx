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
import { CustomSections } from "@/components/sections/CustomSections";
import { Footer } from "@/components/sections/Footer";

const fallbackContent: PortfolioContent = {
  name: "Paul Parthiban J",
  title: "Backend / Full-Stack Developer",
  subtitle: "Building robust and scalable digital solutions",
  description:
    "Associate Software Developer with expertise in Node.js, Express.js, and Sequelize. Experienced in building supply chain management systems and integrating SAP APIs. Passionate about backend excellence and full-stack innovation.",
  email: "paulparthiban85085@gmail.com",
  phone: "6374178098",
  location: "Tirunelveli, India",
  github: "https://github.com/parthi25",
  linkedin: "https://linkedin.com/in/paul-parthiban-j",
  twitter: "",
  website: "",
  skills: ["Node.js", "Express.js", "Java", "JavaScript", "Sequelize", "MySQL", "React.js", "Spring Boot", "Python", "AWS EC2", "Linux"],
  projects: [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with payment integration",
      tech: "Next.js, Stripe, MongoDB",
      link: "https://example.com",
      github: "https://github.com/johndoe/ecommerce",
    },
    {
      title: "Task Management App",
      description: "Collaborative task management with real-time updates",
      tech: "React, Firebase, Tailwind",
      link: "https://example.com",
      github: "https://github.com/johndoe/tasks",
    },
    {
      title: "Weather Dashboard",
      description: "Beautiful weather dashboard with location-based forecasts",
      tech: "Vue.js, OpenWeather API",
      link: "https://example.com",
      github: "https://github.com/johndoe/weather",
    },
  ],
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Developer",
      duration: "2022 - Present",
      description: "Leading development of scalable web applications",
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: "Built and maintained multiple client projects",
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "BS Computer Science",
      year: "2020",
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
  customSections: [],
};

export default function Home() {
  const [content, setContent] = useState<PortfolioContent>(fallbackContent);
  const [mounted, setMounted] = useState(false);

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
        }
      } catch {
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
    <div className={`min-h-screen relative ${content.theme?.mode === "light" ? "bg-slate-50 text-slate-900" : "bg-[#0a0a0b] text-white"}`}>
      <ParticleBackground theme={content.theme} />
      <main className="relative z-10">
        <HeroSection content={content} />
        <AboutSection content={content} />
        <SkillsSection content={content} />
        <ProjectsSection content={content} />
        <ExperienceSection content={content} />
        <EducationSection content={content} />
        <CustomSections content={content} />
        <Footer content={content} />
      </main>
    </div>
  );
}
