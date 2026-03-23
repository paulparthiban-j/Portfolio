"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";

interface AboutSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

const stats = [
    { number: 50, label: "Projects Completed", suffix: "+" },
    { number: 4, label: "Years Experience", suffix: "+" },
    { number: 10, label: "Technologies", suffix: "+" },
    { number: 200, label: "Commits This Year", suffix: "+" },
];

export function AboutSection({ content }: AboutSectionProps) {
    if (!content) return null;

    return (
        <section className="min-h-screen w-full bg-[#0a0a0b] py-24 md:py-32 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
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

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left: Description card */}
                    <ScrollSection animationType="slide-right" className="w-full">
                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 hover:border-indigo-500/30 transition-all duration-500">
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
                    <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                        {stats.map((stat, i) => (
                            <CounterCard key={i} target={stat.number} label={stat.label} suffix={stat.suffix} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CounterCard({ target, label, suffix, index }: { target: number; label: string; suffix: string; index: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, target, {
                duration: 2,
                onUpdate(value) { setCount(Math.floor(value)); },
                ease: "easeOut",
            });
            return () => controls.stop();
        }
    }, [isInView, target]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center flex flex-col items-center justify-center hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all duration-500 cursor-default"
        >
            <div className="text-4xl md:text-6xl font-black text-indigo-400 mb-2 tracking-tighter tabular-nums">
                {count}<span className="text-indigo-500/60">{suffix}</span>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">
                {label}
            </p>
        </motion.div>
    );
}
