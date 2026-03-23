"use client";

import { Theme } from "@/types/portfolio";

interface ParticleBackgroundProps {
    theme?: Theme;
}

export function ParticleBackground({ theme }: ParticleBackgroundProps) {
    return (
        <div className="particle-bg fixed inset-0 z-0 overflow-hidden">
            {/* Soft Glowing Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-[soft-blob_15s_infinite]" />
            <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-secondary/15 rounded-full blur-[100px] animate-[soft-blob_20s_infinite_reverse]" />
            <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-accent/10 rounded-full blur-[80px] animate-[soft-blob_12s_infinite]" />

            {[...Array(25)].map((_, i) => {
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
