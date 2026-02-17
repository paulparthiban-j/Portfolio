"use client";

import { PortfolioContent, Skill } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";

interface AboutSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function AboutSection({ content, isActive, sectionIndex }: AboutSectionProps) {
    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>
            <div className="container mx-auto max-w-6xl relative z-10">
                <ScrollSection animationType="slide-down">
                    <h2 className="mb-20 text-center text-5xl md:text-7xl font-black">
                        <span className={`gradient-text-vibrant bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'}`}>About Me</span>
                    </h2>
                </ScrollSection>
                <ScrollSection animationType="scale-in">
                    <div className="glass-dark rounded-[2.5rem] p-8 md:p-16 border-white/5 shadow-2xl overflow-hidden relative group">
                        <div className="grid gap-12 md:grid-cols-2 items-center">
                            <div className="space-y-8">
                                <ScrollSection animationType="slide-right">
                                    <div className="flex items-center gap-6 p-6 glass border-white/10 rounded-2xl hover-lift" role="group" aria-label="Email contact information">
                                        <div className={`w-12 h-12 flex items-center justify-center bg-${content.theme?.accent || 'indigo-500'}/20 rounded-xl text-${content.theme?.accent || 'indigo-400'}`} aria-hidden="true">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <span className={`${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-200'} text-lg font-medium`}>{content.email}</span>
                                    </div>
                                </ScrollSection>
                                <ScrollSection animationType="slide-right">
                                    <div className="flex items-center gap-6 p-6 glass border-white/10 rounded-2xl hover-lift text-blue-400" role="group" aria-label="Phone contact information">
                                        <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-xl" aria-hidden="true">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <span className={`${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-200'} text-lg font-medium`}>{content.phone}</span>
                                    </div>
                                </ScrollSection>
                                <ScrollSection animationType="slide-right">
                                    <div className="flex items-center gap-6 p-6 glass border-white/10 rounded-2xl hover-lift text-purple-400" role="group" aria-label="Location information">
                                        <div className="w-12 h-12 flex items-center justify-center bg-purple-500/20 rounded-xl" aria-hidden="true">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <span className={`${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-200'} text-lg font-medium`}>{content.location}</span>
                                    </div>
                                </ScrollSection>
                            </div>
                            <div className={`${content.theme?.mode === 'light' ? 'bg-slate-900/5' : 'bg-white/5'} rounded-3xl p-8 border border-white/10`}>
                                <h3 className={`text-3xl font-bold ${content.theme?.mode === 'light' ? 'text-slate-800' : 'text-white'} mb-6 leading-tight`}>Expertise in Modern Web Technologies</h3>
                                <div className="flex flex-wrap gap-3 items-start">
                                    {content.skills.map((skill: string | Skill, index: number) => (
                                        <StaggeredItem key={index} index={index}>
                                            <div className={`badge glass-dark text-${content.theme?.accent || 'indigo-300'} border-${content.theme?.accent || 'indigo-500'}/30 px-5 py-6 text-base font-semibold rounded-xl badge-glow`}>
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </div>
                                        </StaggeredItem>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollSection>
            </div>
        </AnimatedSection>
    );
}
