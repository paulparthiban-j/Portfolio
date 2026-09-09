import fs from 'fs';
import path from 'path';
import { PortfolioContent } from '@/types/portfolio';

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

/**
 * Computes years of experience from a start date to now, so the stat
 * stays accurate without needing a manual update every few months.
 */
function computeYearsOfExperience(startDate: string): number {
    const start = new Date(startDate);
    const years = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, Math.round(years * 10) / 10);
}

/**
 * Fetches portfolio data from the local JSON file.
 * This file is the single source of truth.
 */
export async function getPortfolioData(): Promise<PortfolioContent> {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            throw new Error(`Data file not found at ${DATA_FILE}`);
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const parsed: PortfolioContent = JSON.parse(data);

        if (parsed.experienceStartDate && parsed.stats) {
            const years = computeYearsOfExperience(parsed.experienceStartDate);
            parsed.stats = parsed.stats.map((stat) =>
                stat.label === "Years Experience" ? { ...stat, number: years } : stat
            );
        }

        return parsed;
    } catch (error) {
        console.error('Error fetching portfolio data from file:', error);
        // Minimal fallback structure
        return {
            name: "Paul Parthiban J",
            title: "Backend Developer",
            subtitle: "Building digital solutions",
            description: "Portfolio data unavailable",
            email: "",
            phone: "",
            location: "",
            github: "",
            linkedin: "",
            twitter: "",
            website: "",
            skills: [],
            stats: [],
            projects: [],
            experience: [],
            education: [],
            theme: {
                primaryColor: "indigo",
                primaryGradient: "from-indigo-600 to-violet-600",
                accent: "indigo-500",
                bg: "from-[#0f172a] via-[#1e1b4b] to-black",
                mode: "dark"
            },
            customSections: []
        };
    }
}

/**
 * Saves portfolio data to the local JSON file.
 */
export async function savePortfolioData(content: PortfolioContent): Promise<boolean> {
    try {
        const directory = path.dirname(DATA_FILE);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error saving portfolio data to file:', error);
        return false;
    }
}
