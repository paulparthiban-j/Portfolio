"use client";

import { Theme } from "@/types/portfolio";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ParticleBackgroundProps {
    theme?: Theme;
}

export function ParticleBackground({ theme }: ParticleBackgroundProps) {
    const isMobile = useIsMobile();
    const particleCount = isMobile ? 8 : 25;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Soft Ambient Blobs - Primary UI Depth */}
            <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] ${!isMobile ? "animate-soft-blob" : ""}`} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-500/10 rounded-full blur-[120px] ${!isMobile ? "animate-soft-blob animation-delay-2000" : ""}`} />
            <div className={`absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] ${!isMobile ? "animate-soft-blob animation-delay-4000" : ""}`} />

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
