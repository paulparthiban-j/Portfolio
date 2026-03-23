"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { Counter } from "@/components/ui/Counter";

interface AboutSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function AboutSection({ content }: AboutSectionProps) {
    if (!content) return null;

    // Use stats from content or fallback to default
    const stats = content.stats || [
        { number: 50, label: "Projects Completed", suffix: "+" },
        { number: 4, label: "Years Experience", suffix: "+" },
        { number: 10, label: "Technologies", suffix: "+" },
        { number: 200, label: "Commits This Year", suffix: "+" },
    ];

    return (
        <section className="min-h-screen w-full bg-[#0a0a0b] py-16 md:py-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                {/* Heading */}
                <ScrollSection animationType="slide-down" className="mb-16 text-center">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
                        {content.aboutTitle || "WHO AM I"}
                    </h2>
                    <div className="h-1 w-20 bg-indigo-600 rounded-full mt-6 mx-auto" />
                </ScrollSection>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left: Description card */}
                    <ScrollSection animationType="slide-right" className="w-full">
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-12 hover:border-indigo-500/30 transition-all duration-300">
                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium mb-8">
                                {content.description}
                            </p>
                            <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
                                <span className="text-xs font-black text-white uppercase tracking-widest">Location</span>
                                <span className="text-sm text-indigo-400 font-semibold">{content.location || "India"}</span>
                            </div>
                        </div>
                    </ScrollSection>

                    {/* Right: Stats grid */}
                    <div className="grid grid-cols-2 gap-6 md:gap-8 w-full">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="text-center p-6 md:p-8 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-indigo-500/30 transition-all duration-500"
                            >
                                <div className="text-4xl md:text-6xl font-black text-white mb-2">
                                    <Counter target={stat.number} suffix={stat.suffix} className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent" />
                                </div>
                                <div className="text-sm md:text-base text-slate-400 font-medium uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
