"use client";

import { useEffect, useState } from "react";
import { PortfolioContent } from "@/types/portfolio";
import { WelcomeScreen } from "@/components/sections/WelcomeScreen";
import { ParticleBackground } from "@/components/sections/ParticleBackground";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { CustomSections } from "@/components/sections/CustomSections";
import { Footer } from "@/components/sections/Footer";

// Fallback content
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [hideHeroContent, setHideHeroContent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);

    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const portfolioData = await res.json();

          if (portfolioData.theme?.autoTheme) {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            portfolioData.theme.mode = isDarkMode ? 'dark' : 'light';
          }

          setContent(portfolioData);
        }
      } catch (err) {
        console.error("Failed to fetch portfolio data", err);
      }
    };

    fetchPortfolio();

    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setHideHeroContent(scrollY > 50);
    };

    // Intersection Observer to find the MOST visible section
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // Find the entry with the largest intersection ratio
        const mostVisible = entries.reduce((prev, current) => {
          return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
        });

        if (mostVisible.intersectionRatio > 0.5) {
          const index = parseInt(mostVisible.target.getAttribute('data-section-index') || '0');
          setActiveIndex(index);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    // Give it a small delay to ensure elements are in DOM
    setTimeout(() => {
      document.querySelectorAll('.full-page-section').forEach((el) => {
        sectionObserver.observe(el);
      });
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(welcomeTimer);
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
    };
  }, []);

  // Automatic Jump-to-Snap
  useEffect(() => {
    if (!mounted) return;

    const section = document.querySelector(`[data-section-index="${activeIndex}"]`);
    if (section) {
      // Use smooth scroll to finish the snap automatically
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeIndex, mounted]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  // Sections count
  const customSectionsCount = (content.customSections || []).length;
  const totalSections = 7 + customSectionsCount;
  const footerIndex = totalSections - 1;

  const renderSection = (Component: any, index: number, props = {}) => (
    <div data-section-index={index} className="section-wrapper full-page-section">
      <Component
        content={content}
        isActive={activeIndex === index}
        sectionIndex={index}
        {...props}
      />
    </div>
  );

  return (
    <div className={`min-h-screen relative selection:bg-indigo-500/30 hide-scrollbar animation-${content.theme?.animationStyle || 'side'} ${content.theme?.mode === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-black text-white'}`}>
      <ParticleBackground theme={content.theme} />
      <WelcomeScreen name={content.name} title={content.title} showWelcome={showWelcome} theme={content.theme} />

      <main className="relative z-10 antialiased overflow-x-hidden hide-scrollbar">
        {renderSection(HeroSection, 0, { hideHeroContent })}
        {renderSection(AboutSection, 1)}
        {renderSection(SkillsSection, 2)}
        {renderSection(ProjectsSection, 3)}
        {renderSection(ExperienceSection, 4)}
        {renderSection(EducationSection, 5)}
        <CustomSections 
          content={content} 
          isActive={activeIndex >= 6 && activeIndex < 6 + (content.customSections?.length || 0)} 
          sectionIndex={6} 
        />
        {renderSection(Footer, 6 + (content.customSections?.length || 0))}
      </main>
    </div>
  );
}
