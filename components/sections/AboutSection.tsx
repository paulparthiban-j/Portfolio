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
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl z-0" />
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">01.</span> THE STORY
                    </h2>
                </ScrollSection>

                <div className="grid gap-16 lg:grid-cols-2 items-start">
                    <ScrollSection animationType="slide-right">
                        <div className="glass-premium rounded-[3rem] p-10 md:p-16 border-white/5 relative group">
                            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-accent/40 rounded-tl-3xl" />
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary/40 rounded-br-3xl" />
                            
                            <h3 className="text-4xl font-bold text-white mb-8 tracking-tight">Identity</h3>
                            <div className="space-y-6">
                                {[
                                    { text: content.email, label: "Email", icon: "📧", color: "from-blue-500/20 to-indigo-500/20" },
                                    { text: content.phone, label: "Phone", icon: "📱", color: "from-purple-500/20 to-pink-500/20" },
                                    { text: content.location, label: "Base", icon: "📍", color: "from-emerald-500/20 to-teal-500/20" }
                                ].map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="group/item flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500 cursor-pointer animate-float-up"
                                        style={{ animationDelay: `${i * 200}ms` }}
                                    >
                                        <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-2xl group-hover/item:scale-110 transition-transform`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">{item.label}</p>
                                            <span className="text-slate-200 text-lg font-medium">{item.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollSection>

                    <ScrollSection animationType="slide-left">
                        <div className="space-y-12">
                            <div className="glass-premium rounded-[3rem] p-10 md:p-14 border-white/5">
                                <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                                    <span className="w-12 h-1 bg-accent rounded-full" /> Specialized In
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {content.skills.map((skill: string | Skill, index: number) => (
                                        <StaggeredItem key={index} index={index}>
                                            <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 font-bold hover:bg-accent/20 hover:text-white hover:border-accent/40 transition-all cursor-default select-none">
                                                {typeof skill === 'string' ? skill : skill.name}
                                            </div>
                                        </StaggeredItem>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-1 text-center">
                                <p className="text-2xl text-slate-400 font-light leading-relaxed italic">
                                    &ldquo;Architecting the future through clean code and innovative design systems.&rdquo;
                                </p>
                            </div>
                        </div>
                    </ScrollSection>
                </div>
            </div>
        </AnimatedSection>
    );
}
