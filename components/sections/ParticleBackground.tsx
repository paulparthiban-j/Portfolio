"use client";

import { Theme } from "@/types/portfolio";

interface ParticleBackgroundProps {
    theme?: Theme;
}

export function ParticleBackground({ theme }: ParticleBackgroundProps) {
    return (
        <div className="particle-bg fixed inset-0 z-0">
            {[...Array(20)].map((_, i) => {
                // Stable values for each particle
                const left = (i * 7 + 13) % 100;
                const top = (i * 11 + 17) % 100;
                const size = ((i * 3 + 5) % 6) + 2;
                const delay = (i * 1.5) % 20;
                const duration = ((i * 2 + 10) % 10) + 15;
                return (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                            background: theme?.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                        }}
                    />
                );
            })}
        </div>
    );
}
