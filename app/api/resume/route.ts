import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
    try {
        // Check if user is authenticated (you can implement your own auth logic)
        // For now, we'll allow public access but you can add auth check here
        // const cookieStore = await cookies();
        // const adminToken = cookieStore.get("admin_token");
        // const isValid = adminToken?.value === (process.env.ADMIN_TOKEN || "super-secret-admin");

        // if (!isValid) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        // Find the latest resume file
        const publicDir = path.join(process.cwd(), "public");
        const fs = require('fs');
        const files = fs.readdirSync(publicDir).filter((file: string) =>
            file.startsWith('resume_') && file.endsWith('.pdf')
        );

        if (files.length === 0) {
            // Fallback to the original resume file if timestamped ones don't exist
            const fallbackPath = path.join(publicDir, "resume.pdf");
            try {
                const fileBuffer = await readFile(fallbackPath);
                return new NextResponse(fileBuffer, {
                    headers: {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="Paul_Parthiban_Resume.pdf"',
                        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                    },
                });
            } catch {
                return NextResponse.json({ error: "Resume not found" }, { status: 404 });
            }
        }

        // Get the most recent resume file
        files.sort((a: string, b: string) => {
            const timestampA = parseInt(a.match(/resume_(\d+)\.pdf/)?.[1] || '0');
            const timestampB = parseInt(b.match(/resume_(\d+)\.pdf/)?.[1] || '0');
            return timestampB - timestampA;
        });

        const latestResume = files[0];
        const filePath = path.join(publicDir, latestResume);
        const fileBuffer = await readFile(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Paul_Parthiban_Resume.pdf"',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error("Resume download error:", error);
        return NextResponse.json({ error: "Failed to download resume" }, { status: 500 });
    }
}
