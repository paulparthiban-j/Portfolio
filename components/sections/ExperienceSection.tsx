"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { useRef } from "react";

interface ExperienceSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
    if (!content) return null;

    const experience = content.experience || [];
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section className="w-full bg-[#0A0A0B] py-16 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-16 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {content.experienceTitle || "EXPERIENCE"}
                    </h2>
                    <div className="h-1 w-24 bg-emerald-600 rounded-full mt-6 mx-auto" />
                </ScrollSection>

                {experience.length === 0 ? (
                    <p className="text-slate-500 text-center text-lg">No experience listed yet.</p>
                ) : (
                    <div className="space-y-8 md:space-y-12 w-full" ref={containerRef}>
                        {experience.map((exp, index) => (
                            <ExperienceItem key={index} exp={exp} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function ExperienceItem({ exp, index }: { exp: any; index: number }) {
    const itemRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: itemRef,
        offset: ["start end", "end start"]
    });
    
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
    const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-50, 0, 0, 50]);

    return (
        <motion.div
            ref={itemRef}
            style={{ opacity, scale, x }}
            className="group relative pl-8 md:pl-12 border-l-2 border-white/5 hover:border-emerald-500/50 transition-all duration-500 pb-8 md:pb-12 last:pb-0 cursor-pointer interaction-lift"
        >
            {/* Animated Timeline Dot */}
            <motion.div 
                className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-[#0A0A0B] border-2 border-white/10 group-hover:border-emerald-500 transition-all duration-300"
                animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: ["0 0 0 rgba(16, 185, 129, 0)", "0 0 20px rgba(16, 185, 129, 0.5)", "0 0 0 rgba(16, 185, 129, 0)"]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                }}
            />
            
            {/* Connecting Line Animation */}
            <motion.div
                className="absolute left-[-5px] top-0 w-[2px] bg-gradient-to-b from-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
            />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="text-xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-emerald-400 transition-colors duration-300" 
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                        {exp.company}
                    </motion.h3>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 }}
                        className="flex items-center gap-3 mt-4"
                    >
                        <motion.div 
                            className="w-1.5 h-6 bg-emerald-500 rounded-full"
                            whileHover={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.3 }}
                        />
                        <h4 className="text-base md:text-xl font-bold text-slate-300 uppercase tracking-widest">
                            {exp.position}
                        </h4>
                    </motion.div>
                </div>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="shrink-0 flex items-start"
                >
                    <motion.span 
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        className="text-[10px] md:text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 sm:px-4 sm:py-2 rounded-xl uppercase tracking-[0.2em] whitespace-nowrap shadow-xl shadow-emerald-500/5"
                    >
                        {exp.duration}
                    </motion.span>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.25 }}
                className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 group-hover:bg-white/[0.04] group-hover:border-emerald-500/20 transition-all duration-500 interaction-lift"
            >
                <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                    {exp.description}
                </p>
            </motion.div>
        </motion.div>
    );
}
