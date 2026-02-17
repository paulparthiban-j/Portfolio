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
    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
            <div className="container mx-auto max-w-5xl relative z-10">
                <ScrollSection animationType="slide-down">
                    <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} leading-tight`}>Journey</h2>
                </ScrollSection>
                <div className="timeline timeline-vertical" role="list">
                    {content.experience.map((exp: Experience, index: number) => (
                        <StaggeredItem key={index} index={index} delay={200}>
                            <div className="timeline-item mb-12" role="listitem">
                                <div className={`${content.theme?.mode === 'light' ? 'bg-white border-slate-200' : 'glass-dark border-white/10'} timeline-start timeline-box p-10 rounded-3xl w-full max-w-md ml-auto shadow-2xl relative`}>
                                    <div className={`absolute -left-3 top-1/2 w-6 h-6 bg-${content.theme?.accent || 'indigo-500'} rounded-full blur-md`}></div>
                                    <h3 className={`font-extrabold ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} text-2xl mb-1`}>{exp.position}</h3>
                                    <h4 className={`text-${content.theme?.accent || 'indigo-400'} text-xl font-bold mb-3`}>{exp.company}</h4>
                                    <p className={`text-sm text-${content.theme?.accent || 'indigo-300'}/60 font-mono mb-4`}>{exp.duration}</p>
                                    <p className="mt-4 text-slate-400 leading-relaxed">{exp.description}</p>
                                </div>
                                <div className="timeline-middle mx-8">
                                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${content.theme?.primaryGradient || 'from-indigo-500 to-purple-600'} rotate-45 border-4 border-black flex items-center justify-center p-2`}>
                                        <div className="w-full h-full bg-white rounded-full"></div>
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
