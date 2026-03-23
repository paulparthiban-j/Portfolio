"use client";

import { PortfolioContent, Project } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ProjectsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
    const isMobile = useIsMobile();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
    const [hovering, setHovering] = useState(false);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setHovering(false);
    };

    return (
        <motion.div
            style={!isMobile ? {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            } : {}}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => !isMobile && setHovering(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            layoutId={`card-${project.title}`}
            className="group relative h-[450px] w-full cursor-pointer perspective-1000"
        >
            <div 
                className={`glass-premium h-full w-full rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-accent/30 transition-all duration-700 ${hovering && !isMobile ? 'ring-1 ring-accent/20' : ''}`}
                style={hovering && !isMobile ? { willChange: 'transform' } : {}}
            >
                {/* Project Image */}
                <div className="relative h-2/3 w-full bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                    {project.icon ? (
                        <Image 
                            src={project.icon} 
                            alt={project.title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-white/5 font-black text-8xl italic uppercase select-none">
                            {project.title.substring(0, 2)}
                        </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-accent/10 backdrop-blur-sm`}>
                        <span className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            View Mission
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 relative z-30">
                    <div className="mb-2 text-[10px] font-black tracking-[0.4em] uppercase text-accent/60">
                        {project.tech?.split(',')[0] || 'Technology'}
                    </div>
                    <h3 className="text-3xl font-black text-white group-hover:text-accent transition-colors leading-tight">
                        {project.title}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
};

export function ProjectsSection({ content, isActive, sectionIndex }: ProjectsSectionProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const isMobile = useIsMobile();

    if (!content) return null;

    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-32 px-4 relative overflow-hidden`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl z-0" />
            
            <div className="container mx-auto max-w-7xl relative z-10">
                <ScrollSection animationType="slide-down" className="mb-24 text-center">
                    <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
                        <span className="opacity-30">01.</span> PROJECTS
                    </h2>
                </ScrollSection>

                {(!content.projects || content.projects.length === 0) ? (
                    <div className="text-center py-20 glass-premium rounded-3xl">
                        <p className="text-slate-500 font-black italic tracking-widest text-xl">NO MISSIONS DEPLOYED YET</p>
                    </div>
                ) : (
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                        {content.projects.map((project: Project, index: number) => (
                            <StaggeredItem key={index} index={index}>
                                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                            </StaggeredItem>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] cursor-zoom-out"
                        />
                        
                        <motion.div
                            layoutId={`card-${selectedProject.title}`}
                            className="fixed inset-4 md:inset-10 lg:inset-20 z-[101] flex items-center justify-center pointer-events-none"
                        >
                            <div className="glass-premium w-full max-w-6xl max-h-full overflow-y-auto rounded-[3rem] border border-white/10 pointer-events-auto relative scrollbar-hide">
                                <button 
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white z-50 hover:bg-white/10 transition-colors"
                                >
                                    ✕
                                </button>
                                
                                <div className="grid lg:grid-cols-2 h-full min-h-[600px]">
                                    <div className="relative h-80 lg:h-auto bg-slate-900">
                                        {selectedProject.icon ? (
                                            <Image 
                                                src={selectedProject.icon} 
                                                alt={selectedProject.title} 
                                                fill 
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-white/5 font-black text-[12rem] italic uppercase select-none">
                                                {selectedProject.title.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-10 md:p-16 flex flex-col justify-center">
                                        <div className="flex gap-3 mb-8 flex-wrap">
                                            {selectedProject.tech?.split(',').map((tech, i) => (
                                                <span key={i} className="px-4 py-1.5 rounded-full glass border border-white/10 text-accent font-black text-[10px] tracking-widest uppercase">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>

                                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tighter">
                                            {selectedProject.title}
                                        </h2>
                                        
                                        <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed mb-12">
                                            {selectedProject.description}
                                        </p>

                                        <div className="flex flex-wrap gap-6 pt-8 border-t border-white/10">
                                            <a 
                                                href={selectedProject.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-accent hover:text-white transition-all"
                                            >
                                                Launch Application
                                            </a>
                                            <a 
                                                href={selectedProject.github} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-10 py-5 glass border border-white/10 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all"
                                            >
                                                Source Code
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AnimatedSection>
    );
}
