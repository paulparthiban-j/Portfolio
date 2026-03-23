"use client";

import { PortfolioContent, Skill } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";
import { TechIcon } from "@/components/ui/TechIcon";

interface SkillsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function SkillsSection({ content, isActive, sectionIndex }: SkillsSectionProps) {
    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">02.</span> THE TECH
                    </h2>
                </ScrollSection>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {content.skills.map((skill: string | Skill, index: number) => {
                        const skillName = typeof skill === 'string' ? skill : skill.name;
                        const skillIcon = typeof skill === 'object' ? skill.icon : undefined;
                        
                        return (
                            <StaggeredItem key={index} index={index}>
                                <div className="glass-premium rounded-[2.5rem] p-10 flex flex-col items-center group relative overflow-hidden border-white/5 hover:border-accent/30 transition-all duration-700">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] group-hover:bg-accent/20 transition-all" />
                                    
                                    <div className="mb-8 relative group-hover:scale-110 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative z-10 animate-float" style={{ animationDelay: `${index * 150}ms` }}>
                                            <TechIcon
                                                name={skillName}
                                                icon={skillIcon}
                                                className="w-20 h-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                                theme={content.theme}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-6 group-hover:text-accent transition-colors">
                                        {skillName}
                                    </h3>

                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-[10px] font-black tracking-[0.2em] text-white/40">
                                            <span>MASTERY</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-500 to-purple-500'} group-hover:w-full transition-all duration-1000 ease-out`}
                                                style={{ width: '85%' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </StaggeredItem>
                        );
                    })}
                </div>
            </div>
        </AnimatedSection>
    );
}
