import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { checkRateLimit, getClientIdentifier } from "@/lib/rateLimit";

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const identifier = getClientIdentifier(headersList as Headers);

        // Rate limiting to slow down password brute-forcing
        const rateLimitResult = checkRateLimit(identifier, {
            windowMs: 60 * 60 * 1000, // 1 hour
            maxRequests: 5, // Max 5 login attempts per hour
        });

        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
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

        const { password } = await request.json();

        // In a real app, use a proper hash and environment variable
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminToken = process.env.ADMIN_TOKEN || 'super-secret-admin';

        if (password === adminPassword) {
            const cookieStore = await cookies();
            cookieStore.set('admin_token', adminToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
