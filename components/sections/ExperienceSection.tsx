"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "framer-motion";
import { PortfolioContent, Experience } from "@/types/portfolio";
import { SectionHeading, SpotlightCard, EASE_OUT_EXPO } from "@/components/ui/motion";


interface ExperienceSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
    if (!content) return null;

    const experience = content.experience || [];

    return <ExperienceTimeline content={content} experience={experience} />;
}

function ExperienceTimeline({ content, experience }: { content: PortfolioContent; experience: Experience[] }) {
    // The timeline's glowing line fills in as the list scrolls past the middle of the screen
    const listRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    return (
        <section className="w-full bg-[#0A0A0B] py-16 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden">
            <div className="hidden md:block absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10 w-full">
                <SectionHeading title={content.experienceTitle || "EXPERIENCE"} className="mb-16 md:mb-20" />

                {experience.length === 0 ? (
                    <p className="text-slate-400 text-center text-lg">No experience listed yet.</p>
                ) : (
                    <div ref={listRef} className="relative space-y-8 md:space-y-12 w-full">
                        {/* Track + scroll-driven fill */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/10" />
                        <m.div
                            aria-hidden="true"
                            className="absolute left-0 top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-violet-400 via-fuchsia-500 to-violet-600 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                            style={{ scaleY: progress }}
                        />
                        {experience.map((exp, index) => (
                            <ExperienceItem key={index} exp={exp} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function ExperienceItem({ exp, index }: { exp: Experience; index: number }) {
    return (
        <m.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="group relative pl-8 md:pl-12 pb-8 md:pb-12 last:pb-0"
        >
            {/* Timeline dot pops in when the entry is reached */}
            <m.div
                className="absolute top-0 left-[-7px] w-4 h-4"
                variants={{
                    hidden: { scale: 0 },
                    show: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 15, delay: 0.1 } },
                }}
            >
                <span className="absolute inset-0 rounded-full bg-violet-500/40 animate-ping [animation-duration:2.5s]" />
                <span className="relative block w-4 h-4 rounded-full bg-[#0A0A0B] border-2 border-violet-400 group-hover:bg-violet-500 transition-colors duration-300" />
            </m.div>

            <m.div
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
                variants={{
                    hidden: { opacity: 0, x: -40 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 } },
                }}
            >
                <div>
                    <h3
                        className="text-xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-violet-400 transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                        {exp.company}
                    </h3>
                    <div className="flex items-center gap-3 mt-4">
                        <m.div
                            className="w-1.5 h-6 bg-violet-500 rounded-full origin-bottom"
                            variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.6, delay: 0.4, ease: EASE_OUT_EXPO } } }}
                        />
                        <h4 className="text-base md:text-xl font-bold text-slate-300 uppercase tracking-widest">
                            {exp.position}
                        </h4>
                    </div>
                </div>
                <m.div
                    className="shrink-0 flex items-start"
                    variants={{
                        hidden: { opacity: 0, scale: 0.6, rotate: -8 },
                        show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 18, delay: 0.35 } },
                    }}
                >
                    <span className="text-[11px] md:text-xs font-black text-violet-300 bg-violet-500/15 border border-violet-500/30 px-3 py-1 sm:px-4 sm:py-2 rounded-xl uppercase tracking-[0.2em] whitespace-nowrap">
                        {exp.duration}
                    </span>
                </m.div>
            </m.div>

            <SpotlightCard
                className="rounded-[2rem]"
                variants={{
                    hidden: { opacity: 0, y: 30, rotateX: 12 },
                    show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.25 + (index % 2) * 0.05 } },
                }}
            >
                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 md:p-8">
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                        {exp.description}
                    </p>
                </div>
            </SpotlightCard>
        </m.div>
    );
}
