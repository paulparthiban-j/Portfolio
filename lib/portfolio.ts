import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

async function initDb() {
    try {
        if (!process.env.POSTGRES_URL) return;
        
        await sql`
            CREATE TABLE IF NOT EXISTS portfolio_data (
                id SERIAL PRIMARY KEY,
                content JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const { rows } = await sql`SELECT COUNT(*) FROM portfolio_data`;
        if (parseInt(rows[0].count) === 0) {
            const localData = fs.readFileSync(DATA_FILE, 'utf8');
            await sql`
                INSERT INTO portfolio_data (content)
                VALUES (${localData})
            `;
            console.log('Database seeded from local portfolio.json');
        }
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

export async function getPortfolioData() {
    try {
        if (process.env.POSTGRES_URL) {
            await initDb();
            const { rows } = await sql`SELECT content FROM portfolio_data ORDER BY id DESC LIMIT 1`;
            if (rows.length > 0) {
                return rows[0].content;
            }
        }

        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Fallback to a very minimal structure if everything fails
        return {
            name: "Paul Parthiban J",
            title: "Backend Developer",
            description: "Full Stack Developer Portfolio"
        };
    }
}
