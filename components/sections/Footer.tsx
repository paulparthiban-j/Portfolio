"use client";

import { PortfolioContent } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";

interface FooterProps {
    content: PortfolioContent;
    sectionIndex: number;
    isActive?: boolean;
}

export function Footer({ content, isActive, sectionIndex }: FooterProps) {
    const socialLinks = [
        { platform: 'GitHub', url: content.github, icon: '🐙' },
        { platform: 'LinkedIn', url: content.linkedin, icon: '💼' },
        { platform: 'Twitter', url: content.twitter, icon: '🐦' }
    ].filter(link => link.url);

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid gap-16 lg:grid-cols-2">
                    <ScrollSection animationType="slide-right">
                        <div>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-12">
                                LET&apos;S <span className="text-accent underline decoration-accent/30 underline-offset-8">SYNC.</span>
                            </h2>
                            <p className="text-2xl text-slate-400 font-light max-w-xl mb-16 leading-relaxed">
                                Currently accepting new projects and consulting opportunities for {new Date().getFullYear()}.
                            </p>
                            
                            <div className="flex gap-8 mb-20 overflow-visible">
                                {socialLinks.map((social, i) => (
                                    <a 
                                        key={i} 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group relative w-16 h-16 flex items-center justify-center rounded-2xl glass-premium border-white/5 hover:border-accent/40 transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <div className="absolute inset-0 bg-accent/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-2xl grayscale group-hover:grayscale-0 transition-all duration-500">
                                            {social.icon}
                                        </span>
                                    </a>
                                ))}
                            </div>

                            <div className="pt-12 border-t border-white/10 text-slate-500 font-black text-xs tracking-[0.4em] uppercase">
                                Inspired by the Cosmos &copy; {new Date().getFullYear()} {content.name}
                            </div>
                        </div>
                    </ScrollSection>

                    <ScrollSection animationType="slide-left">
                        <div className="glass-premium rounded-[3rem] p-10 md:p-14 border-white/5 relative">
                            <form className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Commander Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-10 py-5 text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Transmission Frequency</label>
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-10 py-5 text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Protocol Details</label>
                                    <textarea 
                                        placeholder="How can we collaborate?"
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-10 py-5 text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all resize-none"
                                    />
                                </div>
                                
                                <button type="button" className="group relative w-full py-6 rounded-2xl overflow-hidden active:scale-[0.98] transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary animate-gradient" />
                                    <span className="relative text-white font-black text-lg tracking-[0.1em] uppercase group-hover:tracking-[0.2em] transition-all">Send Transmission</span>
                                </button>
                            </form>
                        </div>
                    </ScrollSection>
                </div>
            </div>

            {/* Float-up background elements */}
            <div className="absolute bottom-[-5%] left-[20%] w-32 h-32 border border-accent/10 rounded-full animate-float pointer-events-none" />
            <div className="absolute top-[10%] right-[5%] w-16 h-16 glass-premium rounded-full blur-md animate-pulse pointer-events-none" />
        </AnimatedSection>
    );
}
