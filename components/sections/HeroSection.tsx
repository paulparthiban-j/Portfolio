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
            className={`relative min-h-screen flex items-center justify-center overflow-hidden h-full ${content.theme?.bg || 'bg-black'} py-10 sm:py-16 md:py-20`}
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
                    animate="visible"
                    className="container mx-auto px-4 sm:px-6 md:px-10 relative z-10 text-center"
                >
                    <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-4 group cursor-pointer hover:bg-indigo-500/20 transition-all duration-300">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-[10px] md:text-sm font-black tracking-widest text-indigo-400 uppercase">
                                {content.currentWork || "Available for high-stakes missions"}
                            </span>
                        </div>
                        <span className="text-xs md:text-sm font-black tracking-[0.4em] text-slate-500 uppercase">
                            {content.title || "Systems Architect"}
                        </span>
                    </motion.div>

                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl sm:text-6xl md:text-[8rem] lg:text-[10rem] font-black mb-10 tracking-tighter leading-[0.8] mix-blend-lighten"
                    >
                        <span className={`block bg-clip-text text-transparent bg-gradient-to-r ${content.theme?.primaryGradient || 'from-white via-indigo-200 to-indigo-400'} drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]`}>
                            {content.name.split(' ')[0]}<br/>
                            {content.name.split(' ').slice(1).join(' ')}
                        </span>
                    </motion.h1>

                    <motion.p 
                        variants={itemVariants}
                        className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-slate-300 max-w-4xl mx-auto mb-16 leading-tight font-bold tracking-tight"
                    >
                        {content.subtitle || content.description}
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <motion.a 
                            href="#projects"
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 bg-indigo-600 rounded-2xl text-white text-sm sm:text-base md:text-lg font-black transition-all hover:bg-indigo-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.4)] shadow-2xl active:scale-95 flex items-center gap-3"
                        >
                            <span>DEPLOYED PROJECTS</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </motion.a>
                        <motion.a 
                            href={content.resumeUrl || "#"}
                            target="_blank"
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white text-sm sm:text-base md:text-lg font-black hover:bg-white/10 transition-all hover:border-white/20 active:scale-95"
                        >
                            SECURE RESUME
                        </motion.a>
                    </motion.div>
                </motion.div>
            )}

            {mounted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                >
                    <div className="w-px h-16 bg-gradient-to-b from-indigo-500/50 to-transparent" />
                    <span className="text-[10px] md:text-xs font-black tracking-widest text-slate-500 uppercase">Scroll to explore</span>
                </motion.div>
            )}
        </section>
    );
}
