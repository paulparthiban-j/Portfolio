"use client";

import { PortfolioContent } from "@/types/portfolio";
import { motion } from "framer-motion";
import { SectionHeading, SpotlightCard, staggerContainer, inViewOnce } from "@/components/ui/motion";

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
            <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                <SectionHeading title={content.educationTitle || "EDUCATION"} className="mb-16 md:mb-20" />

                {education.length === 0 ? (
                    <p className="text-slate-400 text-center text-lg">No education listed yet.</p>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 [perspective:1200px]"
                        initial="hidden"
                        whileInView="show"
                        viewport={inViewOnce}
                        variants={staggerContainer(0.15)}
                    >
                        {education.map((edu, index) => (
                            <SpotlightCard
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, rotateY: index % 2 ? -35 : 35, x: index % 2 ? 60 : -60 },
                                    show: { opacity: 1, rotateY: 0, x: 0, transition: { type: "spring", stiffness: 80, damping: 16 } },
                                }}
                                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/[0.05] transition-colors duration-200 flex flex-col gap-4"
                            >
                                {/* Year badge */}
                                <motion.div
                                    className="absolute top-6 right-6"
                                    initial={{ scale: 0, rotate: -20 }}
                                    whileInView={{ scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.4 + index * 0.15 }}
                                >
                                    <span className="text-xs font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {edu.year}
                                    </span>
                                </motion.div>

                                {/* Degree */}
                                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug pr-20">
                                    {edu.degree}
                                </h3>

                                {/* Institution & GPA */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-4 bg-violet-500 rounded-full" />
                                        <p className="text-base text-slate-400 font-medium">
                                            {edu.institution}
                                        </p>
                                    </div>
                                    {edu.gpa && (
                                        <div className="flex items-center gap-3 ml-4">
                                            <span className="text-sm text-violet-400/80 font-bold tracking-widest uppercase">
                                                GPA: {edu.gpa}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </SpotlightCard>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
