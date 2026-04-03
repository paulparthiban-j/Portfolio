"use client";

import { PortfolioContent } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { motion } from "framer-motion";
import { useState } from "react";

interface FooterProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function Footer({ content }: FooterProps) {
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
    if (!content) return null;

    const socialLinks = [
        { label: "LinkedIn", url: content.linkedin || "#", abbr: "in" },
        { label: "GitHub", url: content.github || "#", abbr: "gh" },
        ...(content.twitter ? [{ label: "Twitter", url: content.twitter, abbr: "tw" }] : []),
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("sending");
        setTimeout(() => setFormStatus("sent"), 2000);
    };

    return (
        <footer className="w-full bg-[#0a0a0b] py-10 sm:py-20 md:py-32 px-4 sm:px-6 md:px-12 relative overflow-hidden border-t border-white/5">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left: contact info */}
                    <ScrollSection animationType="slide-right" className="w-full">
                        <div className="flex flex-col gap-8">
                            <div>
                                <h2 className="text-3xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 uppercase">
                                    LET'S BUILD<br />SOMETHING<br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">EXTRAORDINARY</span>
                                </h2>
                                <p className="text-sm sm:text-lg md:text-2xl leading-tight max-w-md font-bold">
                                    Ready to solve your most complex business challenges? I'm currently 
                                    <span className="text-indigo-400"> available for high-impact missions</span>.
                                </p>
                            </div>

                            {/* Contact details */}
                            <div className="flex flex-col gap-3">
                                <a
                                    href={`mailto:${content.email}`}
                                    className="text-indigo-400 hover:text-white transition-colors font-semibold text-lg flex items-center gap-2"
                                >
                                    <span className="text-slate-600">→</span> {content.email}
                                </a>
                                {content.phone && (
                                    <a
                                        href={`tel:${content.phone}`}
                                        className="text-slate-400 hover:text-white transition-colors font-medium text-base flex items-center gap-2"
                                    >
                                        <span className="text-slate-600">→</span> {content.phone}
                                    </a>
                                )}
                            </div>

                            {/* Social links */}
                            <div className="flex gap-3">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-sm font-black text-slate-400 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all duration-300"
                                    >
                                        {s.abbr}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </ScrollSection>

                    {/* Right: contact form */}
                    <ScrollSection animationType="slide-left" className="w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-10"
                        >
                            {formStatus === "sent" ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl">✓</div>
                                    <h3 className="text-2xl font-black text-white">Message Sent!</h3>
                                    <p className="text-slate-400 text-base">I'll get back to you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Your Name"
                                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="you@example.com"
                                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Tell me about your project..."
                                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={formStatus !== "idle"}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center min-h-[56px]"
                                    >
                                        {formStatus === "idle" ? "Send Message" : "Sending…"}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </ScrollSection>
                </div>

                {/* Bottom bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-600 font-medium">
                        © {new Date().getFullYear()} {content.name} — All rights reserved.
                    </p>
                    <p className="text-xs text-slate-700 font-mono">Built with Next.js + Framer Motion</p>
                </div>
            </div>
        </footer>
    );
}
