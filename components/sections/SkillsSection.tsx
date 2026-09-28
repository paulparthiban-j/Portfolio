"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioContent, Skill } from "@/types/portfolio";
import { SectionHeading, staggerContainer, inViewOnce, EASE_OUT_EXPO } from "@/components/ui/motion";
import { TechIcon } from "@/components/ui/TechIcon";

interface SkillsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

// Skill categories - keep these strings in sync with the exact names in
// data/portfolio.json's `skills` array, since the filter below matches by
// exact string equality (a skill that doesn't match any category is only
// reachable via "All").
const skillCategories = {
    "Frontend": ["JavaScript (ES6+)", "TypeScript", "React 19", "React Native", "Flutter", "Tailwind CSS", "Zustand", "React Query", "React Hook Form", "ECharts"],
    "Backend": ["C#", "Java", "Python", "PHP", "Node.js", "Express.js", ".NET 10 Web API", "Spring Boot", "RESTful APIs", "SignalR", "SAP API Integration"],
    "Database": ["SQL Server", "MySQL", "Entity Framework Core", "Dapper", "Sequelize ORM"],
    "DevOps": ["Git", "Vite", "CI/CD Workflows", "Agile/Scrum", "Windows Server", "IIS", "AWS EC2", "Vercel"],
    "Tools": ["JWT", "OAuth 2.0", "RBAC", "Device Fingerprinting", "Linux (Ubuntu)", "Sentry", "Swagger", "WinSCP"],
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
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <SectionHeading
                    title={content.skillsTitle || "THE STACK"}
                    subtitle="Tools and technologies I work with daily."
                    className="mb-16 md:mb-20"
                />

                {/* Category Filter - the active pill slides between tabs (shared layoutId) */}
                <motion.div
                    className="mb-12 flex flex-wrap justify-center gap-2 md:gap-3"
                    initial="hidden"
                    whileInView="show"
                    viewport={inViewOnce}
                    variants={staggerContainer(0.05)}
                >
                    {categories.map((category) => {
                        const active = activeCategory === category;
                        return (
                            <motion.button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                variants={{
                                    hidden: { opacity: 0, y: 16 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
                                }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.94 }}
                                aria-pressed={active}
                                className={`relative px-5 md:px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                                    active ? "text-white" : "text-slate-400 hover:text-white bg-white/5 border border-white/10"
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="skills-active-pill"
                                        className="absolute inset-0 rounded-full bg-violet-600 shadow-lg shadow-violet-500/30"
                                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                    />
                                )}
                                <span className="relative">{category}</span>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Skills grid - items keep their identity across filters, so the
                    ones that stay glide to their new slots while the rest pop out */}
                <motion.div
                    layout
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8"
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        {filteredSkills.map((skill: string | Skill, index: number) => {
                            const name = typeof skill === "string" ? skill : skill.name;
                            const icon = typeof skill === "string" ? "" : (skill.icon || "");

                            return (
                                <motion.div
                                    key={name}
                                    layout
                                    initial={{ opacity: 0, scale: 0.6, y: 24 }}
                                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                    viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                                    exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 22,
                                        delay: (index % 6) * 0.04,
                                    }}
                                    className="flex flex-col items-center gap-4 group cursor-default"
                                >
                                    <motion.div
                                        whileHover={{ y: -8, rotate: -4, scale: 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                        className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer group-hover:border-violet-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-[border-color,box-shadow] duration-300"
                                    >
                                        {/* Sheen that sweeps across on hover */}
                                        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <TechIcon
                                            name={name}
                                            icon={icon}
                                            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                                        />
                                    </motion.div>
                                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-400 group-hover:text-violet-400 uppercase tracking-wider text-center transition-colors duration-200 leading-tight">
                                        {name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {filteredSkills.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-slate-400 text-lg">No skills in this category.</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
