import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";
import { headers } from 'next/headers';
import { parseLatexResume, convertToPortfolioContent } from "@/lib/latex-parser";
import { getPortfolioData } from "@/lib/portfolio";
import { PortfolioContent } from "@/types/portfolio";

interface ChangePreview {
  section: string;
  changes: {
    type: 'added' | 'removed' | 'modified' | 'unchanged';
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
}

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const identifier = getClientIdentifier(headersList as Headers);

        // Rate limiting for parsing requests
        const rateLimitResult = checkRateLimit(identifier, {
            windowMs: 60 * 60 * 1000, // 1 hour
            maxRequests: 10, // Max 10 parse requests per hour
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many parse attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '10',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
                    },
                }
            );
        }

        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_token");
        const isValid = adminToken?.value === (process.env.ADMIN_TOKEN || "super-secret-admin");

        if (!isValid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { filePath } = await request.json();

        if (!filePath) {
            return NextResponse.json({ error: "File path is required" }, { status: 400 });
        }

        // Validate file path to prevent directory traversal (trailing separator
        // ensures this can't match a sibling directory like "temp-evil")
        const normalizedPath = path.normalize(filePath);
        const tempDir = path.join(process.cwd(), "temp") + path.sep;
        if (!normalizedPath.startsWith(tempDir)) {
            return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
        }

        // Read the .tex file
        const latexContent = await readFile(normalizedPath, 'utf-8');

        // Parse the LaTeX content
        const parsedData = parseLatexResume(latexContent);
        const newPortfolioData = convertToPortfolioContent(parsedData);

        // Get current portfolio data for comparison
        const currentPortfolioData = await getPortfolioData();

        // Generate change preview
        const changePreview = generateChangePreview(currentPortfolioData, newPortfolioData);

        return NextResponse.json(
            { 
                success: true, 
                parsedData: newPortfolioData,
                changePreview: changePreview
            },
            {
                headers: {
                    'X-RateLimit-Limit': '10',
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
                },
            }
        );
    } catch (error) {
        console.error("Parse error:", error);
        return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
    }
}

/**
 * Generate change preview comparing current and new portfolio data
 */
function generateChangePreview(current: PortfolioContent, newData: Partial<PortfolioContent>): ChangePreview[] {
    const changes: ChangePreview[] = [];

    // Compare personal information
    const personalChanges = compareField('Personal Info', {
        name: { old: current.name, new: newData.name },
        title: { old: current.title, new: newData.title },
        email: { old: current.email, new: newData.email },
        phone: { old: current.phone, new: newData.phone },
        location: { old: current.location, new: newData.location },
        github: { old: current.github, new: newData.github },
        linkedin: { old: current.linkedin, new: newData.linkedin }
    });
    if (personalChanges.length > 0) {
        changes.push({ section: 'Personal Info', changes: personalChanges });
    }

    // Compare summary/description
    if (current.description !== newData.description) {
        changes.push({
            section: 'Summary',
            changes: [{
                type: 'modified',
                field: 'Description',
                oldValue: current.description,
                newValue: newData.description
            }]
        });
    }

    // Compare skills
    const skillChanges = compareArray('Skills', current.skills, newData.skills || []);
    if (skillChanges.length > 0) {
        changes.push({ section: 'Skills', changes: skillChanges });
    }

    // Compare experience
    const experienceChanges = compareArray('Experience', current.experience, newData.experience || []);
    if (experienceChanges.length > 0) {
        changes.push({ section: 'Experience', changes: experienceChanges });
    }

    // Compare projects
    const projectChanges = compareArray('Projects', current.projects, newData.projects || []);
    if (projectChanges.length > 0) {
        changes.push({ section: 'Projects', changes: projectChanges });
    }

    // Compare education
    const educationChanges = compareArray('Education', current.education, newData.education || []);
    if (educationChanges.length > 0) {
        changes.push({ section: 'Education', changes: educationChanges });
    }

    // Compare certifications
    const certChanges = compareArray('Certifications', current.certifications || [], newData.certifications || []);
    if (certChanges.length > 0) {
        changes.push({ section: 'Certifications', changes: certChanges });
    }

    return changes;
}

/**
 * Compare individual fields
 */
function compareField(section: string, fields: Record<string, { old: any, new: any }>) {
    const changes: ChangePreview['changes'] = [];
    
    for (const [field, values] of Object.entries(fields)) {
        if (values.new === undefined) continue;
        
        if (values.old === undefined) {
            changes.push({ type: 'added', field, newValue: values.new });
        } else if (values.old !== values.new) {
            changes.push({ type: 'modified', field, oldValue: values.old, newValue: values.new });
        }
    }
    
    return changes;
}

/**
 * Compare arrays and detect additions, removals, and modifications
 */
function compareArray(section: string, oldArray: any[], newArray: any[]) {
    const changes: ChangePreview['changes'] = [];
    
    // Simple comparison based on string representation
    const oldSet = new Set(oldArray.map(item => JSON.stringify(item)));
    const newSet = new Set(newArray.map(item => JSON.stringify(item)));
    
    // Find added items
    for (const item of newArray) {
        const itemStr = JSON.stringify(item);
        if (!oldSet.has(itemStr)) {
            const field = typeof item === 'object' ? item.title || item.name || item.company : item;
            changes.push({ type: 'added', field: String(field), newValue: item });
        }
    }
    
    // Find removed items
    for (const item of oldArray) {
        const itemStr = JSON.stringify(item);
        if (!newSet.has(itemStr)) {
            const field = typeof item === 'object' ? item.title || item.name || item.company : item;
            changes.push({ type: 'removed', field: String(field), oldValue: item });
        }
    }
    
    return changes;
}