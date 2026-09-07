import fs from 'fs';
import path from 'path';
import { PortfolioContent, Project, Experience, Education, Certification } from '@/types/portfolio';

interface ParsedResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
  };
  summary: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

/**
 * Parse LaTeX resume file and extract structured data
 * Designed specifically for the user's resume template structure
 */
export function parseLatexResume(latexContent: string): ParsedResumeData {
  const data: ParsedResumeData = {
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: ''
    },
    summary: '',
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: []
  };

  // Remove LaTeX comments, but not an escaped `\%` (a literal percent sign).
  // Note: this doesn't handle a real comment immediately after a `\\` line
  // break (e.g. `...\\% comment`) - that residual edge case is not present
  // in the resumes this parser targets.
  const cleanContent = latexContent.replace(/(?<!\\)%.*$/gm, '');

  // Extract Header Information
  parseHeader(cleanContent, data.personalInfo);

  // Extract Summary
  parseSummary(cleanContent, data);

  // Extract Skills
  parseSkills(cleanContent, data);

  // Extract Experience
  parseExperience(cleanContent, data);

  // Extract Projects
  parseProjects(cleanContent, data);

  // Extract Education
  parseEducation(cleanContent, data);

  // Extract Certifications
  parseCertifications(cleanContent, data);

  return data;
}

/**
 * Parse header section for personal information
 */
function parseHeader(content: string, personalInfo: ParsedResumeData['personalInfo']) {
  // Extract header section
  const headerSection = content.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  if (!headerSection) return;

  const headerContent = headerSection[1];
  const headerLines = headerContent.split('\\\\');

  // Extract name from first line (inside \textbf{})
  const nameMatch = headerLines[0].match(/\\textbf\{([^}]+)\}/);
  if (nameMatch) {
    personalInfo.name = cleanLatexText(nameMatch[1]);
  }

  // Extract title from second line (clean LaTeX commands)
  if (headerLines[1]) {
    personalInfo.title = cleanLatexText(headerLines[1]);
  }

  // Extract contact info from third line (after \vspace)
  if (headerLines[2]) {
    const contactLine = headerLines[2];
    
    // Remove \vspace commands first
    const cleanContactLine = contactLine.replace(/\\vspace\{[^}]+\}/g, '').trim();
    
    // Extract location (look for text before first \textbar{})
    const locationMatch = cleanContactLine.match(/^([A-Za-z\s]+,\s*[A-Za-z\s]+)/);
    if (locationMatch) {
      personalInfo.location = cleanLatexText(locationMatch[1]);
    }

    // Extract phone
    const phoneMatch = cleanContactLine.match(/(\d[\d\s]+)/);
    if (phoneMatch) {
      personalInfo.phone = cleanLatexText(phoneMatch[1].trim());
    }

    // Extract email from href
    const emailMatch = cleanContactLine.match(/\\href\{mailto:([^}]+)\}/);
    if (emailMatch) {
      personalInfo.email = emailMatch[1];
    }

    // Extract github from href
    const githubMatch = cleanContactLine.match(/\\href\{https:\/\/github\.com\/([^}]+)\}/);
    if (githubMatch) {
      personalInfo.github = `https://github.com/${githubMatch[1]}`;
    }

    // Extract linkedin from href
    const linkedinMatch = cleanContactLine.match(/\\href\{https:\/\/www\.linkedin\.com\/in\/([^}]+)\}/);
    if (linkedinMatch) {
      personalInfo.linkedin = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
    }
  }
}

/**
 * Parse summary section
 */
function parseSummary(content: string, data: ParsedResumeData) {
  const summaryMatch = content.match(/\\section\{Summary\}\s*\\small\{\s*([\s\S]*?)\s*\}/);
  if (summaryMatch) {
    data.summary = cleanLatexText(summaryMatch[1]);
  }
}

/**
 * Parse technical skills section
 */
