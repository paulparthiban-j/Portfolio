"use client";

import { PortfolioContent, CustomSection } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";

interface CustomSectionsProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function CustomSections({ content, isActive, sectionIndex }: CustomSectionsProps) {
    if (!content || !content.customSections || content.customSections.length === 0) return null;

    return (
        <>
            {content.customSections.map((section: CustomSection, sIdx: number) => {
                const currentIdx = (sectionIndex || 0) + sIdx;
                
                return (
                    <AnimatedSection
                        key={sIdx}
                        sectionIndex={currentIdx}
                        isActive={isActive}
                        className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-0" />
                        
                        <div className="container mx-auto max-w-7xl relative z-10">
                            <ScrollSection animationType="slide-down" className="mb-24 text-center">
                                <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase">
                                    {section.title}
                                </h2>
                            </ScrollSection>

                            <div className="max-w-4xl mx-auto">
                                <div className="glass-premium rounded-[3rem] p-10 md:p-20 border-white/5 relative group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[150px] pointer-events-none" />
                                    <div className="text-2xl md:text-3xl text-slate-400 font-light leading-relaxed whitespace-pre-wrap">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background elements */}
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
                    </AnimatedSection>
                );
            })}
        </>
    );
}
