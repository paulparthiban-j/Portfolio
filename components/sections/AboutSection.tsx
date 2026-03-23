"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AboutSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function AboutSection({ content, isActive, sectionIndex }: AboutSectionProps) {
    const isMobile = useIsMobile();
    if (!content) return null;

    const stats = [
        { number: 50, label: "Projects Completed", suffix: "+" },
        { number: 4, label: "Experience Years", suffix: "+" },
        { number: 10, label: "Technologies Used", suffix: "+" },
        { number: 200, label: "Commits This Year", suffix: "+" },
    ];

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`min-h-screen relative py-20 md:py-32 px-6 md:px-12 flex items-center justify-center overflow-hidden bg-black`}
        >
            <div className="absolute inset-0 bg-[#0a0a0b] z-0" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24 mb-20 md:mb-32">
                    {/* Left Side: Massive Visual / Identity */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <ScrollSection animationType="slide-left" className="mb-10 w-full">
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.9]">
                                {content.aboutTitle || 'WHO AM I'}
                            </h2>
                            <div className="h-2 w-32 bg-indigo-600 rounded-full mb-10 hidden lg:block shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                        </ScrollSection>

                        <div className="relative group p-10 md:p-14 glass-premium rounded-5xl border border-white/5 transition-all duration-700 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 max-w-xl text-left bg-white/[0.02]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none" />
                            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium mb-10">
                                {content.description}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-white/10">
                                <div className="text-left">
                                    <div className="text-sm font-black text-white uppercase tracking-widest mb-1">Base of Operations</div>
                                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest">{content.location || "Tirunelveli, India"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Identity Details Grid transformed into Stats */}
                    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6 md:gap-10">
                        {stats.map((stat, i) => (stat && (
                            <CounterCard key={i} target={stat.number} label={stat.label} suffix={stat.suffix} />
                        )))}
                    </div>
                </div>

                {/* Additional Info Cards or Content could go here */}
            </div>
        </AnimatedSection>
    );
}

function CounterCard({ target, label, suffix }: { target: number; label: string; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, target, {
                duration: 2,
                onUpdate(value) {
                    setCount(Math.floor(value));
                },
                ease: "easeOut",
            });
            return () => controls.stop();
        }
    }, [isInView, target]);

    return (
        <div ref={ref} className="glass-premium p-10 rounded-4xl border border-white/5 relative group transition-all duration-700 active:scale-95 text-center flex flex-col justify-center items-center hover:bg-white/[0.04]">
            <div className="text-5xl md:text-7xl font-black text-indigo-500 mb-4 tracking-tighter flex items-center gap-1 group-hover:scale-110 transition-transform duration-500">
                <span>{count}</span>
                <span className="text-indigo-400 opacity-50">{suffix}</span>
            </div>
            <h4 className="text-[10px] md:text-xs font-black tracking-[0.2em] text-slate-500 uppercase leading-tight max-w-[120px] mx-auto group-hover:text-slate-300 transition-colors duration-500">
                {label}
            </h4>
        </div>
    );
}
