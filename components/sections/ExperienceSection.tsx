"use client";

import { motion } from "framer-motion";
import { PortfolioContent, Experience } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ExperienceSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function ExperienceSection({ content, isActive, sectionIndex }: ExperienceSectionProps) {
    const isMobile = useIsMobile();
    if (!content) return null;

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`min-h-screen relative py-16 px-6 md:px-12 md:py-24 flex items-center justify-center overflow-hidden bg-black`}
        >
            <div className="absolute inset-0 bg-[#0a0a0b] z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-20 text-center">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-[0.9]">
                        {content.experienceTitle || 'THE JOURNEY'}
                    </h2>
                </ScrollSection>

                <div className="grid grid-cols-1 gap-8 md:gap-8">
                    {(content.experience || []).map((exp, index) => (
                        <StaggeredItem key={index} index={index}>
                            <motion.div
                                whileTap={{ scale: 0.97 }}
                                className={`glass-premium p-10 md:p-14 rounded-3xl border border-white/5 relative group transition-all duration-700 active:scale-95 ${!isMobile ? "hover:border-indigo-500 hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-indigo-500/30" : ""}`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] pointer-events-none" />
                                
                                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-4 mb-8">
                                            <div className="px-4 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                                                Active Duty
                                            </div>
                                            <span className="text-sm font-bold text-slate-500 tracking-widest uppercase">
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-4 group-hover:text-indigo-400 transition-colors">
                                            {exp.company}
                                        </h3>
                                        <h4 className="text-xl md:text-2xl font-bold text-slate-400 uppercase tracking-tight mb-10 border-l-4 border-indigo-500 pl-6">
                                            {exp.position}
                                        </h4>
                                    </div>
                                    <div className="w-full md:w-3/5">
                                        <p className="text-lg md:text-2xl text-slate-400 leading-relaxed font-medium">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </StaggeredItem>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
}
