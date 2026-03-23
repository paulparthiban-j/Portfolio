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
                            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
                        >
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[100px] z-0" />
                            
                            {/* Accent Blobs */}
                            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px] animate-pulse" />
                            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] animate-pulse delay-1000" />

                            <div className="container mx-auto max-w-4xl relative z-10 text-center">
                                <ScrollSection animationType="slide-down" className="mb-20">
                                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                                        <span className="opacity-20 mr-4">{(index + 1).toString().padStart(2, '0')}.</span>
                                        {section.title.toUpperCase()}
                                    </h2>
                                </ScrollSection>
                                <ScrollSection animationType="slide-up">
                                    <div className="glass-premium rounded-[3rem] p-12 md:p-20 border-white/5 text-2xl font-light leading-relaxed text-slate-300">
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
