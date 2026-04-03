"use client";

import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { motion } from "framer-motion";

interface ExperienceSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
    if (!content) return null;

    const experience = content.experience || [];

    return (
        <section className="min-h-screen w-full bg-[#0a0a0b] py-16 md:py-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-16 text-center">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
                        {content.experienceTitle || "EXPERIENCE"}
                    </h2>
                    <div className="h-1 w-20 bg-indigo-600 rounded-full mt-6 mx-auto" />
                </ScrollSection>

                {experience.length === 0 ? (
                    <p className="text-slate-500 text-center text-lg">No experience listed yet.</p>
                ) : (
                    <div className="space-y-12 w-full">
                        {experience.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative pl-8 md:pl-12 border-l-2 border-white/5 hover:border-indigo-500/50 transition-all duration-500 pb-12 last:pb-0"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-[#0a0a0b] border-2 border-white/10 group-hover:border-indigo-500 group-hover:scale-125 transition-all duration-500" />
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-indigo-400 transition-colors">
                                            {exp.company}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                            <h4 className="text-base md:text-xl font-bold text-slate-300 uppercase tracking-widest">
                                                {exp.position}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-start">
                                        <span className="text-[10px] md:text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl uppercase tracking-[0.2em] whitespace-nowrap shadow-xl shadow-indigo-500/5">
                                            {exp.duration}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-10 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-500">
                                    <p className="text-slate-400 text-lg md:text-2xl leading-relaxed font-medium">
                                        {exp.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
