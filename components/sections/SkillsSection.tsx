"use client";

import { PortfolioContent, Skill } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";
import { TechIcon } from "@/components/ui/TechIcon";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SkillsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function SkillsSection({ content, isActive, sectionIndex }: SkillsSectionProps) {
    const isMobile = useIsMobile();
    if (!content) return null;

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-black py-24 md:py-32 px-6 md:px-12 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-[#0a0a0b] z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-20 text-center">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-[0.9]">
                        {content.skillsTitle || 'THE STACK'}
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Crafting digital excellence with a modern and scalable tech stack.
                    </p>
                </ScrollSection>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                    {(content.skills || []).map((skill: string | Skill, index: number) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        const skillIcon = typeof skill === 'string' ? "" : skill.icon;
                        
                        return (
                            <StaggeredItem key={index} index={index}>
                                <div className={`flex flex-col items-center group transition-all duration-500 active:scale-95`}>
                                    <div className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-indigo-600/20 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden backdrop-blur-sm`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <TechIcon 
                                            name={skillName} 
                                            icon={skillIcon} 
                                            className="w-10 h-10 md:w-14 md:h-14 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10" 
                                        />
                                    </div>
                                    <span className="text-xs md:text-sm font-bold text-slate-400 group-hover:text-white uppercase tracking-widest text-center transition-colors">
                                        {skillName}
                                    </span>
                                </div>
                            </StaggeredItem>
                        );
                    })}
                </div>
            </div>

            {/* Subtle background light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        </AnimatedSection>
    );
}
