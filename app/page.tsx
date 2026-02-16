"use client";

import { useEffect, useState } from "react";
import { useScrollAnimation, useStaggeredAnimation, useSectionAnimation } from "./hooks/useScrollAnimation";

interface Skill {
  name: string;
  icon?: string;
}

interface Project {
  title: string;
  description: string;
  tech: string;
  link: string;
  github: string;
  icon?: string;
}

interface PortfolioContent {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  skills: (string | Skill)[];
  projects: Project[];
  experience: any[];
  education: any[];
  theme: any;
  customSections: any[];
}

// Fallback content
const fallbackContent: PortfolioContent = {
  name: "John Doe",
  title: "Full Stack Developer",
  subtitle: "Building amazing digital experiences",
  description:
    "I'm a passionate developer who loves creating beautiful and functional web applications. With expertise in modern web technologies, I bring ideas to life.",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  twitter: "https://twitter.com/johndoe",
  website: "https://johndoe.dev",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "Tailwind CSS"],
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

function parseEnvArray(envValue: string | undefined, fallback: any[]) {
  if (!envValue) return fallback;
  try {
    return JSON.parse(envValue);
  } catch {
    return fallback;
  }
}

function parseEnvString(envValue: string | undefined, fallback: string) {
  return envValue || fallback;
}

function parseEnvSkills(envValue: string | undefined, fallback: string[]) {
  if (!envValue) return fallback;
  return envValue.split(",").map((s) => s.trim());
}