function parseSkills(content: string, data: ParsedResumeData) {
  const skillsSection = content.match(/\\section\{Technical Skills\}([\s\S]*?)(?:\\section|\\end\{document\}|$)/);
  if (!skillsSection) return;

  const skillsContent = skillsSection[1];

  // Extract all skill categories
  const categoryPattern = /\\textbf\{([^:]+):\}\s*([^\n]+)/g;
  let match;
  const allSkills: string[] = [];

  while ((match = categoryPattern.exec(skillsContent)) !== null) {
    const category = match[1];
    const skillsText = match[2];
    
    // Split by comma and clean each skill
    const skills = skillsText.split(',').map(skill => cleanLatexText(skill.trim())).filter(skill => skill);
    allSkills.push(...skills);
  }

  data.skills = [...new Set(allSkills)]; // Remove duplicates
}

/**
 * Parse experience section
 */
function parseExperience(content: string, data: ParsedResumeData) {
  const experienceSection = content.match(/\\section\{Experience\}([\s\S]*?)(?:\\section|\\end\{document\}|$)/);
  if (!experienceSection) return;

  const experienceContent = experienceSection[1];

  // Split by company entries (textbf company name + hfill + location + newline + position + hfill + dates)
  const lines = experienceContent.split('\n');
  let currentCompany: any = null;
  let currentPosition: any = null;
  let currentDuration: any = null;
  let currentBullets: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a company line (textbf with hfill)
    const companyMatch = line.match(/\\textbf\{([^}]+)\}\s*\\hfill\s*([^\n]+)/);
    if (companyMatch) {
      // Save previous company if exists
      if (currentCompany) {
        data.experience.push({
          company: currentCompany,
          position: currentPosition,
          duration: currentDuration,
          description: currentBullets.length > 0 ? currentBullets.join('. ') : ''
        });
      }
      
      currentCompany = cleanLatexText(companyMatch[1]);
      currentPosition = null;
      currentDuration = null;
      currentBullets = [];
      continue;
    }

    // Skip href lines (company website)
    if (line.match(/\\href\{https?:\/\/[^}]+\}/)) {
      continue;
    }

    // Check if this is a position line (after company)
    if (currentCompany && !currentPosition && line.includes('\\hfill')) {
      const positionMatch = line.match(/([^\n]+)\s*\\hfill\s*([^\n]+)/);
      if (positionMatch) {
        currentPosition = cleanLatexText(positionMatch[1]);
        currentDuration = cleanLatexText(positionMatch[2]);
      }
      continue;
    }

    // Check if this is a bullet point (greedy match through any nested
    // braces, e.g. \textbf{...} inside the bullet, up to the last `}`
    // on the line - the bullet is always the sole brace-construct there)
    const bulletMatch = line.match(/\\resumeItem\{(.+)\}/);
    if (bulletMatch && currentCompany) {
      currentBullets.push(cleanLatexText(bulletMatch[1]));
    }
  }

  // Save the last company
  if (currentCompany) {
    data.experience.push({
      company: currentCompany,
      position: currentPosition,
      duration: currentDuration,
      description: currentBullets.length > 0 ? currentBullets.join('. ') : ''
    });
  }
}

/**
 * Parse projects section
 */
function parseProjects(content: string, data: ParsedResumeData) {
  const projectsSection = content.match(/\\section\{Projects\}([\s\S]*?)(?:\\section|\\end\{document\}|$)/);
  if (!projectsSection) return;

  const projectsContent = projectsSection[1];

  // Split by project entries (textbf title on one line, textit tech on next)
  const lines = projectsContent.split('\n');
  let currentProject: any = null;
  let currentTech: any = null;
  let currentBullets: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a project title line (textbf title)
    const titleMatch = line.match(/\\textbf\{([^}]+)\}/);
    if (titleMatch && !line.includes('\\textit')) {
      // Save previous project if exists
      if (currentProject) {
        data.projects.push({
          title: currentProject,
          description: currentBullets[0] || '',
          tech: currentTech,
          link: '',
          github: '',
          impact: currentBullets.slice(1)
        });
      }
      
      currentProject = cleanLatexText(titleMatch[1]);
      currentTech = null;
      currentBullets = [];
      continue;
    }

    // Check if this is a tech line (textit tech) - comes after title
    if (currentProject && !currentTech) {
      const techMatch = line.match(/\\textit\{([^}]+)\}/);
      if (techMatch) {
        currentTech = cleanLatexText(techMatch[1]);
        continue;
      }
    }

    // Check if this is a bullet point (see parseExperience for why this
    // is greedy rather than [^}]+)
    const bulletMatch = line.match(/\\resumeItem\{(.+)\}/);
    if (bulletMatch && currentProject) {
      currentBullets.push(cleanLatexText(bulletMatch[1]));
    }
  }

  // Save the last project
  if (currentProject) {
    data.projects.push({
      title: currentProject,
      description: currentBullets[0] || '',
      tech: currentTech,
      link: '',
      github: '',
      impact: currentBullets.slice(1)
    });
  }
}

