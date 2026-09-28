"use client";

import { motion } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";


interface ExperienceSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
    if (!content) return null;

    const experience = content.experience || [];

    return (
        <section className="w-full bg-[#0A0A0B] py-16 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            <div className="hidden md:block absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-16 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {content.experienceTitle || "EXPERIENCE"}
                    </h2>
                    <div className="h-1 w-24 bg-violet-600 rounded-full mt-6 mx-auto" />
                </ScrollSection>

                {experience.length === 0 ? (
                    <p className="text-slate-400 text-center text-lg">No experience listed yet.</p>
                ) : (
                    <div className="space-y-8 md:space-y-12 w-full">
                        {experience.map((exp, index) => (
                            <ExperienceItem key={index} exp={exp} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function ExperienceItem({ exp }: { exp: any }) {
    // Reveal once on entry. The old scroll-linked opacity/scale faded items back
    // out near the viewport edges, which left them half-invisible on phones.
    return (
        <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative pl-8 md:pl-12 border-l-2 border-white/10 hover:border-violet-500/50 transition-colors duration-500 pb-8 md:pb-12 last:pb-0 cursor-pointer"
        >
            {/* Timeline Dot — ping ring uses transform/opacity only (compositor-friendly) */}
            <div className="absolute top-0 left-[-9px] w-4 h-4">
                <span className="absolute inset-0 rounded-full bg-violet-500/40 animate-ping [animation-duration:2.5s]" />
                <span className="relative block w-4 h-4 rounded-full bg-[#0A0A0B] border-2 border-violet-500/60 group-hover:border-violet-400 transition-colors duration-300" />
            </div>
            
            {/* Connecting Line — scaleY instead of animating height (no layout per frame) */}
            <motion.div
                className="absolute left-[-5px] top-0 h-full w-[2px] origin-top bg-gradient-to-b from-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h3
                        className="text-xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-violet-400 transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                        {exp.company}
                    </h3>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
                        <h4 className="text-base md:text-xl font-bold text-slate-300 uppercase tracking-widest">
                            {exp.position}
                        </h4>
                    </div>
                </div>
                <div className="shrink-0 flex items-start">
                    <span className="text-[10px] md:text-xs font-black text-violet-300 bg-violet-500/15 border border-violet-500/30 px-3 py-1 sm:px-4 sm:py-2 rounded-xl uppercase tracking-[0.2em] whitespace-nowrap">
                        {exp.duration}
                    </span>
                </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 md:p-8 group-hover:bg-white/[0.05] group-hover:border-violet-500/20 transition-colors duration-500">
                <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                    {exp.description}
                </p>
            </div>
        </motion.div>
    );
}
