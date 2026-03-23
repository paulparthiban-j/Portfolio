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
        <section className="min-h-screen w-full bg-[#0a0a0b] py-24 md:py-32 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
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
                    <div className="flex flex-col gap-6 md:gap-8">
                        {experience.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.99 }}
                                className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-10 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
                            >
                                {/* Top row: company + duration */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                        {exp.company}
                                    </h3>
                                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                                        {exp.duration}
                                    </span>
                                </div>

                                {/* Position */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-1 h-5 bg-indigo-500 rounded-full" />
                                    <h4 className="text-base md:text-lg font-semibold text-slate-400 uppercase tracking-wide">
                                        {exp.position}
                                    </h4>
                                </div>

                                {/* Description */}
                                <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                                    {exp.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
