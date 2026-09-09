"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";

interface NavbarProps {
    content: PortfolioContent;
}

// Magnetic Button Component
function MagneticButton({ children, className, ...props }: any) {
    const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    return (
        <motion.button
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
}

export function Navbar({ content }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Stack", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Journey", href: "#experience" },
        { name: "Contact", href: "#contact" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 py-4 md:px-10 ${
                    scrolled ? "md:py-4" : "md:py-8"
                }`}
            >
                <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 ${
                    scrolled 
                    ? "bg-black/80 backdrop-blur-2xl border border-white/10 p-3 md:px-8 rounded-2xl md:rounded-full shadow-2xl shadow-black/50" 
                    : "bg-transparent p-3"
                }`}>
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-500/30"
                        >
                            {content.name[0]}
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className="text-white font-black tracking-tighter text-lg uppercase block leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                                {content.name}
                            </span>
                            <span className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase block mt-1">
                                Senior Software Engineer
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors relative group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-2 py-1"
                            >
                                {link.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                        <MagneticButton
                            as="a"
                            href="/api/resume"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                        >
                            Resume
                        </MagneticButton>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-90"
                    >
                        <motion.div 
                            animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                            className="w-5 h-0.5 bg-white rounded-full" 
                        />
                        <motion.div 
                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-5 h-0.5 bg-white rounded-full" 
                        />
                        <motion.div 
                            animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                            className="w-5 h-0.5 bg-white rounded-full" 
                        />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-8 pt-20"
                    >
                        {navLinks.map((link, i) => (
                            <motion.a
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-3xl font-black text-white uppercase tracking-tighter hover:text-emerald-400 transition-colors"
                                style={{ fontFamily: 'var(--font-space-grotesk)' }}
                            >
                                {link.name}
                            </motion.a>
                        ))}
                        <motion.a
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            href="/api/resume"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-12 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl text-white font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/30"
                        >
                            Download Resume
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
