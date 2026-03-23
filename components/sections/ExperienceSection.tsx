"use client";

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
            className={`min-h-screen relative py-32 md:py-44 px-6 md:px-12 flex items-center justify-center overflow-hidden bg-black`}
        >
            <div className="absolute inset-0 bg-[#0a0a0b] z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
            
            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">04.</span> {content.experienceTitle || 'THE JOURNEY'}
                    </h2>
                </ScrollSection>

                <div className="space-y-8 md:space-y-12">
                    {(content.experience || []).map((exp, index) => (
                        <StaggeredItem key={index} index={index}>
                            <div className={`glass-premium p-10 md:p-14 rounded-5xl border border-white/5 relative group transition-all duration-700 active:scale-95 ${!isMobile ? "hover:border-indigo-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10" : ""}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-[100px] pointer-events-none" />
                                
                                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-4 mb-6">
                                            <div className="px-4 py-1.5 rounded-full bg-indigo-600 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-indigo-500/20">
                                                Active Duty
                                            </div>
                                            <span className="text-sm font-bold text-indigo-400 tracking-widest uppercase">
                                                {exp.duration}
                                            </span>
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4 group-hover:text-indigo-400 transition-colors">
                                            {exp.company}
                                        </h3>
                                        <h4 className="text-xl font-bold text-slate-300 uppercase tracking-tight mb-8">
                                            {exp.position}
                                        </h4>
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </StaggeredItem>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
}
