"use client";

import { motion } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";

interface CredibilitySectionProps {
    content: PortfolioContent;
}

export function CredibilitySection({ content }: CredibilitySectionProps) {
    if (!content) return null;

    return (
        <section className="py-12 md:py-20 px-4 sm:px-6 md:px-8 bg-[#0A0A0B] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <ScrollSection animationType="slide-down" className="mb-12 md:mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4 uppercase leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        Proof of Impact
                    </h2>
                    <p className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto font-medium">
                        Validation from industry leaders and continuous technical growth.
                    </p>
                </ScrollSection>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Testimonials */}
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-xs font-black tracking-[0.3em] text-indigo-500 uppercase mb-8">Testimonials</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {content.testimonials?.map((t, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 sm:p-8 bg-white/[0.03] border border-white/5 rounded-3xl relative group hover:border-emerald-500/30 transition-all"
                                >
                                    <svg className="absolute top-6 right-8 w-10 h-10 text-white/5 group-hover:text-emerald-400/10 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                    <p className="text-sm md:text-base text-slate-300 italic leading-relaxed mb-8 relative z-10">
                                        "{t.text}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center font-black text-emerald-400">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm tracking-tight">{t.name}</h4>
                                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications & Activity */}
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-xs font-black tracking-[0.3em] text-indigo-500 uppercase mb-8">Certifications</h3>
                            <div className="space-y-4">
                                {content.certifications?.map((c, i) => (
                                    <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                                        <h4 className="text-white font-bold text-sm group-hover:text-indigo-400 transition-colors">{c.name}</h4>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{c.issuer}</p>
                                            <span className="text-indigo-500/50 text-[10px] font-black uppercase tracking-widest">{c.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black tracking-[0.3em] text-emerald-500 uppercase mb-8">Continuous Deployment</h3>
                            <div className="p-8 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl shadow-2xl shadow-emerald-500/20 group hover:scale-[1.02] transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                    </div>
                                    <span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">Active</span>
                                </div>
                                <h4 className="text-white text-xl font-black mb-2 tracking-tight">GitHub Activity</h4>
                                <p className="text-white/70 text-sm leading-relaxed mb-6">
                                    Consistently contributing to open-source and refining professional projects. Check my latest commits.
                                </p>
                                <a 
                                    href={content.github} 
                                    target="_blank" 
                                    className="inline-flex items-center gap-2 text-white text-xs font-black uppercase tracking-[0.2em] group-hover:gap-3 transition-all"
                                >
                                    Review Missions <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
