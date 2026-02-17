"use client";

import { PortfolioContent, CustomSection } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";

interface CustomSectionsProps {
    content: PortfolioContent;
    activeIndex: number;
}

export function CustomSections({ content, activeIndex }: CustomSectionsProps) {
    return (
        <>
            {(content.customSections || []).map((section: CustomSection, sIdx: number) => {
                const index = 6 + sIdx;
                return (
                    <div key={sIdx} data-section-index={index} className="section-wrapper full-page-section">
                        <AnimatedSection
                            sectionIndex={index}
                            isActive={activeIndex === index}
                            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}
                        >
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
                            <div className="container mx-auto max-w-6xl relative z-10 text-center">
                                <ScrollSection animationType="slide-down">
                                    <h2 className={`mb-12 text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>{section.title}</h2>
                                </ScrollSection>
                                <ScrollSection animationType="slide-up">
                                    <div className={`p-10 ${content.theme?.mode === 'light' ? 'bg-white/80' : 'bg-white/5'} rounded-[2.5rem] border border-white/10 text-xl leading-relaxed ${content.theme?.mode === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {section.content}
                                    </div>
                                </ScrollSection>
                            </div>
                        </AnimatedSection>
                    </div>
                );
            })}
        </>
    );
}
