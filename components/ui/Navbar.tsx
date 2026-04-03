"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";

interface NavbarProps {
    content: PortfolioContent;
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
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 py-4 md:px-10 ${
                    scrolled ? "md:py-4" : "md:py-8"
                }`}
            >
                <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 ${
                    scrolled 
                    ? "bg-black/60 backdrop-blur-2xl border border-white/10 p-3 md:px-8 rounded-2xl md:rounded-full shadow-2xl" 
                    : "bg-transparent p-3"
                }`}>
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            {content.name[0]}
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-white font-black tracking-tighter text-lg uppercase block leading-none">
                                {content.name}
                            </span>
                            <span className="text-indigo-400 font-bold text-[10px] tracking-widest uppercase block mt-1">
                                Developer
                            </span>
                        </div>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors hover:bg-white/5 px-3 py-1.5 rounded-lg"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href={content.resumeUrl || "#"}
                            target="_blank"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            Resume
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-8 pt-20"
                    >
                        {navLinks.map((link, i) => (
                            <motion.a
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-3xl font-black text-white uppercase tracking-tighter hover:text-indigo-400 transition-colors"
                            >
                                {link.name}
                            </motion.a>
                        ))}
                        <motion.a
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            href={content.resumeUrl || "#"}
                            target="_blank"
                            className="mt-4 px-12 py-5 bg-indigo-600 rounded-2xl text-white font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20"
                        >
                            Get Resume
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
