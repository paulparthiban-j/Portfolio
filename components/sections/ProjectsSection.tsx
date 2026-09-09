"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PortfolioContent, Project, Theme } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";

interface ProjectsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

// 3D Tilt Card Component
function TiltCard({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = (e.clientY - centerY) / 10;
        const rotateY = (e.clientX - centerX) / 10;
        x.set(rotateX);
        y.set(rotateY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rotateX = useSpring(x, { stiffness: 200, damping: 20 });
    const rotateY = useSpring(y, { stiffness: 200, damping: 20 });

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ProjectsSection({ content, isActive, sectionIndex }: ProjectsSectionProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const isMobile = useIsMobile();

    if (!content) return null;

    const projects = useMemo(() => content.projects || [], [content.projects]);

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-[#0A0A0B]"
        >
            <div className="absolute inset-0 bg-[#0a0a0b] z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-16 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                        {content.projectsTitle || 'PROJECTS'}
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Systems designed and built end-to-end.
                    </p>
                </ScrollSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <ProjectCard 
                                project={project} 
                                index={index} 
                                isMobile={isMobile}
                                theme={content.theme}
                                onClick={() => setSelectedProject(project)} 
                            />
                        </motion.div>
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-premium border border-white/5 rounded-2xl md:rounded-3xl">
                            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">No projects yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                        theme={content.theme}
                    />
                )}
            </AnimatePresence>
        </AnimatedSection>
    );
}

function ProjectCard({ project, index, isMobile, theme, onClick }: { project: Project; index: number; isMobile: boolean; theme: Theme; onClick: () => void }) {
    const techStack = useMemo(() => (project.tech || "").split(',').map(s => s.trim()), [project.tech]);

    const CardComponent = isMobile ? motion.div : TiltCard;

    return (
        <CardComponent
            onClick={onClick}
            whileTap={{ scale: 0.97 }}
            className="group h-full flex flex-col justify-between glass-premium border border-white/10 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 interaction-lift focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
                <div className="h-48 sm:h-56 md:h-64 lg:h-72 relative bg-slate-900 overflow-hidden">
                    <Image
                        src={project.icon || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"}
                        alt={project.title}
                        fill
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px"
                        loading="lazy"
                        quality={75}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwC3ABH/2Q=="
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-6 sm:p-8">
                         <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-emerald-600 group-hover:border-emerald-400 transition-all duration-300">
                             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                         </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 lg:p-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                            {project.title}
                        </h3>
                    </div>

                    <p className="text-xs sm:text-sm md:text-base text-slate-400 mb-4 sm:mb-6 md:mb-8 line-clamp-3 leading-relaxed font-medium">
                        {project.description}
                    </p>

                    <div className="mt-auto pt-4 sm:pt-6 border-t border-white/5 flex flex-wrap gap-1.5 sm:gap-2">
                        {techStack.slice(0, 4).map((t, idx) => (
                            <span key={idx} className="px-2 py-1 sm:px-3 sm:py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-emerald-300 group-hover:bg-emerald-500/5 transition-all">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
        </CardComponent>
    );
}

function ProjectModal({ project, onClose, theme }: { project: Project; onClose: () => void; theme: Theme }) {
    const techStack = useMemo(() => (project.tech || "").split(',').map(s => s.trim()), [project.tech]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [handleKeyDown]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Project details: ${project.title}`}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl bg-black/80"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-premium border border-white/15 rounded-3xl md:rounded-5xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-emerald-500/10"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-full md:w-[60%] relative h-64 md:h-auto overflow-hidden bg-slate-900 border-b md:border-b-0 md:border-r border-white/10">
                    <Image
                        src={project.icon || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=90"}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        loading="lazy"
                        quality={80}
                    />
                </div>

                <div className="w-full md:w-[40%] p-10 md:p-14 md:py-20 flex flex-col bg-slate-950/20 overflow-y-auto">
                    <div className="flex justify-between items-start mb-10">
                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                            Project Overview
                        </div>
                        <button onClick={onClose} aria-label="Close project details" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 border border-white/10 transition-all active:scale-90">
                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                                {project.title}
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed font-medium">
                                {project.description}
                            </p>
                        </section>

                        {project.problem && (
                            <section className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                <h4 className="text-[10px] font-black tracking-widest text-red-400 uppercase mb-3">The Problem</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">{project.problem}</p>
                            </section>
                        )}

                        {project.solution && (
                            <section className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                <h4 className="text-[10px] font-black tracking-widest text-emerald-400 uppercase mb-3">The Solution</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">{project.solution}</p>
                            </section>
                        )}

                        {project.impact && project.impact.length > 0 && (
                            <section>
                                <h4 className="text-[10px] font-black tracking-widest text-indigo-500 uppercase mb-4">Core Impact</h4>
                                <ul className="space-y-3">
                                    {project.impact.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                            <span className="font-bold">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section className="pt-10 border-t border-white/5">
                            <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-6">Technical Architecture</h4>
                            
                            <div className="space-y-8">
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((t, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-white uppercase tracking-wider">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                
                                {project.architecture && (
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <h5 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 italic">How I built this</h5>
                                        <p className="text-slate-400 text-xs leading-relaxed">{project.architecture}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-center text-white text-sm font-black transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                                Live Preview
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-center text-white text-sm font-black transition-all active:scale-95">
                                View Source
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
