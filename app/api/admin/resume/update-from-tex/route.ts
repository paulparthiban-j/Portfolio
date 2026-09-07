import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";
import { headers } from 'next/headers';
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio";
import { createBackup, mergePortfolioData } from "@/lib/resumeSync";
import fs from 'fs';

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const identifier = getClientIdentifier(headersList as Headers);

        // Rate limiting for update requests
        const rateLimitResult = checkRateLimit(identifier, {
            windowMs: 60 * 60 * 1000, // 1 hour
            maxRequests: 5, // Max 5 update requests per hour
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many update attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '5',
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

        const { newPortfolioData: newPortfolioDataParam, filePath: filePathParam } = await request.json();

        if (!newPortfolioDataParam) {
            return NextResponse.json({ error: "New portfolio data is required" }, { status: 400 });
        }

        // Get current portfolio data for backup
        const currentPortfolioData = await getPortfolioData();

        // Create backup
        const backupPath = createBackup(currentPortfolioData);

        // Merge new data with existing data (preserve theme, stats, etc.)
        const mergedData = mergePortfolioData(currentPortfolioData, newPortfolioDataParam);

        // Save the updated portfolio data
        const saveSuccess = await savePortfolioData(mergedData);

        if (!saveSuccess) {
            return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
        }

        // Clean up the temporary .tex file
        if (filePathParam) {
            try {
                if (fs.existsSync(filePathParam)) {
                    fs.unlinkSync(filePathParam);
                }
            } catch (error) {
                console.error("Failed to delete temp file:", error);
            }
        }

        return NextResponse.json(
            { 
                success: true, 
                message: "Portfolio updated successfully from resume",
                backupPath: backupPath
            },
            {
                headers: {
                    'X-RateLimit-Limit': '5',
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
                },
            }
        );
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
    }
}