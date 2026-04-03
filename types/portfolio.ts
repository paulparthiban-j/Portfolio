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
  problem?: string;
  solution?: string;
  impact?: string[];
  challenges?: string;
  architecture?: string;
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
  gpa?: string;
}

export interface Stat {
  number: number;
  label: string;
  suffix?: string;
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

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  link?: string;
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
  stats: Stat[];
  theme: Theme;
  projectsTitle?: string;
  skillsTitle?: string;
  experienceTitle?: string;
  educationTitle?: string;
  aboutTitle?: string;
  customSections: CustomSection[];
  resumeUrl?: string;
  githubActivity?: string; 
  testimonials?: Testimonial[];
  certifications?: Certification[];
  currentWork?: string;
  boldStatement?: string;
}
