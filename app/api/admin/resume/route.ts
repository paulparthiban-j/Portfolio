import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile } from "fs/promises";
import path from "path";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const identifier = getClientIdentifier(headersList as Headers);

        // Rate limiting for resume upload (very strict: 3 per hour)
        const rateLimitResult = checkRateLimit(identifier, {
            windowMs: 60 * 60 * 1000, // 1 hour
            maxRequests: 3, // Max 3 resume uploads per hour
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many upload attempts. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '3',
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

        const formData = await request.formData();
        const file = formData.get("resume") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Enhanced file validation
        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
        }

        // Validate file name to prevent path traversal
        const fileName = file.name;
        if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
            return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
        }

        // Sanitize filename
        const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Use a secure filename with timestamp
        const timestamp = Date.now();
        const filePath = path.join(process.cwd(), "public", `resume_${timestamp}.pdf`);

        await writeFile(filePath, buffer);

        return NextResponse.json(
            { success: true, message: "Resume updated successfully", filename: `resume_${timestamp}.pdf` },
            {
                headers: {
                    'X-RateLimit-Limit': '3',
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
                },
            }
        );
    } catch (error) {
        console.error("Resume upload error:", error);
        return NextResponse.json({ error: "Failed to upload resume" }, { status: 500 });
    }
}
