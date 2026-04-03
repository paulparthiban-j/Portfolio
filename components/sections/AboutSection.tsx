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
        <section className="w-full bg-[#0a0a0b] py-12 md:py-20 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                {/* Heading */}
                <ScrollSection animationType="slide-down" className="mb-12 md:mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                        {content.aboutTitle || "WHO AM I"}
                    </h2>
                    <div className="h-1 w-20 bg-indigo-600 rounded-full mt-4 mx-auto" />
                </ScrollSection>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Description card */}
                    <ScrollSection animationType="slide-right" className="w-full">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-14 hover:border-indigo-500/30 transition-all duration-300">
                                {content.boldStatement && (
                                    <h3 className="text-xl md:text-3xl font-black text-white mb-6 leading-tight tracking-tighter uppercase italic">
                                        "{content.boldStatement}"
                                    </h3>
                                )}
                                <p className="text-base md:text-lg text-slate-300 leading-relaxed font-bold mb-8">
                                    {content.description}
                                </p>
                                
                                <div className="space-y-6 pt-10 border-t border-white/10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Impact-First Thinking</h4>
                                            <p className="text-slate-400 text-sm font-medium">I don't just write code; I solve bottlenecks that cost businesses time and money.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Architecture Depth</h4>
                                            <p className="text-slate-400 text-sm font-medium">Expertise in SAP integrations and microservices ensures your systems are as robust as they are fast.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollSection>

                    {/* Right: Stats grid */}
                    <div className="grid grid-cols-2 gap-6 md:gap-10 w-full h-full">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                className="group relative h-full"
                            >
                                <div className="text-center p-6 md:p-12 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.05] transition-all duration-500 h-full flex flex-col justify-center overflow-hidden">
                                    <div className="text-4xl md:text-7xl font-black text-white mb-3">
                                        <Counter target={stat.number} suffix={stat.suffix} className={`bg-gradient-to-br ${i % 2 === 0 ? "from-indigo-400 to-indigo-600" : "from-purple-400 to-purple-600"} bg-clip-text text-transparent`} />
                                    </div>
                                    <div className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-[0.2em] truncate w-full px-2" title={stat.label}>
                                        {stat.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
