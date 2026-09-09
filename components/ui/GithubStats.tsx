"use client";

import { useEffect, useState } from "react";
import { Counter } from "@/components/ui/Counter";
import { LiveBadge } from "@/components/ui/LiveBadge";

interface GithubStatsData {
    publicRepos: number;
    followers: number;
    following: number;
}

export function GithubStats() {
    const [stats, setStats] = useState<GithubStatsData | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/github-stats")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled && data && !data.error) setStats(data);
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, []);

    if (!stats) return null;

    return (
        <div className="mt-6 pt-6 border-t border-white/10">
            <LiveBadge label="Live from GitHub" className="text-white/80 mb-3" />
            <div className="flex items-center gap-6">
                <div>
                    <div className="text-xl font-black text-white">
                        <Counter target={stats.publicRepos} suffix="+" />
                    </div>
                    <div className="text-[9px] text-white/60 uppercase tracking-widest font-bold">Public Repos</div>
                </div>
                <div>
                    <div className="text-xl font-black text-white">
                        <Counter target={stats.followers} />
                    </div>
                    <div className="text-[9px] text-white/60 uppercase tracking-widest font-bold">Followers</div>
                </div>
            </div>
        </div>
    );
}
