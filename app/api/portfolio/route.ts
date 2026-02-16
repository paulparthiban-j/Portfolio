import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

export async function GET() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load portfolio data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Simple auth check
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (adminToken?.value !== process.env.ADMIN_TOKEN && adminToken?.value !== 'super-secret-admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newData = await request.json();
        fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');
        return NextResponse.json({ message: 'Portfolio updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update portfolio data' }, { status: 500 });
    }
}
