"use client";

import { PortfolioContent, Project } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface ProjectsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / rect.width - 0.5);
        y.set(mouseY / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            layoutId={`card-${project.title}`}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative h-full flex flex-col rounded-[2.5rem] glass-dark border border-white/5 p-8 cursor-pointer transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.2)]"
        >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <motion.div 
                layoutId={`image-container-${project.title}`}
                className="relative h-64 w-full rounded-2xl overflow-hidden mb-8 bg-black/40 border border-white/5"
            >
                {project.icon ? (
                    <Image 
                        src={project.icon} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-600/10">
                        <span className="text-6xl grayscale group-hover:grayscale-0 transition-all duration-500">🚀</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>

            <div className="flex-grow space-y-4" style={{ transform: "translateZ(30px)" }}>
                <motion.h3 layoutId={`title-${project.title}`} className="text-3xl font-bold text-white tracking-tight">{project.title}</motion.h3>
                <p className="text-slate-400 font-light line-clamp-2 text-lg leading-relaxed">{project.description}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-accent/80">{project.tech.split(',')[0]}</span>
                <span className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">View Details →</span>
            </div>
        </motion.div>
    );
};

export function ProjectsSection({ content, isActive, sectionIndex }: ProjectsSectionProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-visible`}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />
            <div className="container mx-auto max-w-7xl relative z-10" style={{ perspective: "1200px" }}>
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white/60">Selected Works</span>
                    </h2>
                </ScrollSection>

                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {content.projects.map((project: Project, index: number) => (
                        <StaggeredItem key={index} index={index}>
                            <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                        </StaggeredItem>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        />
                        
                        <motion.div
                            layoutId={`card-${selectedProject.title}`}
                            className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div 
                                layoutId={`image-container-${selectedProject.title}`}
                                className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden"
                            >
                                {selectedProject.icon ? (
                                    <Image src={selectedProject.icon} alt={selectedProject.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-600/30 to-purple-700/30 flex items-center justify-center">
                                        <span className="text-9xl">🚀</span>
                                    </div>
                                )}
                            </motion.div>

                            <div className="p-8 md:p-16 flex flex-col justify-center w-full md:w-1/2">
                                <motion.h3 layoutId={`title-${selectedProject.title}`} className="text-5xl font-black text-white mb-6 leading-none">
                                    {selectedProject.title}
                                </motion.h3>
                                <p className="text-xl text-slate-300 font-light mb-10 leading-relaxed">
                                    {selectedProject.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-3 mb-12">
                                    {selectedProject.tech.split(',').map((tech, i) => (
                                        <span key={i} className="px-5 py-2 rounded-full glass border border-white/5 text-sm font-semibold text-accent/90">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-6">
                                    <a href={selectedProject.link} target="_blank" rel="noreferrer" className="flex-1 text-center py-5 rounded-2xl bg-white text-black font-black text-lg transition-transform hover:scale-[1.02]">Live Experience</a>
                                    <a href={selectedProject.github} target="_blank" rel="noreferrer" className="flex-1 text-center py-5 rounded-2xl glass border border-white/10 text-white font-black text-lg transition-transform hover:scale-[1.02]">Repository</a>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-8 right-8 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white text-2xl hover:bg-white/10 transition-colors z-50"
                            >
                                ✕
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AnimatedSection>
    );
}
