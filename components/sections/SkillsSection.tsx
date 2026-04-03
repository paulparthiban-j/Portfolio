"use client";

import { PortfolioContent, Skill } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { TechIcon } from "@/components/ui/TechIcon";
import { motion } from "framer-motion";

interface SkillsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function SkillsSection({ content }: SkillsSectionProps) {
    if (!content) return null;

    const skills = content.skills || [];

    return (
        <section className="w-full bg-[#0d0d0f] py-12 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                {/* Heading */}
                <ScrollSection animationType="slide-down" className="mb-12 md:mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                        {content.skillsTitle || "THE STACK"}
                    </h2>
                    <p className="text-slate-500 text-sm md:text-lg mt-4 max-w-xl mx-auto font-medium">
                        Tools and technologies I work with daily.
                    </p>
                    <div className="h-1 w-20 bg-indigo-600 rounded-full mt-4 mx-auto" />
                </ScrollSection>

                {/* Skills grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8">
                    {skills.map((skill: string | Skill, index: number) => {
                        const name = typeof skill === "string" ? skill : skill.name;
                        const icon = typeof skill === "string" ? "" : (skill.icon || "");

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-4 group cursor-default"
                            >
                                {/* Icon card */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-600/10 group-hover:scale-105 transition-all duration-300 overflow-hidden">
                                    <TechIcon
                                        name={name}
                                        icon={icon}
                                        className="w-10 h-10 md:w-12 md:h-12"
                                    />
                                </div>
                                {/* Label */}
                                <span className="text-xs md:text-sm font-semibold text-slate-500 group-hover:text-white uppercase tracking-wider text-center transition-colors duration-300 leading-tight">
                                    {name}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
