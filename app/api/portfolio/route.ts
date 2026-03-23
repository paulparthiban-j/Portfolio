import { NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio";

export async function GET() {
    try {
        const data = await getPortfolioData();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
            },
        });
    } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
        return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        // Use a default token for development or the environment variable
        const secretToken = process.env.ADMIN_TOKEN || "development-token";

        if (token && token !== secretToken) {
            return NextResponse.json({ error: "Unauthorized mission access" }, { status: 403 });
        }

        const data = await request.json();
        const success = await savePortfolioData(data);
        
        if (!success) {
            throw new Error("Local persistence failed");
        }

        return NextResponse.json({ success: true, message: "Mission data deployed to local terminal" });
    } catch (error) {
        console.error("Transmission error:", error);
        return NextResponse.json({ error: "Failed to deploy mission data" }, { status: 500 });
    }
}
