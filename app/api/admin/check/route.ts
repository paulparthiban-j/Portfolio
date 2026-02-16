import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    const isValid = adminToken?.value === (process.env.ADMIN_TOKEN || 'super-secret-admin');

    return NextResponse.json({ isAdmin: isValid });
}
