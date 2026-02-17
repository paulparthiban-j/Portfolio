"use client";

import { PortfolioContent } from "@/types/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrollSection } from "@/components/ui/ScrollSection";

interface HeroSectionProps {
    content: PortfolioContent;
    hideHeroContent: boolean;
    isActive?: boolean;
    sectionIndex?: number;
}

export function HeroSection({ content, hideHeroContent, isActive, sectionIndex }: HeroSectionProps) {
    return (
        <AnimatedSection
            isFirst={true}
            sectionIndex={sectionIndex}
            isActive={isActive}
            className={`bg-gradient-to-br ${content.theme?.bg || 'from-[#0f172a] via-[#1e1b4b] to-black'} ${content.theme?.mode === 'light' ? 'text-slate-900' : 'text-white'} relative`}
        >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className={`hero-content text-center w-full transition-all duration-1000 ${hideHeroContent ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
                    <ScrollSection animationType="slide-down">
                        <h1 className="mb-6 text-6xl font-black md:text-[7rem] leading-none tracking-tight text-center">
                            <span className={`gradient-text animate-gradient bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'}`}>I'm {content.name}</span>
                        </h1>
                    </ScrollSection>
                    <ScrollSection animationType="slide-up">
                        <p className="mb-8 text-3xl md:text-5xl font-light text-slate-300">
                            {content.title}
                        </p>
                    </ScrollSection>
                    <ScrollSection animationType="fade-in">
                        <p className="mb-12 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                            {content.description}
                        </p>
                    </ScrollSection>
                    <ScrollSection animationType="scale-in">
                        <div className="flex flex-wrap justify-center gap-6">
                            <a
                                href={`mailto:${content.email}`}
                                className={`btn btn-lg btn-premium bg-gradient-to-r ${content.theme?.primaryGradient || 'from-indigo-600 to-violet-600'} border-none text-white px-10 rounded-full hover:shadow-2xl transition-all`}
                                aria-label="Send an email to hire me"
                            >
                                Hire Me
                            </a>
                            <a
                                href={content.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-lg btn-premium glass border-white/20 text-white px-10 rounded-full hover:bg-white/10"
                                aria-label="View my GitHub profile"
                            >
                                GitHub
                            </a>
                            {content.resumeUrl && (
                                <a
                                    href={content.resumeUrl}
                                    download
                                    className="btn btn-lg btn-premium bg-white/5 border-white/20 text-white px-10 rounded-full hover:bg-white/10"
                                    aria-label="Download my resume"
                                >
                                    Resume ⬇
                                </a>
                            )}
                        </div>
                    </ScrollSection>
                </div>
            </div>
            <div
                className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 scroll-indicator transition-opacity duration-500 ${hideHeroContent ? 'opacity-0' : 'opacity-100'}`}
                aria-hidden="true"
            >
                <div className="w-8 h-12 border-2 border-slate-500 rounded-full flex justify-center p-2">
                    <div className={`w-1 h-2 bg-${content.theme?.accent || 'indigo-500'} rounded-full animate-bounce`}></div>
                </div>
            </div>
        </AnimatedSection >
    );
}
