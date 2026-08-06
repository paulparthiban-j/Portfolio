"use client";

import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { motion } from "framer-motion";

interface EducationSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function EducationSection({ content }: EducationSectionProps) {
    if (!content) return null;

    const education = content.education || [];

    return (
        <section className="w-full bg-[#0A0A0B] py-16 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-16 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {content.educationTitle || "EDUCATION"}
                    </h2>
                    <div className="h-1 w-24 bg-emerald-600 rounded-full mt-6 mx-auto" />
                </ScrollSection>

                {education.length === 0 ? (
                    <p className="text-slate-500 text-center text-lg">No education listed yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
                        {education.map((edu, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.99 }}
                                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all duration-200 flex flex-col gap-4 relative cursor-pointer interaction-lift"
                            >
                                {/* Year badge */}
                                <div className="absolute top-6 right-6">
                                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {edu.year}
                                    </span>
                                </div>

                                {/* Degree */}
                                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug pr-20">
                                    {edu.degree}
                                </h3>

                                {/* Institution & GPA */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                        <p className="text-base text-slate-400 font-medium">
                                            {edu.institution}
                                        </p>
                                    </div>
                                    {edu.gpa && (
                                        <div className="flex items-center gap-3 ml-4">
                                            <span className="text-sm text-emerald-400/80 font-bold tracking-widest uppercase">
                                                GPA: {edu.gpa}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
