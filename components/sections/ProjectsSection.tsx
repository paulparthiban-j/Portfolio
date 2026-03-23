"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioContent, Project, Theme } from "@/types/portfolio";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";

interface ProjectsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
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
            className={`min-h-screen relative flex items-center justify-center py-32 px-4 md:px-8 overflow-hidden bg-black`}
        >
            <div className="absolute inset-0 bg-[#0a0a0b] z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container mx-auto max-w-7xl relative z-10 w-full">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">03.</span> {content.projectsTitle || 'PROJECTS'}
                    </h2>
                </ScrollSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard 
                            key={index} 
                            project={project} 
                            index={index} 
                            isMobile={isMobile}
                            theme={content.theme}
                            onClick={() => setSelectedProject(project)} 
                        />
                    ))}

                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-premium border border-white/5 rounded-4xl">
                            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">No missions deployed yet.</p>
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

    return (
        <StaggeredItem index={index}>
            <motion.div
                onClick={onClick}
                className={`group glass-premium border border-white/5 rounded-4xl overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-700 active:scale-95 ${!isMobile ? "hover:scale-[1.02] hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10" : ""}`}
            >
                {/* Image-First Layout */}
                <div className="h-64 relative bg-slate-900 overflow-hidden">
                    <Image 
                        src={project.icon || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-end p-8">
                         <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-indigo-600 group-hover:border-indigo-400 group-hover:-translate-y-2 transition-all">
                             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                         </div>
                    </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3 leading-none group-hover:text-indigo-400 transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                        {project.description}
                    </p>
                    
                    <div className="mt-auto flex flex-wrap gap-2">
                        {techStack.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                {t}
                            </span>
                        ))}
                        {techStack.length > 3 && (
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                +{techStack.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </StaggeredItem>
    );
}

function ProjectModal({ project, onClose, theme }: { project: Project; onClose: () => void; theme: Theme }) {
    const techStack = useMemo(() => (project.tech || "").split(',').map(s => s.trim()), [project.tech]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl bg-black/80"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-premium border border-white/10 rounded-5xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-5xl shadow-black shadow-glow group"
                onClick={e => e.stopPropagation()}
                style={{ "--tw-shadow-color": "rgba(99, 102, 241, 0.1)" } as any}
            >
                {/* Modal Layout */}
                <div className="w-full md:w-[55%] relative h-64 md:h-auto overflow-hidden bg-slate-900">
                    <Image 
                        src={project.icon || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 55vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                </div>

                <div className="w-full md:w-[45%] p-10 md:p-16 flex flex-col bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-10">
                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                            Mission Log
                        </div>
                        <button onClick={onClose} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                        {project.title}
                    </h2>
                    
                    <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                        {project.description}
                    </p>

                    <div className="mb-10">
                        <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-4">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {techStack.map((t, i) => (
                                <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row gap-4">
                        {project.link && (
                            <a href={project.link} target="_blank" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-center text-white font-bold transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                                Live Preview
                            </a>
                        )}
                        {project.github && (
                            <a href={project.github} target="_blank" className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-center text-white font-bold transition-all active:scale-95">
                                Code Repository
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
