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
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
            <div className="container mx-auto max-w-6xl relative z-10">
                <ScrollSection animationType="slide-down">
                    <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>The Stack</h2>
                </ScrollSection>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {content.skills.map((skill: string | Skill, index: number) => (
                        <StaggeredItem key={index} index={index} delay={80}>
                            <div className={`card card-premium glass border-white/5 hover:border-${content.theme?.accent || 'indigo-500'}/30 group`}>
                                <div className="card-body p-10 flex flex-col items-center text-center">
                                    <div className="mb-6 transform group-hover:rotate-12 transition-transform">
                                        <TechIcon
                                            name={typeof skill === 'string' ? skill : skill.name}
                                            icon={typeof skill === 'object' ? skill.icon : undefined}
                                            className="w-20 h-20 rounded-2xl"
                                            theme={content.theme}
                                        />
                                    </div>
                                    <h3 className={`text-2xl font-bold ${content.theme?.mode === 'light' ? 'text-slate-800' : 'text-white'} mb-2`}>
                                        {typeof skill === 'string' ? skill : skill.name}
                                    </h3>
                                    <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-500 to-purple-500'} w-[85%] animate-pulse`}></div>
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
