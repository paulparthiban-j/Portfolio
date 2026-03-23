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
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 md:py-44 px-6 md:px-12 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-[#0a0a0b]/90 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">02.</span> {content.skillsTitle || 'THE STACK'}
                    </h2>
                </ScrollSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {(content.skills || []).map((skill: string | Skill, index: number) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        const skillIcon = typeof skill === 'string' ? "" : skill.icon;
                        
                        return (
                            <StaggeredItem key={index} index={index}>
                                <div className={`glass-premium rounded-5xl p-10 border border-white/5 relative group transition-all duration-700 active:scale-95 ${!isMobile ? "hover:border-indigo-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10" : ""}`}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-[100px] pointer-events-none" />
                                    
                                    <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-indigo-600 transition-all duration-500 relative z-10 ${!isMobile ? "animate-float" : ""}`}
                                        style={!isMobile ? { animationDelay: `${index * 150}ms` } : {}}
                                    >
                                        <TechIcon 
                                            name={skillName} 
                                            icon={skillIcon} 
                                            className="w-8 h-8 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" 
                                        />
                                    </div>
                                    
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                                        {skillName}
                                    </h3>

                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 delay-500"
                                            style={{ width: `${60 + (index % 4) * 10}%` }}
                                        />
                                    </div>
                                    
                                    <div className="mt-4 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Expertise Level</span>
                                        <span className="text-xs font-bold text-white tracking-widest leading-none">{70 + (index % 4) * 10}%</span>
                                    </div>
                                </div>
                            </StaggeredItem>
                        );
                    })}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-64 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        </AnimatedSection>
    );
}
