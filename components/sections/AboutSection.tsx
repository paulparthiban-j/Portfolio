"use client";

import { motion } from "framer-motion";
import { PortfolioContent, Skill } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AboutSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function AboutSection({ content, isActive, sectionIndex }: AboutSectionProps) {
    const isMobile = useIsMobile();
    if (!content) return null;

    const skills = (content.skills || []).slice(0, 6);

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`min-h-screen relative py-32 md:py-44 px-6 md:px-12 flex items-center justify-center overflow-hidden bg-black`}
        >
            <div className="absolute inset-0 bg-[#0a0a0b] z-0" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                    {/* Left Side: Massive Visual / Identity */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <ScrollSection animationType="slide-left" className="mb-10 w-full">
                            <h2 className="text-5xl md:text-9xl font-black tracking-tighter text-white mb-6 uppercase leading-none">
                                <span className="opacity-30 block">01.</span> WHO AM I
                            </h2>
                            <div className="h-2 w-32 bg-indigo-600 rounded-full mb-10 hidden lg:block" />
                        </ScrollSection>

                        <div className="relative group p-10 md:p-14 glass-premium rounded-5xl border border-white/5 transition-all duration-700 hover:border-indigo-500/30 hover:scale-[1.01] max-w-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none" />
                            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium mb-10">
                                {content.description}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-white/10">
                                <div className="flex -space-x-4">
                                    {skills.filter(s => typeof s !== 'string').map((skill: any, i) => (
                                        <div key={i} className="w-14 h-14 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl overflow-hidden">
                                           <img src={skill.icon || `https://cdn.simpleicons.org/${skill.name.toLowerCase()}/fff`} className="w-6 h-6 object-contain" alt="" />
                                        </div>
                                    ))}
                                    {skills.length > 0 && <div className="w-14 h-14 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-xl">+Expertise</div>}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-black text-white uppercase tracking-widest">Base of Operations</div>
                                    <div className="text-xs text-indigo-400 font-bold uppercase">{content.location || "Tirunelveli, India"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Identity Details Grid */}
                    <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <InfoCard 
                            title="CORE MISSIONS" 
                            value={content.title} 
                            desc="Current primary focus and role" 
                            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        />
                        <InfoCard 
                            title="SIGNAL BASE" 
                            value={content.email} 
                            desc="Primary contact frequency" 
                            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        />
                        <InfoCard 
                            title="HISTORY" 
                            value={(content.experience || []).length > 0 ? content.experience[0].company : "Freelance"} 
                            desc="Most recent deployment" 
                            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        />
                        <InfoCard 
                            title="STATUS" 
                            value="AVAILABLE FOR HIRE" 
                            desc="Current availability for missions" 
                            icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

function InfoCard({ title, value, desc, icon }: { title: string; value: string; desc: string; icon: React.ReactNode }) {
    return (
        <div className="glass-premium p-10 rounded-5xl border border-white/5 relative group transition-all duration-700 hover:border-indigo-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-95">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 mb-8 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
                {icon}
            </div>
            <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-4">{title}</h4>
            <div className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2 truncate group-hover:text-indigo-400 transition-colors">
                {value}
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{desc}</p>
        </div>
    );
}
