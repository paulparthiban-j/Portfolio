"use client";

import { PortfolioContent, Education } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";

interface EducationSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function EducationSection({ content, isActive, sectionIndex }: EducationSectionProps) {
    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">04.</span> THE FOUNDATION
                    </h2>
                </ScrollSection>

                <div className="grid gap-12 md:grid-cols-2">
                    {content.education.map((edu: Education, index: number) => (
                        <StaggeredItem key={index} index={index}>
                            <div className="glass-premium rounded-[3rem] p-12 md:p-16 border-white/5 relative group hover:border-accent/30 transition-all duration-700 h-full flex flex-col justify-center">
                                <div className="absolute top-10 right-10 flex flex-col items-end">
                                    <div className="px-6 py-2 rounded-full glass border border-white/10 text-accent font-black text-sm tracking-widest mb-4">
                                        {edu.year}
                                    </div>
                                    <div className="w-12 h-1 bg-accent/40 rounded-full" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[0.9] tracking-tighter max-w-[80%]">
                                    {edu.degree.toUpperCase()}
                                </h3>
                                <p className="text-2xl font-bold text-slate-400">
                                    {edu.institution}
                                </p>
                            </div>
                        </StaggeredItem>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        </AnimatedSection>
    );
}
