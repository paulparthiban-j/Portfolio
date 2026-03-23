"use client";

import { PortfolioContent } from "@/types/portfolio";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";

interface HeroSectionProps {
    content: PortfolioContent;
    hideHeroContent: boolean;
    isActive?: boolean;
    sectionIndex?: number;
}

const MagneticButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        x.set(distanceX * 0.35);
        y.set(distanceY * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export function HeroSection({ content, hideHeroContent, isActive, sectionIndex }: HeroSectionProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 40;
            const y = (clientY / window.innerHeight - 0.5) * 40;
            setMousePosition({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <AnimatedSection
            isFirst={true}
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} relative overflow-hidden`}
        >
            {/* Background Texture & Floating Shapes */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            
            {/* Soft Ambient Shapes */}
            <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
            
            <div 
                className={`hero-content text-center w-full transition-all duration-1000 ${hideHeroContent ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
                style={{
                    transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0)`
                }}
            >
                <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
                    <ScrollSection animationType="slide-down" className="mb-4">
                        <span className="px-4 py-2 rounded-full border border-white/10 glass-dark text-xs font-bold tracking-[0.3em] uppercase opacity-70">
                            Digital Architect
                        </span>
                    </ScrollSection>

                    <ScrollSection animationType="slide-up">
                        <h1 className="mb-8 text-7xl font-black md:text-[9rem] leading-[0.9] tracking-tighter text-center perspective-1000">
                            <span className={`inline-block animate-gradient bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-400 via-purple-400 to-indigo-400'} bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]`}>
                                I&apos;m {content.name}
                            </span>
                        </h1>
                    </ScrollSection>

                    <ScrollSection animationType="slide-up" className="delay-200">
                        <p className="mb-8 text-2xl md:text-5xl font-extralight text-slate-300/90 tracking-tight">
                            {content.title}
                        </p>
                    </ScrollSection>

                    <ScrollSection animationType="fade-in" className="delay-500">
                        <p className="mb-12 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                            {content.description}
                        </p>
                    </ScrollSection>

                    <ScrollSection animationType="scale-in" className="delay-700">
                        <div className="flex flex-wrap justify-center gap-12">
                            <MagneticButton>
                                <a
                                    href={`mailto:${content.email}`}
                                    className="group relative px-12 py-6 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 block"
                                    aria-label="Send an email to hire me"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'} transition-transform duration-500 group-hover:scale-110`} />
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative text-white font-black text-xl tracking-wider flex items-center gap-3">
                                        Initiate Project <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </span>
                                </a>
                            </MagneticButton>

                            <MagneticButton>
                                <a
                                    href={content.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group px-12 py-6 rounded-full border border-white/10 glass-premium hover:bg-white/10 transition-all duration-500 hover:scale-105 active:scale-95 block"
                                    aria-label="View my GitHub profile"
                                >
                                    <span className="text-white font-bold text-xl tracking-wider">
                                        Explore Lab
                                    </span>
                                </a>
                            </MagneticButton>
                        </div>
                    </ScrollSection>
                </div>
            </div>

            <div
                className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${hideHeroContent ? 'opacity-0' : 'opacity-100'}`}
                aria-hidden="true"
            >
                <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] tracking-[0.5em] text-slate-500 uppercase font-black">Gravity Defied</span>
                    <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 via-white/40 to-transparent animate-shimmer" />
                </div>
            </div>

            {/* Float-up Wow Moment Elements */}
            <div className="absolute top-[15%] right-[10%] w-12 h-12 border border-white/5 glass-dark rounded-xl rotate-45 animate-float opacity-20 pointer-events-none" />
            <div className="absolute bottom-[20%] left-[5%] w-8 h-8 bg-accent/20 rounded-full blur-md animate-float-up delay-1000 pointer-events-none" />
        </AnimatedSection >
    );
}
