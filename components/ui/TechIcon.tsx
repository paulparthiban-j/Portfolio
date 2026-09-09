"use client";

import { useState } from "react";
import { Theme } from "@/types/portfolio";

interface TechIconProps {
    name: string;
    icon?: string;
    className?: string;
    theme?: Theme;
}

// Simple Icons has no entry for these - requesting them always 404s, so skip
// straight to the letter-badge fallback instead of making a doomed request.
const NO_ICON_AVAILABLE = new Set(["csharp", "sqlserver", "microsoftsqlserver", "winscp", "windowsterminal"]);

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
    const corrections: Record<string, string> = {
        "java": "openjdk",
        "awsec2": "amazonaws",
        "aws": "amazonaws",
        "react": "react",
        "reactjs": "react",
        "express": "express",
        "expressjs": "express",
        "tailwind": "tailwindcss",
        "tailwindcss": "tailwindcss",
        "node": "nodedotjs",
        "nodejs": "nodedotjs",
        "next": "nextdotjs",
        "nextjs": "nextdotjs",
        "springboot": "springboot",
        "mysql": "mysql",
        "postgresql": "postgresql",
        "mongodb": "mongodb",
        "sequelize": "sequelize",
        "opencv": "opencv",
        "typescript": "typescript",
        "javascriptes6plus": "javascript",
        "javascript": "javascript",
        "csharp": "csharp",
        "c": "csharp",
        "net": "dotnet",
        "dotnet": "dotnet",
        "sqlserver": "microsoftsqlserver",
        "signalr": "dotnet",
        "restfulapis": "openapiinitiative",
        "jwtauthentication": "jsonwebtokens",
        "jwt": "jsonwebtokens",
        "git": "git",
        "linuxubuntu": "ubuntu",
        "linux": "linux",
        "sapapiintegration": "sap",
        "sap": "sap",
        "zustand": "react",
        "reactquery": "reactquery",
        "sequelizeorm": "sequelize",
        "python": "python",
        "php": "php",
        "react19": "react",
        "net10webapi": "dotnet",
        "entityframeworkcore": "dotnet",
        "dapper": "dotnet",
        "oauth20": "auth0",
        "oauth": "auth0",
        "rbac": "auth0",
        "devicefingerprinting": "auth0",
        "vite": "vite",
        "sentry": "sentry",
        "swagger": "swagger",
        "winscp": "windowsterminal",
        "agilescrum": "jirasoftware",
        "cicdworkflows": "githubactions",
        "reacthookform": "react",
        "echarts": "apacheecharts",
    };

    const slug = corrections[baseSlug] || baseSlug;
    const color = theme?.mode === 'light' ? '333333' : 'FFFFFF';
    const iconUrl = `https://cdn.simpleicons.org/${slug}/${color}`;

    if (error || NO_ICON_AVAILABLE.has(baseSlug) || NO_ICON_AVAILABLE.has(slug)) {
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