/**
 * Parse education section
 */
function parseEducation(content: string, data: ParsedResumeData) {
  const educationSection = content.match(/\\section\{Education\}([\s\S]*?)(?:\\section|\\end\{document\}|$)/);
  if (!educationSection) return;

  const educationContent = educationSection[1];

  // Pattern to match education entries
  const educationPattern = /\\textbf\{([^}]+)\}\s*—\s*([^\n]+)\s*\\hfill\s*([^\n]+)/g;
  let match;

  while ((match = educationPattern.exec(educationContent)) !== null) {
    const degree = cleanLatexText(match[1]);
    const institution = cleanLatexText(match[2]);
    const year = cleanLatexText(match[3]);

    // Extract GPA if present
    const gpaMatch = educationContent.substring(match.index, match.index + 200).match(/GPA:\s*([\d.]+)/);
    const gpa = gpaMatch ? gpaMatch[1] : undefined;

    data.education.push({
      institution,
      degree,
      year,
      gpa
    });
  }
}

/**
 * Parse certifications section
 */
function parseCertifications(content: string, data: ParsedResumeData) {
  const certificationsSection = content.match(/\\section\{Certifications\}([\s\S]*?)(?:\\section|\\end\{document\}|$)/);
  if (!certificationsSection) return;

  const certificationsContent = certificationsSection[1];

  // Pattern to match certification entries (greedy - see parseExperience)
  const certPattern = /\\resumeItem\{(.+)\}/g;
  let match;

  while ((match = certPattern.exec(certificationsContent)) !== null) {
    const certText = cleanLatexText(match[1]);

    // Try to extract name, issuer, year
    const parts = certText.split('—');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const issuer = parts[1].trim();
      const year = parts[2] ? parts[2].trim() : '';

      data.certifications.push({
        name,
        issuer,
        year
      });
    } else {
      // Fallback: use entire text as name
      data.certifications.push({
        name: certText,
        issuer: '',
        year: ''
      });
    }
  }
}

/**
 * Clean LaTeX special characters and formatting
 */
function cleanLatexText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\textbar\{/g, '|')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_')
    .replace(/\\\$/g, '$')
    .replace(/\\textbf\{([^}]+)\}/g, '$1')
    .replace(/\\textit\{([^}]+)\}/g, '$1')
    .replace(/\\href\{[^}]+\}\{([^}]+)\}/g, '$1')
    .replace(/\\hfill/g, '')
    .replace(/\\\\/g, '')
    .replace(/\\vspace\{[^}]+\}/g, '')
    .replace(/\\small\{/g, '')
    .replace(/\\small/g, '')
    .replace(/\}/g, '')
    .replace(/\{/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert parsed resume data to portfolio content format
 */
export function convertToPortfolioContent(parsedData: ParsedResumeData): Partial<PortfolioContent> {
  return {
    name: parsedData.personalInfo.name,
    title: parsedData.personalInfo.title,
    subtitle: '', // Will use existing or generate from title
    description: parsedData.summary,
    email: parsedData.personalInfo.email,
    phone: parsedData.personalInfo.phone,
    location: parsedData.personalInfo.location,
    github: parsedData.personalInfo.github,
    linkedin: parsedData.personalInfo.linkedin,
    skills: parsedData.skills,
    experience: parsedData.experience,
    projects: parsedData.projects,
    education: parsedData.education,
    certifications: parsedData.certifications
  };
}