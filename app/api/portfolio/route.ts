import { NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio";
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";
import { headers, cookies } from 'next/headers';

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
        const headersList = await headers();
        const identifier = getClientIdentifier(headersList as Headers);

        // Rate limiting for POST requests (more strict than GET)
        const rateLimitResult = checkRateLimit(identifier, {
            windowMs: 60 * 60 * 1000, // 1 hour
            maxRequests: 10, // Max 10 updates per hour
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
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

        const data = await request.json();
        const success = await savePortfolioData(data);

        if (!success) {
            throw new Error("Local persistence failed");
        }

        return NextResponse.json(
            { success: true, message: "Mission data deployed to local terminal" },
            {
                headers: {
                    'X-RateLimit-Limit': '10',
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
                },
            }
        );
    } catch (error) {
        console.error("Transmission error:", error);
        return NextResponse.json({ error: "Failed to deploy mission data" }, { status: 500 });
    }
}