function ScrollSection({
  children,
  className = "",
  animationType = "slide-up",
}: {
  children: React.ReactNode;
  className?: string;
  animationType?: "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale-in" | "fade-in" | "rotate-in";
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`scroll-${animationType} ${isVisible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function AnimatedSection({
  children,
  className = "",
  isFirst = false,
  sectionIndex = 0,
}: {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
  sectionIndex?: number;
}) {
  const { ref, isVisible, isExiting, isPrev, isNext } = useSectionAnimation(isFirst, sectionIndex);
  return (
    <section
      ref={ref}
      className={`full-page-section ${isVisible ? "section-visible" : ""} ${isExiting ? "section-exit" : ""} ${isPrev ? "section-prev" : ""} ${isNext ? "section-next" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

function TechIcon({ name, icon, className, theme }: { name: string; icon?: string; className?: string; theme?: any }) {
  const [error, setError] = useState(false);

  // If user provided a specific icon URL, use it
  if (icon && (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:'))) {
    return (
      <div className={`${className} overflow-hidden shadow-lg`}>
        <img src={icon} alt={name} className="w-full h-full object-contain" />
      </div>
    );
  }

  // Otherwise, try to get it from Simple Icons
  // Slugify the name (e.g., "Next.js" -> "nextdotjs", "Tailwind CSS" -> "tailwindcss")
  const slug = (icon || name)
    .toLowerCase()
    .replace(/\.js/g, 'dotjs')
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '')
    .replace(/[^\w]/g, '');

  const iconUrl = `https://cdn.simpleicons.org/${slug}/${theme?.mode === 'light' ? '333' : 'fff'}`;

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br ${theme?.primaryGradient || 'from-indigo-500 to-purple-600'} text-white flex items-center justify-center text-3xl font-bold shadow-lg`}>
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <div className={`${className} p-3 flex items-center justify-center`}>
      <img
        src={iconUrl}
        alt={name}
        className="w-full h-full object-contain transition-transform group-hover:scale-110"
        onError={() => setError(true)}
      />
    </div>
  );
}

function StaggeredItem({
  children,
  index,
  delay = 100,
}: {
  children: React.ReactNode;
  index: number;
  delay?: number;
}) {
  return (
    <div
      className="stagger-item"
      style={{ transitionDelay: `${index * delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [content, setContent] = useState<PortfolioContent>(fallbackContent);
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hideHeroContent, setHideHeroContent] = useState(false);
  // Sections count
  const customSections = content.customSections || [];
  const totalSections = 7 + customSections.length;
  const footerIndex = totalSections - 1;

  useEffect(() => {
    setMounted(true);

    // Fetch portfolio data from API
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const portfolioData = await res.json();

          // Auto theme detection
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

    // Hide welcome screen after animation
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    // Hide hero content on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 50) {
        setHideHeroContent(true);
      } else {
        setHideHeroContent(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      clearTimeout(welcomeTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative selection:bg-indigo-500/30 ${content.theme?.mode === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-black text-white'}`}>
      {/* Decorative Particles Background */}
      <div className="particle-bg fixed inset-0 z-0">
        {[...Array(20)].map((_, i) => {
          // Stable random values for each particle
          const left = (i * 7 + 13) % 100;
          const top = (i * 11 + 17) % 100;
          const size = ((i * 3 + 5) % 6) + 2;
          const delay = (i * 1.5) % 20;
          const duration = ((i * 2 + 10) % 10) + 15;
          return (
            <div
              key={i}
              className="particle"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                background: content.theme?.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          );
        })}
      </div>

      {/* Welcome Screen */}
      {showWelcome && (
        <div className={`welcome-screen ${!showWelcome ? "hidden" : ""} bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'}`}>
          <div className="welcome-content">
            <h1 className="welcome-title text-white">{content.name}</h1>
            <p className="welcome-subtitle text-white/90">Portfolio Experience</p>
            <div className="welcome-loader">
              <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <AnimatedSection isFirst={true} sectionIndex={0} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} relative`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className={`hero-content text-center w-full transition-all duration-1000 ${hideHeroContent ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <ScrollSection animationType="slide-down">
              <h1 className="mb-6 text-6xl font-black md:text-[7rem] leading-none tracking-tight">
                <span className={`gradient-text animate-gradient bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'}`}>I'm {content.name}</span>
              </h1>
            </ScrollSection>
            <ScrollSection animationType="slide-up">
              <p className="mb-8 text-3xl md:text-5xl font-light text-slate-300">
                {content.title}
              </p>
            </ScrollSection>
            <ScrollSection animationType="fade-in">
              <p className="mb-12 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                {content.description}
              </p>
            </ScrollSection>
            <ScrollSection animationType="scale-in">
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href={`mailto:${content.email}`}
                  className={`btn btn-lg btn-premium bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'} border-none text-white px-10 rounded-full hover:shadow-2xl transition-all`}
                >
                  Hire Me
                </a>
                <a
                  href={content.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg btn-premium glass border-white/20 text-white px-10 rounded-full hover:bg-white/10"
                >
                  GitHub
                </a>
              </div>
            </ScrollSection>
          </div>
        </div>
        <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 scroll-indicator transition-opacity duration-500 ${hideHeroContent ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-8 h-12 border-2 border-slate-500 rounded-full flex justify-center p-2">
            <div className={`w-1 h-2 bg-${content.theme?.accent || 'indigo-500'} rounded-full animate-bounce`}></div>
          </div>
        </div>
      </AnimatedSection>

      {/* About Section */}
      <AnimatedSection sectionIndex={1} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative overflow-y-auto overflow-x-hidden`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollSection animationType="slide-down">
            <h2 className="mb-20 text-center text-5xl md:text-7xl font-black">
              <span className={`gradient-text-vibrant bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'}`}>About Me</span>
            </h2>
          </ScrollSection>
          <ScrollSection animationType="scale-in">
            <div className="glass-dark rounded-[2.5rem] p-8 md:p-16 border-white/5 shadow-2xl overflow-hidden relative group">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-8">
                  <ScrollSection animationType="slide-right">
                    <div className="flex items-center gap-6 p-6 glass border-white/10 rounded-2xl hover-lift">
                      <div className={`w-12 h-12 flex items-center justify-center bg-${content.theme?.accent || 'indigo-500'}/20 rounded-xl text-${content.theme?.accent || 'indigo-400'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <span className={`${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-200'} text-lg font-medium`}>{content.email}</span>
                    </div>
                  </ScrollSection>
                  <ScrollSection animationType="slide-right">
                    <div className="flex items-center gap-6 p-6 glass border-white/10 rounded-2xl hover-lift text-blue-400">
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <span className={`${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-200'} text-lg font-medium`}>{content.phone}</span>
                    </div>
                  </ScrollSection>
                  <ScrollSection animationType="slide-right">
                    <div className="flex items-center gap-6 p-6 glass border-white/10 rounded-2xl hover-lift text-purple-400">
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-500/20 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <span className={`${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-200'} text-lg font-medium`}>{content.location}</span>
                    </div>
                  </ScrollSection>
                </div>
                <div className={`${content.theme?.mode === 'light' ? 'bg-slate-900/5' : 'bg-white/5'} rounded-3xl p-8 border border-white/10`}>
                  <h3 className={`text-3xl font-bold ${content.theme?.mode === 'light' ? 'text-slate-800' : 'text-white'} mb-6 leading-tight`}>Expertise in Modern Web Technologies</h3>
                  <div className="flex flex-wrap gap-3 items-start">
                    {content.skills.map((skill, index) => (
                      <StaggeredItem key={index} index={index}>
                        <div className={`badge glass-dark text-${content.theme?.accent || 'indigo-300'} border-${content.theme?.accent || 'indigo-500'}/30 px-5 py-6 text-base font-semibold rounded-xl badge-glow`}>
                          {typeof skill === 'string' ? skill : skill.name}
                        </div>
                      </StaggeredItem>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollSection>
        </div>
      </AnimatedSection>

      {/* Skills Showcase Section */}
      <AnimatedSection sectionIndex={2} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollSection animationType="slide-down">
            <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>The Stack</h2>
          </ScrollSection>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.skills.map((skill, index) => (
              <StaggeredItem key={index} index={index} delay={80}>
                <div className={`card card-premium glass border-white/5 hover:border-${content.theme?.accent || 'indigo-500'}/30 group`}>
                  <div className="card-body p-10 flex flex-col items-center text-center">
                    <div className="mb-6 transform group-hover:rotate-12 transition-transform">
                      <TechIcon
                        name={typeof skill === 'string' ? skill : skill.name}
                        icon={typeof skill === 'object' ? skill.icon : undefined}
                        className="w-20 h-20 rounded-2xl"
                        theme={content.theme}
                      />
                    </div>
                    <h3 className={`text-2xl font-bold ${content.theme?.mode === 'light' ? 'text-slate-800' : 'text-white'} mb-2`}>
                      {typeof skill === 'string' ? skill : skill.name}
                    </h3>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-500 to-purple-500'} w-[85%] animate-pulse`}></div>
                    </div>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection sectionIndex={3} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative overflow-y-auto`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <ScrollSection animationType="slide-down">
            <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>Innovation</h2>
          </ScrollSection>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {content.projects.map((project, index) => (
              <StaggeredItem key={index} index={index} delay={120}>
                <div className="card card-premium glass-dark border-white/10 rounded-[2rem] h-full">
                  <figure className="px-6 pt-6">
                    <div className="rounded-2xl h-48 w-full bg-slate-900/50 flex items-center justify-center relative overflow-hidden group border border-white/5">
                      {project.icon ? (
                        <img src={project.icon} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${content.theme?.primaryGradient || 'from-indigo-500/20 to-purple-600/20'} flex items-center justify-center`}>
                          <span className="text-6xl group-hover:scale-125 transition-transform duration-500">🚀</span>
                        </div>
                      )}
                    </div>
                  </figure>
                  <div className="card-body p-8">
                    <h3 className={`card-title ${content.theme?.mode === 'light' ? 'text-slate-800' : 'text-white'} text-3xl font-bold mb-4`}>{project.title}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed text-lg">{project.description}</p>
                    <div className="mb-8">
                      <div className={`badge badge-glow bg-${content.theme?.accent || 'indigo-500'}/20 text-${content.theme?.accent || 'indigo-300'} border-${content.theme?.accent || 'indigo-500'}/30 px-4 py-3 font-semibold`}>
                        {project.tech}
                      </div>
                    </div>
                    <div className="card-actions justify-end gap-4">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-premium glass border-white/10 text-white rounded-xl hover:bg-white/10"
                      >
                        Live Demo
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-premium bg-white/10 hover:bg-white/20 text-white border-none rounded-xl"
                      >
                        Source
                      </a>
                    </div>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Experience Section */}
      <AnimatedSection sectionIndex={4} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <ScrollSection animationType="slide-down">
            <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>Journey</h2>
          </ScrollSection>
          <div className="timeline timeline-vertical">
            {content.experience.map((exp, index) => (
              <StaggeredItem key={index} index={index} delay={200}>
                <div className="timeline-item mb-12">
                  <div className={`${content.theme?.mode === 'light' ? 'bg-white border-slate-200' : 'glass-dark border-white/10'} timeline-start timeline-box p-10 rounded-3xl w-full max-w-md ml-auto shadow-2xl relative`}>
                    <div className={`absolute -left-3 top-1/2 w-6 h-6 bg-${content.theme?.accent || 'indigo-500'} rounded-full blur-md`}></div>
                    <h3 className={`font-extrabold ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} text-2xl mb-1`}>{exp.position}</h3>
                    <h4 className={`text-${content.theme?.accent || 'indigo-400'} text-xl font-bold mb-3`}>{exp.company}</h4>
                    <p className={`text-sm text-${content.theme?.accent || 'indigo-300'}/60 font-mono mb-4`}>{exp.duration}</p>
                    <p className="mt-4 text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>
                  <div className="timeline-middle mx-8">
                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${content.theme?.primaryGradient || 'from-indigo-500 to-purple-600'} rotate-45 border-4 border-black flex items-center justify-center p-2`}>
                      <div className="w-full h-full bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Education Section */}
      <AnimatedSection sectionIndex={5} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollSection animationType="slide-down">
            <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>Foundation</h2>
          </ScrollSection>
          <div className="grid gap-10 md:grid-cols-2">
            {content.education.map((edu, index) => (
              <StaggeredItem key={index} index={index} delay={150}>
                <div className="card card-premium glass border-white/5 rounded-[2rem] h-full overflow-hidden">
                  <div className="card-body p-12 relative">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${content.theme?.accent || 'indigo-500'}/10 rounded-bl-[100px]`}></div>
                    <div className={`badge badge-glow bg-${content.theme?.accent || 'indigo-500'}/20 text-${content.theme?.accent || 'indigo-400'} border-none mb-6 px-4 py-2 font-mono`}>{edu.year}</div>
                    <h3 className={`card-title ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} text-4xl font-black mb-4 leading-tight`}>{edu.degree}</h3>
                    <p className={`text-${content.theme?.accent || 'indigo-300'} text-2xl font-semibold mb-2`}>{edu.institution}</p>
                    <div className="mt-8 flex gap-2">
                      <span className={`w-12 h-1 bg-${content.theme?.accent || 'indigo-500'} rounded-full`}></span>
                      <span className={`w-4 h-1 bg-${content.theme?.accent || 'indigo-500'}/30 rounded-full`}></span>
                      <span className={`w-2 h-1 bg-${content.theme?.accent || 'indigo-500'}/10 rounded-full`}></span>
                    </div>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Dynamic Custom Sections */}
      {(content.customSections || []).map((section: any, sIdx: number) => (
        <AnimatedSection key={sIdx} sectionIndex={6 + sIdx} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
          <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <ScrollSection animationType="slide-down">
              <h2 className={`mb-12 text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>{section.title}</h2>
            </ScrollSection>
            <ScrollSection animationType="slide-up">
              <div className={`p-10 ${content.theme?.mode === 'light' ? 'bg-white/80' : 'bg-white/5'} rounded-[2.5rem] border border-white/10 text-xl leading-relaxed ${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                {section.content}
              </div>
            </ScrollSection>
          </div>
        </AnimatedSection>
      ))}

      {/* Footer */}
      <AnimatedSection sectionIndex={footerIndex} className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} border-t border-white/5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg z-0"></div>
        <footer className={`footer footer-center py-20 ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} relative z-10`}>
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-black mb-8">
              <span className={`gradient-text bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'}`}>Let's Create Together</span>
            </h2>
            <div className="flex justify-center gap-10 mb-12">
              <a href={content.github} target="_blank" className="hover-lift text-slate-400 hover:text-white transition-colors duration-300 transform scale-150">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
              <a href={content.linkedin} target="_blank" className="hover-lift text-slate-400 hover:text-white transition-colors duration-300 transform scale-150">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href={content.twitter} target="_blank" className="hover-lift text-slate-400 hover:text-white transition-colors duration-300 transform scale-150">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
              </a>
            </div>
            <p className={`${content.theme?.mode === 'light' ? 'text-indigo-600' : 'text-indigo-400'} text-2xl font-bold mb-3`}>
              {content.name}
            </p>
            <p className={`${content.theme?.mode === 'light' ? 'text-slate-600' : 'text-slate-500'} font-medium`}>Building the future of digital experiences.</p>
            <p className={`mt-10 py-4 ${content.theme?.mode === 'light' ? 'bg-slate-900/5' : 'glass-dark'} rounded-full px-8 text-sm text-slate-500 tracking-widest inline-block border-white/5`}>
              &copy; {new Date().getFullYear()} &mdash; CRAFTED WITH PASSION
            </p>
          </div>
        </footer>
      </AnimatedSection>

      {/* Snap Points Container - Modern Scroll Snapping */}
      <div className="pointer-events-none z-[-1]">
        {[...Array(totalSections)].map((_, i) => (
          <div
            key={i}
            className="h-screen"
            style={{ scrollSnapAlign: "start" }}
          />
        ))}
      </div>
    </div>
  );
}
