export interface Skill {
  name: string;
  icon?: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string;
  link: string;
  github: string;
  icon?: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface CustomSection {
  title: string;
  content: string;
}

export interface Theme {
  primaryColor: string;
  primaryGradient: string;
  accent: string;
  bg: string;
  mode: 'light' | 'dark';
  autoTheme?: boolean;
  animationStyle?: 'side' | 'git-push' | 'fade' | 'scale';
}

export interface PortfolioContent {
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
  experience: Experience[];
  education: Education[];
  theme: Theme;
  projectsTitle?: string;
  skillsTitle?: string;
  experienceTitle?: string;
  educationTitle?: string;
  aboutTitle?: string;
  customSections: CustomSection[];
  resumeUrl?: string;
}
