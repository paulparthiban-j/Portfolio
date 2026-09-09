"use client";

import { motion } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { Counter } from "@/components/ui/Counter";
import { LiveBadge } from "@/components/ui/LiveBadge";

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
        <section className="w-full bg-[#0A0A0B] py-16 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                {/* Heading */}
                <ScrollSection animationType="slide-down" className="mb-16 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {content.aboutTitle || "WHO AM I"}
                    </h2>
                    <div className="h-1 w-24 bg-emerald-600 rounded-full mt-6 mx-auto" />
                </ScrollSection>

                <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Main description card - spans 2 columns */}
                    <ScrollSection animationType="slide-right" className="lg:col-span-2 w-full">
                        <div className="relative group h-full">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[#1E293B] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-14 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer interaction-lift h-full flex flex-col">
                                {content.boldStatement && (
                                    <h3 className="text-xl md:text-3xl font-black text-white mb-6 leading-tight tracking-tighter uppercase italic" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                                        "{content.boldStatement}"
                                    </h3>
                                )}
                                <p className="text-base md:text-lg text-slate-300 leading-relaxed font-bold mb-8">
                                    {content.description}
                                </p>
                                
                                <div className="space-y-6 pt-10 border-t border-white/10 mt-auto">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Impact-First Thinking</h4>
                                            <p className="text-slate-400 text-sm font-medium">I don't just write code; I solve bottlenecks that cost businesses time and money.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
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

                    {/* Stats grid - bento style */}
                    <ScrollSection animationType="slide-left" className="lg:col-span-2 w-full">
                        <div className="grid grid-cols-2 gap-4 md:gap-6 h-full">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                                    className="group relative h-full"
                                    style={{ 
                                        gridColumn: i === 0 ? 'span 2' : 'span 1',
                                        gridRow: i === 0 ? 'span 2' : 'span 1'
                                    }}
                                >
                                    <div className="relative text-center p-6 md:p-12 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.05] transition-all duration-500 h-full flex flex-col justify-center overflow-hidden">
                                        {stat.label === "Years Experience" && (
                                            <LiveBadge label="Auto-updating" className="absolute top-4 right-4 md:top-6 md:right-6 text-emerald-400" />
                                        )}
                                        <div className="text-4xl md:text-7xl font-black text-white mb-3">
                                            <Counter target={stat.number} suffix={stat.suffix} className={`bg-gradient-to-br ${i % 2 === 0 ? "from-emerald-400 to-emerald-600" : "from-indigo-400 to-indigo-600"} bg-clip-text text-transparent`} />
                                        </div>
                                        <div className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-[0.2em] truncate w-full px-2" title={stat.label}>
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollSection>
                </div>
            </div>
        </section>
    );
}
