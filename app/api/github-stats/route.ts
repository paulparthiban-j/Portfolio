import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/portfolio';

export const revalidate = 3600;

function extractGithubUsername(url: string): string | null {
    try {
        const { pathname } = new URL(url);
        return pathname.split('/').filter(Boolean)[0] || null;
    } catch {
        return null;
    }
}

export async function GET() {
    const portfolio = await getPortfolioData();
    const username = portfolio.github ? extractGithubUsername(portfolio.github) : null;

    if (!username) {
        return NextResponse.json({ error: 'No GitHub username configured' }, { status: 404 });
    }

    try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
            headers: { Accept: 'application/vnd.github+json' },
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'GitHub API error' }, { status: res.status });
        }

        const data = await res.json();

        return NextResponse.json(
            {
                publicRepos: data.public_repos ?? 0,
                followers: data.followers ?? 0,
                following: data.following ?? 0,
            },
            { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
        );
    } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
        return NextResponse.json({ error: 'Failed to fetch GitHub stats' }, { status: 502 });
    }
}
