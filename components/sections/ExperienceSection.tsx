"use client";

import { PortfolioContent, Experience } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";

interface ExperienceSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function ExperienceSection({ content, isActive, sectionIndex }: ExperienceSectionProps) {
    if (!content) return null;

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
                        <span className="opacity-30">03.</span> THE JOURNEY
                    </h2>
                </ScrollSection>

                <div className="space-y-16">
                    {(content.experience || []).map((exp: Experience, index: number) => (
                        <StaggeredItem key={index} index={index}>
                            <div className="glass-premium rounded-[3rem] p-10 md:p-14 border-white/5 relative group hover:border-accent/30 transition-all duration-700">
                                <div className="absolute -top-6 -left-6 w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-2xl rotate-12 group-hover:rotate-0 transition-transform">
                                    {index + 1}
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-4">
                                    <div>
                                        <h3 className="text-4xl font-black text-white tracking-tight mb-2">{exp.position}</h3>
                                        <h4 className="text-2xl font-bold text-accent/80">{exp.company}</h4>
                                    </div>
                                    <div className="px-6 py-2 rounded-full glass border border-white/10 text-slate-400 font-mono text-sm tracking-widest uppercase">
                                        {exp.duration}
                                    </div>
                                </div>
                                <p className="text-xl text-slate-400 font-light leading-relaxed max-w-4xl">
                                    {exp.description}
                                </p>
                            </div>
                        </StaggeredItem>
                    ))}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        </AnimatedSection>
    );
}
