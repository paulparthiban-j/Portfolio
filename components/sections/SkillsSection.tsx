"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioContent, Skill } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { TechIcon } from "@/components/ui/TechIcon";

interface SkillsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

// Skill categories
const skillCategories = {
    "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    "Backend": ["Node.js", ".NET", "Python", "GraphQL", "REST APIs"],
    "Database": ["PostgreSQL", "MongoDB", "Redis", "SQL Server"],
    "DevOps": ["Docker", "AWS", "CI/CD", "Git"],
    "Tools": ["VS Code", "Figma", "Postman", "Linux"],
};

export function SkillsSection({ content }: SkillsSectionProps) {
    const [activeCategory, setActiveCategory] = useState<string>("All");
    
    if (!content) return null;

    const skills = content.skills || [];
    const categories = ["All", ...Object.keys(skillCategories)];

    const filteredSkills = activeCategory === "All" 
        ? skills 
        : skills.filter((skill: string | Skill) => {
            const name = typeof skill === "string" ? skill : skill.name;
            return skillCategories[activeCategory as keyof typeof skillCategories]?.includes(name);
        });

    return (
        <section className="w-full bg-[#0A0A0B] py-16 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                {/* Heading */}
                <ScrollSection animationType="slide-down" className="mb-16 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {content.skillsTitle || "THE STACK"}
                    </h2>
                    <p className="text-slate-500 text-sm md:text-lg mt-4 max-w-xl mx-auto font-medium">
                        Tools and technologies I work with daily.
                    </p>
                    <div className="h-1 w-24 bg-emerald-600 rounded-full mt-6 mx-auto" />
                </ScrollSection>

                {/* Category Filter */}
                <ScrollSection animationType="fade-in" className="mb-12">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                    activeCategory === category
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
                                }`}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </ScrollSection>

                {/* Skills grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8"
                    >
                        {filteredSkills.map((skill: string | Skill, index: number) => {
                            const name = typeof skill === "string" ? skill : skill.name;
                            const icon = typeof skill === "string" ? "" : (skill.icon || "");

                            return (
                                <motion.div
                                    key={`${activeCategory}-${index}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    whileHover={{ scale: 1.1, rotate: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center gap-4 group cursor-default"
                                >
                                    {/* Icon card with 3D effect */}
                                    <motion.div
                                        whileHover={{ 
                                            boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
                                            borderColor: "rgba(16, 185, 129, 0.5)"
                                        }}
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer interaction-lift"
                                    >
                                        <TechIcon
                                            name={name}
                                            icon={icon}
                                            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                                        />
                                    </motion.div>
                                    {/* Label */}
                                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-500 group-hover:text-emerald-400 uppercase tracking-wider text-center transition-colors duration-200 leading-tight">
                                        {name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {filteredSkills.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-slate-500 text-lg">No skills in this category.</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
