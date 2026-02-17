"use client";

import { useState } from "react";
import { Theme } from "@/types/portfolio";

interface TechIconProps {
    name: string;
    icon?: string;
    className?: string;
    theme?: Theme;
}

export function TechIcon({ name, icon, className = "", theme }: TechIconProps) {
    const [error, setError] = useState(false);

    // If user provided a specific icon URL, use it
    if (icon && (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('data:'))) {
        return (
            <div className={`${className} overflow-hidden shadow-lg`}>
                <img src={icon} alt={name} className="w-full h-full object-contain" />
            </div>
        );
    }

    // Otherwise, try to get it from Simple Icons
    // Slugify the name (e.g., "Next.js" -> "nextdotjs", "Tailwind CSS" -> "tailwindcss")
    const slug = (icon || name)
        .toLowerCase()
        .replace(/\.js/g, 'dotjs')
        .replace(/\+/g, 'plus')
        .replace(/\s+/g, '')
        .replace(/[^\w]/g, '');

    const iconUrl = `https://cdn.simpleicons.org/${slug}/${theme?.mode === 'light' ? '333' : 'fff'}`;

    if (error) {
        return (
            <div className={`${className} bg-gradient-to-br ${theme?.primaryGradient || 'from-indigo-500 to-purple-600'} text-white flex items-center justify-center text-3xl font-bold shadow-lg`}>
                {name.charAt(0)}
            </div>
        );
    }

    return (
        <div className={`${className} p-3 flex items-center justify-center`}>
            <img
                src={iconUrl}
                alt={name}
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
                onError={() => setError(true)}
            />
        </div>
    );
}
