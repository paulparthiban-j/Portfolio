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
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">02.</span> {content.skillsTitle || 'THE STACK'}
                    </h2>
                </ScrollSection>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {(content.skills || []).map((skill: string | Skill, index: number) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        const skillIcon = typeof skill === 'string' ? "" : skill.icon;
                        
                        return (
                            <StaggeredItem key={index} index={index}>
                                <div className={`glass-premium rounded-[2.5rem] p-10 border-white/5 relative group hover:border-accent/40 transition-all duration-700 ${!isMobile ? "hover:-translate-y-2" : "active:scale-95 translate-y-0"}`}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-[100px] pointer-events-none" />
                                    
                                    <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-accent/20 transition-colors relative z-10 ${!isMobile ? "animate-float" : ""}`}
                                        style={!isMobile ? { animationDelay: `${index * 150}ms` } : {}}
                                    >
                                        <TechIcon 
                                            name={skillName} 
                                            icon={skillIcon} 
                                            className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity" 
                                        />
                                    </div>
                                    
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                                        {skillName}
                                    </h3>

                                    {/* Minimalist Progress Meter */}
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 delay-500"
                                            style={{ width: `${60 + (index % 4) * 10}%` }}
                                        />
                                    </div>
                                </div>
                            </StaggeredItem>
                        );
                    })}
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        </AnimatedSection>
    );
}
