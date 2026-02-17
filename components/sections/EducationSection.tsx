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
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>
            <div className="container mx-auto max-w-6xl relative z-10">
                <ScrollSection animationType="slide-down">
                    <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>Foundation</h2>
                </ScrollSection>
                <div className="grid gap-10 md:grid-cols-2" role="list">
                    {content.education.map((edu: Education, index: number) => (
                        <StaggeredItem key={index} index={index} delay={150}>
                            <div className="card card-premium glass border-white/5 rounded-[2rem] h-full overflow-hidden" role="listitem">
                                <div className="card-body p-12 relative">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${content.theme?.accent || 'indigo-500'}/10 rounded-bl-[100px]`}></div>
                                    <div className={`badge badge-glow bg-${content.theme?.accent || 'indigo-500'}/20 text-${content.theme?.accent || 'indigo-400'} border-none mb-6 px-4 py-2 font-mono`}>{edu.year}</div>
                                    <h3 className={`card-title ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} text-4xl font-black mb-4 leading-tight`}>{edu.degree}</h3>
                                    <p className={`text-${content.theme?.accent || 'indigo-300'} text-2xl font-semibold mb-2`}>{edu.institution}</p>
                                    <div className="mt-8 flex gap-2">
                                        <span className={`w-12 h-1 bg-${content.theme?.accent || 'indigo-500'} rounded-full`}></span>
                                        <span className={`w-4 h-1 bg-${content.theme?.accent || 'indigo-500'}/30 rounded-full`}></span>
                                        <span className={`w-2 h-1 bg-${content.theme?.accent || 'indigo-500'}/10 rounded-full`}></span>
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
