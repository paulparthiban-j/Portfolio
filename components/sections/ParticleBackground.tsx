"use client";

import { Theme } from "@/types/portfolio";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ParticleBackgroundProps {
    theme?: Theme;
}

export function ParticleBackground({ theme }: ParticleBackgroundProps) {
    const isMobile = useIsMobile();
    const particleCount = isMobile ? 0 : 20;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Soft ambient glow. Radial gradients instead of blur() filters:
                same look, but no expensive full-screen filter layers on mobile GPUs. */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(40% 40% at 10% 5%, rgba(217, 70, 239, 0.08), transparent 70%)," +
                        "radial-gradient(45% 45% at 95% 95%, rgba(168, 85, 247, 0.08), transparent 70%)," +
                        "radial-gradient(30% 30% at 95% 30%, rgba(139, 92, 246, 0.05), transparent 70%)",
                }}
            />

            {/* Particles */}
            {[...Array(particleCount)].map((_, i) => {
                const left = (i * 7 + 13) % 100;
                const top = (i * 11 + 17) % 100;
                const size = ((i * 3 + 4) % 4) + 1;
                const delay = (i * 0.8) % 15;
                const duration = ((i * 3 + 15) % 15) + 20;
                const opacity = ((i * 2 + 5) % 15) / 100 + 0.05;
                
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
                            background: theme?.mode === 'light' ? `rgba(0, 0, 0, ${opacity * 1.5})` : `rgba(255, 255, 255, ${opacity})`,
                        }}
                    />
                );
            })}
        </div>
    );
}
