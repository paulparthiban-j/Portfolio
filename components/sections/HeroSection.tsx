"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { useIsMobile } from "@/hooks/useIsMobile";

interface HeroSectionProps {
    content: PortfolioContent;
    hideHeroContent?: boolean;
    isActive?: boolean;
    sectionIndex?: number;
}

export function HeroSection({ content, hideHeroContent, isActive, sectionIndex }: HeroSectionProps) {
    const [mounted, setMounted] = useState(false);
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Always call hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!content) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 100 },
        },
    };

    return (
        <section 
            ref={containerRef}
            className={`relative min-h-screen flex items-center justify-center overflow-hidden h-full ${content.theme?.bg || 'bg-black'}`}
        >
            {/* Background Layer: Mobile = Static, Desktop = Particles */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none`} />
                {!isMobile && mounted && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
                         <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-500/20" />
                    </div>
                )}
            </div>

            {mounted && (
                <motion.div
                    style={!isMobile ? { y, opacity, scale } : {}}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isActive ? "visible" : "hidden"}
                    className={`container mx-auto px-6 relative z-10 text-center transition-all duration-700 ${hideHeroContent ? 'opacity-0 scale-95 blur-xl pointer-events-none' : 'opacity-100 scale-100 blur-0'}`}
                >
                    <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                            {content.title || "Full Stack Developer"}
                        </span>
                    </motion.div>

                    <motion.h1 
                        variants={itemVariants}
                        className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-none"
                    >
                        <span className={`block bg-clip-text text-transparent bg-gradient-to-r ${content.theme?.primaryGradient || 'from-white via-indigo-200 to-indigo-400'}`}>
                            {content.name}
                        </span>
                    </motion.h1>

                    <motion.p 
                        variants={itemVariants}
                        className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        {content.subtitle || content.description}
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
                        <a 
                            href="#projects"
                            className="group relative px-8 py-4 bg-indigo-600 rounded-2xl text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 shadow-xl"
                        >
                            View Projects
                        </a>
                        <a 
                            href={content.resumeUrl || "#"}
                            target="_blank"
                            className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                        >
                            Resume
                        </a>
                    </motion.div>
                </motion.div>
            )}

            {/* Scroll Indicator */}
            {mounted && !hideHeroContent && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                >
                    <div className="w-px h-12 bg-gradient-to-b from-indigo-500/50 to-transparent" />
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Scroll</span>
                </motion.div>
            )}
        </section>
    );
}
