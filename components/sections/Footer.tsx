"use client";

import { PortfolioContent } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { useState } from "react";

interface FooterProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function Footer({ content, isActive, sectionIndex }: FooterProps) {
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
    if (!content) return null;

    const socialLinks = [
        { label: "LinkedIn", url: content.linkedin || "#", icon: "in" },
        { label: "GitHub", url: content.github || "#", icon: "gh" },
        { label: "Twitter", url: content.twitter || "#", icon: "tw" }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("sending");
        setTimeout(() => setFormStatus("sent"), 2000);
    };

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <ScrollSection animationType="slide-right">
                            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none mb-10">
                                SAY<br />HELLO.
                            </h2>
                            <p className="text-2xl text-slate-500 font-light max-w-md leading-relaxed mb-12">
                                Looking for a digital architect to bring your next vision to life? Let's connect.
                            </p>
                            
                            <div className="flex gap-4">
                                {socialLinks.map((social, i) => (
                                    <a 
                                        key={i} 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-16 h-16 rounded-2xl glass border border-white/5 flex items-center justify-center text-white font-black hover:bg-accent hover:border-accent transition-all duration-500 group"
                                    >
                                        <span className="group-hover:scale-110 transition-transform">{social.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </ScrollSection>
                    </div>

                    {/* Contact Form */}
                    <ScrollSection animationType="slide-left">
                        <div className="glass-premium rounded-[3rem] p-8 md:p-14 border-white/5 relative overflow-hidden">
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Full Identity</label>
                                        <input required type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-accent transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Terminal Address</label>
                                        <input required type="email" placeholder="email@address.com" className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-accent transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Mission Brief</label>
                                    <textarea required rows={4} placeholder="Tell me about your project..." className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none" />
                                </div>
                                
                                <button 
                                    disabled={formStatus !== "idle"}
                                    type="submit" 
                                    className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-accent hover:text-white transition-all transform active:scale-[0.98] disabled:opacity-50"
                                >
                                    {formStatus === "idle" ? "DEPLOY TRANSMISSION" : formStatus === "sending" ? "UPLOADING..." : "TRANSMISSION RECEIVED"}
                                </button>
                            </form>
                            
                            {/* Decorative background glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
                        </div>
                    </ScrollSection>
                </div>

                <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
                    <p className="text-sm font-mono tracking-widest text-slate-500 uppercase">
                        © {new Date().getFullYear()} {content.name} — ALL SYSTEMS OPERATIONAL
                    </p>
                    <div className="flex gap-10">
                        <span className="text-xs font-black uppercase tracking-widest text-white/50">Next.js 16</span>
                        <span className="text-xs font-black uppercase tracking-widest text-white/50">Framer Motion</span>
                        <span className="text-xs font-black uppercase tracking-widest text-white/50">PostgreSQL</span>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
