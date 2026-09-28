"use client";

import { motion } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { SectionHeading, SpotlightCard, staggerContainer, riseItem, inViewOnce, EASE_OUT_EXPO } from "@/components/ui/motion";
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
            <div className="hidden md:block absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <SectionHeading title={content.aboutTitle || "WHO AM I"} className="mb-16 md:mb-20" />

                <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Main description card - spans 2 columns */}
                    <motion.div
                        className="lg:col-span-2 w-full"
                        initial={{ opacity: 0, x: -60, rotate: -2 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                        viewport={inViewOnce}
                        transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                    >
                        <SpotlightCard className="h-full rounded-3xl">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-violet-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[#1E293B] border border-white/10 rounded-3xl p-6 sm:p-10 md:p-14 h-full flex flex-col">
                                {content.boldStatement && (
                                    <h3 className="text-xl md:text-3xl font-black text-white mb-6 leading-tight tracking-tighter uppercase italic" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                                        "{content.boldStatement}"
                                    </h3>
                                )}
                                <p className="text-base md:text-lg text-slate-300 leading-relaxed font-bold mb-8">
                                    {content.description}
                                </p>
                                
                                <motion.div
                                    className="space-y-6 pt-10 border-t border-white/10 mt-auto"
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={inViewOnce}
                                    variants={staggerContainer(0.15, 0.3)}
                                >
                                    <motion.div variants={riseItem} className="flex items-start gap-4">
                                        <motion.div whileHover={{ rotate: -10, scale: 1.1 }} className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shrink-0">
                                            <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </motion.div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Impact-First Thinking</h4>
                                            <p className="text-slate-400 text-sm font-medium">I don't just write code; I solve bottlenecks that cost businesses time and money.</p>
                                        </div>
                                    </motion.div>
                                    <motion.div variants={riseItem} className="flex items-start gap-4">
                                        <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 shrink-0">
                                            <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        </motion.div>
                                        <div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Architecture Depth</h4>
                                            <p className="text-slate-400 text-sm font-medium">Expertise in SAP integrations and microservices ensures your systems are as robust as they are fast.</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    {/* Stats grid - bento style */}
                    <motion.div
                        className="lg:col-span-2 w-full grid grid-cols-2 gap-4 md:gap-6"
                        initial="hidden"
                        whileInView="show"
                        viewport={inViewOnce}
                        variants={staggerContainer(0.12, 0.15)}
                    >
                        {stats.map((stat, i) => (
                            <SpotlightCard
                                key={i}
                                variants={riseItem}
                                color={i % 2 === 0 ? "139, 92, 246" : "217, 70, 239"}
                                className={`h-full rounded-3xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                            >
                                <div className="relative text-center p-6 md:p-12 bg-white/[0.03] border border-white/10 rounded-3xl h-full flex flex-col justify-center overflow-hidden">
                                    {stat.label === "Years Experience" && (
                                        <LiveBadge label="Auto-updating" className="absolute top-4 right-4 md:top-6 md:right-6 text-violet-400" />
                                    )}
                                    <div className="text-4xl md:text-7xl font-black text-white mb-3">
                                        <Counter target={stat.number} suffix={stat.suffix} className={`bg-gradient-to-br ${i % 2 === 0 ? "from-violet-400 to-violet-600" : "from-fuchsia-400 to-fuchsia-600"} bg-clip-text text-transparent`} />
                                    </div>
                                    <div className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-[0.2em] truncate w-full px-2" title={stat.label}>
                                        {stat.label}
                                    </div>
                                </div>
                            </SpotlightCard>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
