"use client";

import { Theme } from "@/types/portfolio";

interface WelcomeScreenProps {
    name: string;
    title: string;
    showWelcome: boolean;
    theme?: Theme;
}

export function WelcomeScreen({ name, title, showWelcome, theme }: WelcomeScreenProps) {
    return (
        <div className={`welcome-screen ${!showWelcome ? "hidden" : ""} bg-gradient-to-r ${theme?.primaryGradient || 'from-indigo-600 to-violet-600'}`}>
            <div className="welcome-content">
                <h1 className="welcome-title text-white">{name}</h1>
                <p className="welcome-subtitle text-white/90">{title}</p>
                <div className="welcome-loader">
                    <span className="loading loading-spinner loading-lg text-white"></span>
                </div>
            </div>
        </div>
    );
}
