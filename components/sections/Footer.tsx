"use client";

import { PortfolioContent } from "@/types/portfolio";
import { staggerContainer, riseItem, inViewOnce, EASE_OUT_EXPO } from "@/components/ui/motion";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef } from "react";

interface FooterProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

// Magnetic Input Component
function MagneticInput({ children, className, ...props }: any) {
    const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) / 20);
        y.set((e.clientY - centerY) / 20);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const springX = useSpring(x, { stiffness: 100, damping: 15 });
    const springY = useSpring(y, { stiffness: 100, damping: 15 });

    return (
        <m.div
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            {children}
        </m.div>
    );
}

export function Footer({ content }: FooterProps) {
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
    if (!content) return null;

    const socialLinks = [
        {
            label: "LinkedIn",
            url: content.linkedin || "#",
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
        },
        {
            label: "GitHub",
            url: content.github || "#",
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
        },
        ...(content.twitter ? [{
            label: "Twitter",
            url: content.twitter,
            icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
        }] : []),
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // React nulls out the SyntheticEvent's currentTarget once the handler
        // yields (e.g. at an `await`), so it must be captured now rather than
        // read again after the fetch below - otherwise the later `.reset()`
        // call throws "Cannot read properties of null (reading 'reset')",
        // which used to make every successful submission fall into the catch
        // block and show a false "failed to send" error to the user.
        const form = e.currentTarget as HTMLFormElement;
        setFormStatus("sending");

        try {
            const formData = new FormData(form);
            const data = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                message: formData.get('message') as string,
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setFormStatus("sent");
                // Reset form after successful submission
                form.reset();
                // Reset status after 5 seconds
                setTimeout(() => setFormStatus("idle"), 5000);
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to send message');
                setFormStatus("idle");
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Failed to send message. Please try again.');
            setFormStatus("idle");
        }
    };

    return (
        <footer className="w-full bg-[#0A0A0B] py-16 md:py-24 px-4 sm:px-6 md:px-8 relative overflow-hidden border-t border-white/5">
            <div className="hidden md:block absolute top-0 right-0 w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24">
                    {/* Left: contact info */}
                    <m.div
                        className="w-full"
                        initial="hidden"
                        whileInView="show"
                        viewport={inViewOnce}
                        variants={staggerContainer(0.1)}
                    >
                        <div className="flex flex-col gap-8">
                            <div>
                                {/* Each line slides up out of its own mask */}
                                <h2
                                    aria-label="Let's build something great"
                                    className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.8] mb-6 sm:mb-8 uppercase"
                                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                                >
                                    {["LET'S BUILD", "SOMETHING", "GREAT"].map((line, i) => (
                                        <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                                            <m.span
                                                className={`block ${i === 2 ? "bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-600" : ""}`}
                                                variants={{
                                                    hidden: { y: "110%", skewY: 6 },
                                                    show: { y: "0%", skewY: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
                                                }}
                                            >
                                                {line}
                                            </m.span>
                                        </span>
                                    ))}
                                </h2>
                                <m.p variants={riseItem} className="text-xs sm:text-sm md:text-base lg:text-xl leading-tight max-w-md font-bold text-slate-400">
                                    I'm currently
                                    <span className="text-violet-400"> open to new opportunities</span> — reach out if you have something worth building.
                                </m.p>
                            </div>

                            {/* Contact details */}
                            <m.div variants={riseItem} className="flex flex-col">
                                <a
                                    href={`mailto:${content.email}`}
                                    className="text-violet-400 hover:text-white transition-colors font-semibold text-base sm:text-lg flex items-center gap-2 min-h-[44px] [overflow-wrap:anywhere]"
                                >
                                    <span className="text-slate-400">→</span> {content.email}
                                </a>
                                {content.phone && (
                                    <a
                                        href={`tel:${content.phone}`}
                                        className="text-slate-400 hover:text-white transition-colors font-medium text-base flex items-center gap-2 min-h-[44px]"
                                    >
                                        <span className="text-slate-400">→</span> {content.phone}
                                    </a>
                                )}
                            </m.div>

                            {/* Social links */}
                            <m.div variants={staggerContainer(0.08)} className="flex gap-3">
                                {socialLinks.map((s) => (
                                    <m.a
                                        variants={{
                                            hidden: { opacity: 0, scale: 0, rotate: -30 },
                                            show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 400, damping: 15 } },
                                        }}
                                        whileHover={{ y: -6, rotate: -8 }}
                                        whileTap={{ scale: 0.9 }}
                                        key={s.label}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-colors duration-300"
                                    >
                                        {s.icon}
                                    </m.a>
                                ))}
                            </m.div>
                        </div>
                    </m.div>

                    {/* Right: contact form */}
                    <div className="w-full [perspective:1200px]">
                        <m.div
                            initial={{ opacity: 0, y: 60, rotateY: -18 }}
                            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                            viewport={inViewOnce}
                            transition={{ type: "spring", stiffness: 70, damping: 16 }}
                            className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10"
                        >
                            {formStatus === "sent" ? (
                                <m.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                                    className="flex flex-col items-center justify-center py-12 text-center gap-4"
                                >
                                    <m.div
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.1 }}
                                        className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-2xl"
                                    >✓</m.div>
                                    <h3 className="text-2xl font-black text-white">Message Sent!</h3>
                                    <p className="text-slate-400 text-base">I'll get back to you soon.</p>
                                </m.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Name</label>
                                            <MagneticInput className="w-full">
                                                <input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    type="text"
                                                    placeholder="Your Name"
                                                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500/50 transition-all hover:border-violet-500/30"
                                                />
                                            </MagneticInput>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</label>
                                            <MagneticInput className="w-full">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    required
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500/50 transition-all hover:border-violet-500/30"
                                                />
                                            </MagneticInput>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-slate-400">Message</label>
                                        <MagneticInput className="w-full">
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={4}
                                                placeholder="Tell me about your project..."
                                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-violet-500/50 transition-all resize-none hover:border-violet-500/30"
                                            />
                                        </MagneticInput>
                                    </div>
                                    <m.button
                                        type="submit"
                                        disabled={formStatus === "sending"}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center justify-center min-h-[56px] shadow-lg shadow-violet-500/20"
                                    >
                                        {formStatus === "idle" ? "Send Message" : formStatus === "sending" ? "Sending…" : "Sent!"}
                                    </m.button>
                                </form>
                            )}
                        </m.div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400 font-medium">
                        © {new Date().getFullYear()} {content.name} — All rights reserved.
                    </p>
                    <p className="text-xs text-slate-400 font-mono">Built with Next.js + Framer Motion</p>
                </div>
            </div>
        </footer>
    );
}
