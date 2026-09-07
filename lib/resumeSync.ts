import fs from 'fs';
import path from 'path';
import { PortfolioContent } from '@/types/portfolio';

/**
 * Create a timestamped backup of the current portfolio data on disk.
 * Returns the path the backup was written to.
 */
export function createBackup(data: PortfolioContent): string {
    const dataDir = path.join(process.cwd(), 'data');
    const timestamp = Date.now();
    const backupPath = path.join(dataDir, `portfolio.backup.${timestamp}.json`);

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');

    return backupPath;
}

/**
 * Merge resume-parsed data into the existing portfolio data.
 * Fields sourced from the resume overwrite only when present/truthy;
 * theme, stats, testimonials, customSections and other admin-curated
 * fields are always preserved from the current data, since the resume
 * has no representation of them.
 */
export function mergePortfolioData(current: PortfolioContent, newData: Partial<PortfolioContent>): PortfolioContent {
    return {
        ...current,
        ...(newData.name && { name: newData.name }),
        ...(newData.title && { title: newData.title }),
        ...(newData.subtitle && { subtitle: newData.subtitle }),
        ...(newData.description && { description: newData.description }),
        ...(newData.email && { email: newData.email }),
        ...(newData.phone && { phone: newData.phone }),
        ...(newData.location && { location: newData.location }),
        ...(newData.github && { github: newData.github }),
        ...(newData.linkedin && { linkedin: newData.linkedin }),
        ...(newData.twitter !== undefined && { twitter: newData.twitter }),
        ...(newData.website !== undefined && { website: newData.website }),
        ...(newData.skills && { skills: newData.skills }),
        ...(newData.projects && { projects: newData.projects }),
        ...(newData.experience && { experience: newData.experience }),
        ...(newData.education && { education: newData.education }),
        ...(newData.certifications && { certifications: newData.certifications }),
        // Preserve existing fields that aren't in the resume
        ...(current.theme && { theme: current.theme }),
        ...(current.stats && { stats: current.stats }),
        ...(current.testimonials && { testimonials: current.testimonials }),
        ...(current.customSections && { customSections: current.customSections }),
        ...(current.boldStatement && { boldStatement: current.boldStatement }),
        ...(current.currentWork && { currentWork: current.currentWork }),
        ...(current.resumeUrl && { resumeUrl: current.resumeUrl }),
        ...(current.projectsTitle && { projectsTitle: current.projectsTitle }),
        ...(current.skillsTitle && { skillsTitle: current.skillsTitle }),
        ...(current.experienceTitle && { experienceTitle: current.experienceTitle }),
        ...(current.educationTitle && { educationTitle: current.educationTitle }),
        ...(current.aboutTitle && { aboutTitle: current.aboutTitle }),
    };
}
