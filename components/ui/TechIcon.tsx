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

    // 1. Initial normalization and generic slugification
    const baseSlug = (icon || name)
        .toLowerCase()
        .trim()
        .replace(/\.js/g, '') // remove .js
        .replace(/\+/g, 'plus')
        .replace(/\s+/g, '') // remove spaces
        .replace(/[^\w]/g, ''); // remove special chars

    // 2. Map to the final correct Simple Icon slugs
    const corrections: { [key: string]: string } = {
        "java": "openjdk",
        "awsec2": "amazonec2",
        "aws": "amazonaws",
        "react": "react",
        "express": "express",
        "tailwind": "tailwindcss",
        "node": "nodedotjs",
        "next": "nextdotjs",
        "springboot": "springboot",
        "mysql": "mysql",
        "postgresql": "postgresql",
        "mongodb": "mongodb",
        "sequelize": "sequelize",
        "opencv": "opencv"
    };

    const slug = corrections[baseSlug] || baseSlug;
    const color = theme?.mode === 'light' ? '333333' : 'FFFFFF';
    const iconUrl = `https://cdn.simpleicons.org/${slug}/${color}`;

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
