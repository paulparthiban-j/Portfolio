"use client";

import { PortfolioContent, Project } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";
import { StaggeredItem } from "@/components/ui/StaggeredItem";
import Image from "next/image";

interface ProjectsSectionProps {
    content: PortfolioContent;
    isActive?: boolean;
    sectionIndex?: number;
}

export function ProjectsSection({ content, isActive, sectionIndex }: ProjectsSectionProps) {
    return (
        <AnimatedSection
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} py-20 px-4 relative`}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>
            <div className="container mx-auto max-w-7xl relative z-10">
                <ScrollSection animationType="slide-down">
                    <h2 className={`mb-20 text-center text-5xl md:text-7xl font-black ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'}`}>Innovation</h2>
                </ScrollSection>
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {content.projects.map((project: Project, index: number) => (
                        <StaggeredItem key={index} index={index} delay={120}>
                            <div className="card card-premium glass-dark border-white/10 rounded-[2rem] h-full transition-all duration-500 hover:shadow-[0_0_50px_rgba(var(--accent-rgb),0.15)]">
                                <figure className="px-6 pt-6">
                                    <div className="rounded-2xl h-48 w-full bg-slate-900/50 flex items-center justify-center relative overflow-hidden group border border-white/5">
                                        {project.icon ? (
                                            <Image
                                                src={project.icon}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${content.theme?.primaryGradient || 'from-indigo-500/20 to-purple-600/20'} flex items-center justify-center`}>
                                                <span className="text-6xl group-hover:scale-125 transition-transform duration-500" role="img" aria-label="Rocket Icon">🚀</span>
                                            </div>
                                        )}
                                    </div>
                                </figure>
                                <div className="card-body p-8">
                                    <h3 className={`card-title ${content.theme?.mode === 'light' ? 'text-slate-800' : 'text-white'} text-3xl font-bold mb-4`}>{project.title}</h3>
                                    <p className="text-slate-400 mb-6 leading-relaxed text-lg">{project.description}</p>
                                    <div className="mb-8">
                                        <div className={`badge badge-glow bg-${content.theme?.accent || 'indigo-500'}/20 text-${content.theme?.accent || 'indigo-300'} border-${content.theme?.accent || 'indigo-500'}/30 px-4 py-3 font-semibold`}>
                                            {project.tech}
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end gap-4">
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-premium glass border-white/10 text-white rounded-xl hover:bg-white/10"
                                            aria-label={`View live demo of ${project.title}`}
                                        >
                                            Live Demo
                                        </a>
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-premium bg-white/10 hover:bg-white/20 text-white border-none rounded-xl"
                                            aria-label={`View source code of ${project.title} on GitHub`}
                                        >
                                            Source
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </StaggeredItem>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
}
