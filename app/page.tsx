"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { PortfolioContent } from "@/types/portfolio";
import { ParticleBackground } from "@/components/sections/ParticleBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { Navbar } from "@/components/ui/Navbar";
import { SectionLoader } from "@/components/ui/SectionLoader";

// Lazy load heavy sections using dynamic imports
const AboutSection = lazy(() => import("@/components/sections/AboutSection").then(mod => ({ default: mod.AboutSection })));
const SkillsSection = lazy(() => import("@/components/sections/SkillsSection").then(mod => ({ default: mod.SkillsSection })));
const ProjectsSection = lazy(() => import("@/components/sections/ProjectsSection").then(mod => ({ default: mod.ProjectsSection })));
const ExperienceSection = lazy(() => import("@/components/sections/ExperienceSection").then(mod => ({ default: mod.ExperienceSection })));
const EducationSection = lazy(() => import("@/components/sections/EducationSection").then(mod => ({ default: mod.EducationSection })));
const CredibilitySection = lazy(() => import("@/components/sections/CredibilitySection").then(mod => ({ default: mod.CredibilitySection })));
const CustomSections = lazy(() => import("@/components/sections/CustomSections").then(mod => ({ default: mod.CustomSections })));
const Footer = lazy(() => import("@/components/sections/Footer").then(mod => ({ default: mod.Footer })));

const fallbackContent: PortfolioContent = {
  name: "Paul Parthiban J",
  title: "Senior Software Engineer | AI-Native Development",
  subtitle: "I build end-to-end enterprise applications using AI-assisted workflows, with a focus on API design, real-time systems, and production-grade architecture.",
  description: "Senior Software Engineer with experience building end-to-end enterprise applications using React, Node.js, .NET, and SQL databases. AI-native developer who uses Claude for code generation, debugging, refactoring, and test creation to accelerate delivery.",
  email: "paulparthiban.j@gmail.com",
  phone: "+91-6374178098",
  location: "Tirunelveli, India",
  github: "https://github.com/paulparthiban-j",
  linkedin: "https://linkedin.com/in/paul-parthiban-j",
  twitter: "",
  website: "",
  boldStatement: "I don't just write code; I architect systems that solve real business bottlenecks.",
  currentWork: "Building enterprise access management platform with React 19 & .NET 10.",
  skills: ["JavaScript (ES6+)", "TypeScript", "C#", "Java", "Python", "PHP", "React 19", "Tailwind CSS", "Zustand", "React Query", "React Hook Form", "ECharts", "Node.js", "Express.js", ".NET 10 Web API", "Spring Boot", "RESTful APIs", "SQL Server", "MySQL", "Entity Framework Core", "Dapper", "Sequelize ORM", "JWT", "OAuth 2.0", "RBAC", "Git", "Linux (Ubuntu)", "SignalR", "SAP API Integration"],
  projects: [
    {
      title: "AdminCore - Enterprise Access Management",
      description: "Full-stack RBAC platform: React 19 + TypeScript SPA with .NET 10 Web API backend following clean architecture patterns.",
      tech: "React 19, TypeScript, .NET 10, SQL Server, SignalR, Zustand, ECharts",
      link: "",
      github: "",
      problem: "Enterprise teams lacked granular access control with no real-time visibility.",
      solution: "Built a full-stack RBAC platform with JWT + GitHub OAuth SSO, device fingerprinting, CAPTCHA, and real-time SignalR dashboard.",
      impact: ["Granular permission engine managing 50+ rules with SQL Server stored procedures", "SignalR WebSocket for real-time session monitoring", "Zustand + React Query for optimistic updates and cache invalidation", "Dual ORM: EF Core + Dapper"],
      architecture: "Layered .NET 10 Web API (Controllers, Services, Repository, Utility) with React 19 SPA using Zustand + React Query."
    },
    {
      title: "P2P - Supply Chain Management System",
      description: "Architected end-to-end supply chain platform with procurement, logistics, and warehouse modules serving 100+ users.",
      tech: "Node.js, Express, Sequelize, MySQL, Tailwind CSS",
      link: "",
      github: "",
      problem: "Manual supply chain processes were slow and error-prone.",
      solution: "Built a unified P2P platform with automated workflows for purchase orders, GRN validation, and real-time warehouse monitoring.",
      impact: ["Purchase order workflows and invoice automation reducing processing time by 40%", "Real-time warehouse operations improving inventory accuracy by 25%", "Handled 1K+ daily transactions with optimized Sequelize ORM operations"],
      architecture: "Modular backend using Express.js and Sequelize ORM, with responsive Tailwind CSS frontend."
    }
  ],
  experience: [
    {
      company: "Jeyachandran Industries Pvt. Ltd",
      position: "Associate Software Developer",
      duration: "2025 - Present",
      description: "Developed full-stack enterprise applications using Node.js, Express.js, and React.js, serving 100+ users. Built end-to-end P2P module handling 1K+ daily transactions. Delivered ECharts analytics dashboards.",
    },
    {
      company: "Ramachandran Retail Pvt. Ltd",
      position: "IT Support Engineer",
      duration: "2024 - 2025",
      description: "Technical support for Microsoft Dynamics AX ERP systems across multiple retail locations.",
    }
  ],
  education: [
    {
      institution: "St. Johns College, Palayamkottai",
      degree: "M.Sc. Computer Science",
      year: "2024",
    },
    {
      institution: "Manonmaniam Sundaranar University College",
      degree: "B.Sc. Computer Science",
      year: "2022",
    },
  ],
  theme: {
    primaryColor: "slate",
    primaryGradient: "from-slate-700 via-slate-600 to-green-600",
    accent: "green-400",
    bg: "from-[#0F172A] via-[#1E293B] to-[#0F172A]",
    mode: "dark",
    autoTheme: false,
  },
  stats: [
    { number: 1.5, label: "Years Experience", suffix: "+" },
    { number: 4, label: "Major Projects", suffix: "" },
    { number: 20, label: "Technologies", suffix: "+" },
    { number: 40, label: "Efficiency Boost", suffix: "%" },
  ],
  customSections: [],
  testimonials: [
    { name: "Associate Software Developer", role: "Jeyachandran Industries", text: "Paul’s work on our P2P system significantly streamlined our supply chain." }
  ],
  certifications: [
    { name: "Full-Stack Development Internship", issuer: "AK Infopark", year: "2024" }
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
      <div className="fixed inset-0 bg-[#0F172A] flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-500 tracking-widest uppercase font-bold">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${content.theme?.mode === "light" ? "bg-slate-50 text-slate-900" : "bg-[#0F172A] text-white"} transition-opacity duration-1000 ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <ParticleBackground theme={content.theme} />
      <Navbar content={content} />
      <main className="relative z-10" role="main">
        <div id="hero" aria-label="Hero section"><HeroSection content={content} /></div>
        <Suspense fallback={<SectionLoader />}>
          <div id="about" className="scroll-mt-20" aria-label="About section"><AboutSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="skills" className="scroll-mt-20" aria-label="Skills section"><SkillsSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="projects" className="scroll-mt-20" aria-label="Projects section"><ProjectsSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="experience" className="scroll-mt-20" aria-label="Experience section"><ExperienceSection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="credibility" className="scroll-mt-20" aria-label="Credibility section"><CredibilitySection content={content} /></div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="education" className="scroll-mt-20" aria-label="Education section"><EducationSection content={content} /></div>
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
