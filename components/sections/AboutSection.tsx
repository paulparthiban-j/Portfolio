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
    if (!content) return null;

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <ScrollSection animationType="slide-right">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                            <div className="glass-premium rounded-[3rem] p-10 md:p-14 border-white/5 relative overflow-hidden">
                                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                                    <span className="opacity-30">02.</span><br />
                                    THE IDENTITY
                                </h2>
                                <p className="text-2xl text-slate-400 font-light leading-relaxed mb-10">
                                    {content.description}
                                </p>
                                
                                <div className="space-y-6">
                                    {[
                                        { label: "Email", value: content.email || "Not Provided" },
                                        { label: "Location", value: content.location || "Earth" },
                                        { label: "Availability", value: "Ready for Launch" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-6 group/item">
                                            <div className="w-12 h-1 bg-white/10 rounded-full group-hover/item:w-20 group-hover/item:bg-accent transition-all duration-500" />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">{item.label}</p>
                                                <p className="text-xl font-bold text-white">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollSection>

                    <ScrollSection animationType="slide-left">
                        <div className="grid grid-cols-2 gap-6">
                            {(content.skills || []).slice(0, 6).map((skill: string | Skill, index: number) => (
                                <StaggeredItem key={index} index={index}>
                                    <div className="glass-premium rounded-3xl p-8 border-white/5 hover:border-accent/40 transition-colors group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 mb-6 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-widest leading-tight">
                                            {typeof skill === 'string' ? skill : skill.name}
                                        </h3>
                                    </div>
                                </StaggeredItem>
                            ))}
                        </div>
                    </ScrollSection>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        </AnimatedSection>
    );
}
