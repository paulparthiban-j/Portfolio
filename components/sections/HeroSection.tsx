"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Particles } from "@/components/ui/Particles";

interface HeroSectionProps {
    content: PortfolioContent;
    hideHeroContent?: boolean;
    isActive?: boolean;
    sectionIndex?: number;
}

// Magnetic Button Component
function MagneticButton({ children, className, as = "button", ...props }: any) {
    const Component = as === "a" ? motion.a : motion.button;
    const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    return (
        <Component
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
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

    const nameParts = content.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <section 
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0B] py-12 md:py-20"
        >
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
                {!isMobile && mounted && (
                    // Drift via transform (GPU-composited) instead of animating
                    // background-position, which repainted the whole hero every frame.
                    <div
                        className="absolute -inset-[10%] opacity-30 pointer-events-none animate-mesh-drift will-change-transform"
                        style={{ background: 'var(--gradient-mesh)' }}
                    />
                )}
                {!isMobile && mounted && <Particles />}
            </div>

            <motion.div
                style={mounted && !isMobile ? { y, opacity, scale } : {}}
                className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center"
            >
                {/* Status Badge */}
                {/* CSS-driven entrance (not JS/rAF-driven): guarantees this content is visible
                    even if the animation never gets to run - e.g. a throttled/backgrounded tab
                    on mobile, which previously left the hero stuck invisible indefinitely. */}
                <div
                    className="flex flex-col items-center mb-8 animate-slide-up"
                    style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 backdrop-blur-md mb-4 group cursor-pointer hover:bg-violet-500/20 transition-all duration-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <span className="text-[10px] md:text-sm font-black tracking-widest text-violet-400 uppercase">
                            {content.currentWork || "Available for new opportunities"}
                        </span>
                    </div>
                    <span className="text-xs md:text-sm font-black tracking-[0.4em] text-slate-400 uppercase" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {content.title || "Full-Stack Developer"}
                    </span>
                </div>

                {/* Name */}
                <h1
                    className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black mb-10 tracking-tighter leading-[0.85] animate-fade-in"
                    style={{ fontFamily: 'var(--font-space-grotesk)', animationDelay: '0.4s', animationFillMode: 'both' }}
                >
                    <div className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-violet-400 md:drop-shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                        {firstName}
                    </div>
                    <div className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-violet-300 to-white md:drop-shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                        {lastName}
                    </div>
                </h1>

                {/* Subtitle */}
                <p
                    className="text-base sm:text-xl md:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto mb-12 md:mb-16 leading-tight font-bold tracking-tight px-4 animate-slide-up"
                    style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
                >
                    {content.subtitle || content.description}
                </p>

                {/* CTA Buttons */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 animate-slide-up"
                    style={{ animationDelay: '1s', animationFillMode: 'both' }}
                >
                    <MagneticButton
                        as="a"
                        href="#projects"
                        className="w-full sm:w-auto group relative px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-6 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 rounded-2xl text-white text-sm sm:text-base md:text-lg font-black uppercase transition-colors duration-300 shadow-2xl shadow-violet-500/30 active:scale-95 flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        <span>View Projects</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </MagneticButton>
                    <MagneticButton
                        as="a"
                        href="/api/resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl text-white text-sm sm:text-base md:text-lg font-black uppercase transition-colors duration-300 active:scale-95 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Download Resume
                    </MagneticButton>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none animate-fade-in"
                style={{ animationDelay: '1.5s', animationFillMode: 'both' }}
            >
                <div className="w-px h-16 bg-gradient-to-b from-violet-400/70 to-transparent animate-scroll-cue" />
                <span className="text-[10px] md:text-xs font-black tracking-widest text-slate-400 uppercase">Scroll to explore</span>
            </div>
        </section>
    );
}
