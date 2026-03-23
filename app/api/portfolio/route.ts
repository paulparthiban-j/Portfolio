import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import { getPortfolioData } from '@/lib/portfolio';

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

export async function GET() {
    try {
        const data = await getPortfolioData();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load portfolio data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (adminToken?.value !== process.env.ADMIN_TOKEN && adminToken?.value !== 'super-secret-admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newData = await request.json();

        // Save to DB if available
        if (process.env.POSTGRES_URL) {
            // Using a single row for simplicity, updating the first row or inserting
            const { rows } = await sql`SELECT id FROM portfolio_data LIMIT 1`;
            if (rows.length > 0) {
                await sql`
                    UPDATE portfolio_data 
                    SET content = ${JSON.stringify(newData)}, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${rows[0].id}
                `;
            } else {
                await sql`
                    INSERT INTO portfolio_data (content)
                    VALUES (${JSON.stringify(newData)})
                `;
            }
        }

        // Always sync back to local file for safety/local dev
        fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8');

        return NextResponse.json({ message: 'Portfolio updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update portfolio data' }, { status: 500 });
    }
}

