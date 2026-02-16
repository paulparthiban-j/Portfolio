import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
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
