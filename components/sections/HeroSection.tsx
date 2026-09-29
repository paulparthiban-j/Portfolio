"use client";

import { Fragment, useEffect, useState, useRef } from "react";
import { m, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { PortfolioContent } from "@/types/portfolio";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Particles } from "@/components/ui/Particles";

interface HeroSectionProps {
    content: PortfolioContent;
    hideHeroContent?: boolean;
    isActive?: boolean;
    sectionIndex?: number;
}

// Magnetic Button Component
function MagneticButton({ children, className, as = "button", ...props }: any) {
    const Component = as === "a" ? m.a : m.button;
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
        <Component
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
}

function GradientLetters({ text, gradient, startIndex, className = "" }: {
    text: string;
    gradient: string;
    startIndex: number;
    className?: string;
}) {
    const n = Array.from(text).length;
    // Letters are grouped per word so the line can still wrap between words.
    let index = 0;
    const words = text.split(" ").map((word) => {
        const letters = Array.from(word).map((char) => ({ char, i: index++ }));
        index++; // the space
        return letters;
    });

    return (
        <span aria-hidden="true" className={`block ${className}`}>
            {words.map((letters, w) => (
                <Fragment key={w}>
                    {w > 0 && " "}
                    <span className="inline-block whitespace-nowrap">
                        {letters.map(({ char, i }) => (
                            // Outer span owns the hover spring; the inner one owns the CSS
                            // entrance (a running CSS animation would override Framer's transform)
                            <m.span
                                key={i}
                                className="inline-block"
                                whileHover={{ y: "-0.12em", rotate: i % 2 ? 4 : -4, transition: { type: "spring", stiffness: 500, damping: 12 } }}
                                whileTap={{ y: "-0.12em", rotate: i % 2 ? 4 : -4, scale: 1.08, transition: { type: "spring", stiffness: 500, damping: 12 } }}
                            >
                                <span
                                    className="hero-letter"
                                    style={{
                                        ["--i" as string]: startIndex + i,
                                        backgroundImage: gradient,
                                        backgroundSize: `${n * 100}% 100%`,
                                        backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0`,
                                    }}
                                >
                                    {char}
                                </span>
                            </m.span>
                        ))}
                    </span>
                </Fragment>
            ))}
        </span>
    );
}

/** Rotates through the parts of the title ("A | B") with a masked slide.
 *  Fixed-height box + absolutely positioned lines, so swapping never shifts layout. */
function RotatingTitle({ title }: { title: string }) {
    const parts = title.split(/\s*[|•·]\s*/).filter(Boolean);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (parts.length < 2) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % parts.length), 2800);
        return () => clearInterval(id);
    }, [parts.length]);

    return (
        <span
            className="relative block h-[1.5em] w-full overflow-hidden text-xs md:text-sm font-black tracking-[0.4em] text-slate-400 uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
            <span className="sr-only">{parts.join(", ")}</span>
            <AnimatePresence initial={false}>
                <m.span
                    key={index}
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 whitespace-nowrap"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {parts[index]}
                </m.span>
            </AnimatePresence>
        </span>
    );
}

/** A soft colour orb that drifts on its own (CSS) and leans towards the pointer (Framer). */
function AuroraOrb({ px, py, depth, className, color }: {
    px: MotionValue<number>;
    py: MotionValue<number>;
    depth: number;
    className: string;
    color: string;
}) {
    const x = useTransform(px, (v) => v * depth);
    const y = useTransform(py, (v) => v * depth);
    return (
        <m.div aria-hidden="true" className={`absolute pointer-events-none ${className}`} style={{ x, y }}>
            <div
                className="w-full h-full rounded-full animate-orb-float"
                style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
            />
        </m.div>
    );
}

const FLOATING_BADGES = [
    { label: "React", pos: "left-[6%] top-[24%]", depth: -40, delay: "0s" },
    { label: ".NET", pos: "right-[7%] top-[20%]", depth: -60, delay: "1.2s" },
    { label: "Node.js", pos: "left-[9%] bottom-[22%]", depth: -30, delay: "2.1s" },
    { label: "SQL Server", pos: "right-[9%] bottom-[26%]", depth: -50, delay: "0.6s" },
];

function FloatingBadge({ label, pos, depth, delay, px, py, index }: {
    label: string; pos: string; depth: number; delay: string; index: number;
    px: MotionValue<number>; py: MotionValue<number>;
}) {
    const x = useTransform(px, (v) => v * depth);
    const y = useTransform(py, (v) => v * depth);
    return (
        <m.div aria-hidden="true" className={`absolute hidden xl:block pointer-events-none ${pos}`} style={{ x, y }}>
            <div className="hero-fade" style={{ ["--d" as string]: `${0.9 + index * 0.12}s` }}>
                <div
                    className="animate-badge-float px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.04] text-xs font-black uppercase tracking-widest text-slate-300 shadow-lg shadow-violet-500/10"
                    style={{ animationDelay: delay }}
                >
                    <span className="mr-2 inline-block w-1.5 h-1.5 rounded-full bg-violet-400 align-middle" />
                    {label}
                </div>
            </div>
        </m.div>
    );
}

export function HeroSection({ content, hideHeroContent, isActive, sectionIndex }: HeroSectionProps) {
    const [mounted, setMounted] = useState(false);
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Always call hooks
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    // Scroll-out: translate + fade only. A JS-driven scale changed the raster
    // scale of the whole (huge) hero text every frame, forcing re-rasterisation.
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Pointer position in the hero, -0.5..0.5, smoothed by springs. Motion values
    // only: moving the mouse never re-renders React.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const px = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.8 });
    const py = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.8 });
    const tiltX = useTransform(py, (v) => v * -8);
    const tiltY = useTransform(px, (v) => v * 10);

    // Scroll parallax: the two lines of the name drift apart as the hero leaves
    const line1X = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
    const line2X = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

    // Pause the hero's ambient CSS loops (orbs, badges) while it's off screen.
    // Toggled directly on the element: no React re-render.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            el.classList.toggle("hero-offscreen", !entry.isIntersecting);
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Phones have no pointer, so device tilt drives the same motion values
    // (name tilt + aurora parallax). Android exposes it directly. iOS 13+ only
    // allows it after DeviceOrientationEvent.requestPermission(), which must be
    // called from a tap: we ask on the first tap on an empty part of the hero
    // (never on a link/button, so the CTAs still just work), and never again
    // once the visitor has said no.
    useEffect(() => {
        const section = containerRef.current;
        const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const DOE = window.DeviceOrientationEvent as unknown as
            | { requestPermission?: () => Promise<"granted" | "denied"> }
            | undefined;
        if (!section || !touch || reduced || !DOE) return;

        let baseBeta: number | null = null;
        const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));
        const onOrient = (e: DeviceOrientationEvent) => {
            if (e.beta == null || e.gamma == null) return;
            if (window.scrollY > window.innerHeight) return; // hero off screen
            // Measure relative to how the phone was held when tilt started
            if (baseBeta === null) baseBeta = e.beta;
            // Rounded so sensor noise doesn't keep the springs busy
            pointerX.set(Math.round(clamp(e.gamma / 40) * 50) / 50);
            pointerY.set(Math.round(clamp((e.beta - baseBeta) / 40) * 50) / 50);
        };
        const listen = () => window.addEventListener("deviceorientation", onOrient);

        const PERMISSION_KEY = "hero-tilt-permission";
        let askOnTap: ((e: Event) => void) | null = null;

        if (typeof DOE.requestPermission !== "function") {
            listen(); // Android and other browsers: no prompt needed
        } else {
            let stored: string | null = null;
            try { stored = localStorage.getItem(PERMISSION_KEY); } catch { /* storage blocked */ }
            // Granted on an earlier visit: listen straight away (tapping will
            // re-confirm silently if Safari needs it)
            if (stored === "granted") listen();
            if (stored !== "denied") {
                const requestPermission = DOE.requestPermission;
                askOnTap = (e: Event) => {
                    if ((e.target as HTMLElement).closest("a, button")) return;
                    section.removeEventListener("click", askOnTap!);
                    requestPermission()
                        .then((state) => {
                            try { localStorage.setItem(PERMISSION_KEY, state); } catch { /* storage blocked */ }
                            if (state === "granted") listen();
                        })
                        .catch(() => { /* not a user gesture or unsupported */ });
                };
                section.addEventListener("click", askOnTap);
            }
        }

        return () => {
            window.removeEventListener("deviceorientation", onOrient);
            if (askOnTap) section.removeEventListener("click", askOnTap);
        };
    }, [pointerX, pointerY]);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse" || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
        pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handlePointerLeave = () => {
        pointerX.set(0);
        pointerY.set(0);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!content) return null;

    const nameParts = content.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <section
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative min-h-[100svh] flex items-center [align-items:safe_center] justify-center overflow-hidden bg-[#0A0A0B] pt-28 pb-20 md:pt-32 md:pb-24 [@media(max-height:820px)]:pb-10"
        >
            {/* Top padding reserves the fixed navbar; type and gaps scale with the
                viewport height; "safe center" sends any overflow downwards rather
                than up under the navbar on short screens */}
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
                {/* Aurora: a few small orbs instead of one oversized, scaling mesh layer.
                    Radial gradients (no blur filter), moved by transform only. */}
                <AuroraOrb px={px} py={py} depth={-60} color="rgba(139,92,246,0.28)" className="w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] -left-[15%] -top-[25%]" />
                <AuroraOrb px={px} py={py} depth={80} color="rgba(217,70,239,0.16)" className="w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] -right-[12%] top-[10%]" />
                <AuroraOrb px={px} py={py} depth={-40} color="rgba(56,189,248,0.10)" className="w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] left-[25%] -bottom-[30%]" />
                {!isMobile && mounted && <Particles />}
            </div>

            {FLOATING_BADGES.map((b, i) => (
                <FloatingBadge key={b.label} {...b} index={i} px={px} py={py} />
            ))}

            <m.div
                style={mounted ? { y, opacity } : {}}
                className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center"
            >
                {/* Status Badge */}
                {/* CSS-driven entrance (not JS/rAF-driven): guarantees this content is visible
                    even if the animation never gets to run - e.g. a throttled/backgrounded tab
                    on mobile, which previously left the hero stuck invisible indefinitely. */}
                <div
                    className="flex flex-col items-center mb-[clamp(1rem,3vh,2rem)] hero-rise"
                    style={{ ["--d" as string]: "0s" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-[clamp(0.5rem,1.5vh,1rem)] group cursor-pointer hover:bg-violet-500/20 transition-all duration-300">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <span className="text-[11px] md:text-sm font-black tracking-widest text-violet-400 uppercase">
                            {content.currentWork || "Available for new opportunities"}
                        </span>
                    </div>
                    <RotatingTitle title={content.title || "Full-Stack Developer"} />
                </div>

                {/* Name - letters rise in one by one. Each letter carries its slice
                    of the line's gradient so the per-letter transforms don't break it. */}
                <m.div className="relative" style={mounted ? { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 } : {}}>
                {/* Static glow behind the name - replaces a 40px drop-shadow filter that
                    was re-rasterised every frame (the single biggest hero cost) */}
                <div aria-hidden="true" className="hidden md:block absolute inset-x-[10%] top-[5%] bottom-[20%] pointer-events-none bg-[radial-gradient(closest-side,rgba(139,92,246,0.28),transparent)]" />
                <h1
                    aria-label={content.name}
                    className="relative text-[clamp(2.5rem,min(12vw,13vh),10rem)] font-black mb-[clamp(1rem,3.5vh,2rem)] tracking-tighter leading-[0.85]"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                    <m.span className="block" style={{ x: line1X }}>
                        <GradientLetters
                            text={firstName}
                            gradient="linear-gradient(90deg, #ffffff, #e2e8f0, #a78bfa)"
                            startIndex={0}
                        />
                    </m.span>
                    <m.span className="block mt-2" style={{ x: line2X }}>
                        <GradientLetters
                            text={lastName}
                            gradient="linear-gradient(90deg, #a78bfa, #c4b5fd, #ffffff)"
                            startIndex={firstName.length}
                        />
                    </m.span>
                    <span
                        aria-hidden="true"
                        className="hero-underline block h-[3px] w-32 md:w-48 mx-auto mt-5 md:mt-6 rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                    />
                </h1>
                </m.div>

                {/* Subtitle */}
                <p
                    className="text-[clamp(1rem,min(2.4vw,3.2vh),1.875rem)] text-slate-300 max-w-4xl mx-auto mb-[clamp(1.5rem,5vh,4rem)] leading-tight font-bold tracking-tight px-4 hero-focus"
                    style={{ ["--d" as string]: "0.55s" }}
                >
                    {content.subtitle || content.description}
                </p>

                {/* CTA Buttons */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4 hero-rise"
                    style={{ ["--d" as string]: "0.7s" }}
                >
                    <MagneticButton
                        as="a"
                        href="#projects"
                        className="w-full sm:w-auto group relative px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-[clamp(1rem,2.2vh,1.5rem)] bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 rounded-2xl text-white text-sm sm:text-base md:text-lg font-black uppercase transition-colors duration-300 shadow-2xl shadow-violet-500/30 active:scale-95 flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                            <span className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-cta-shine" />
                        </span>
                        <span className="relative">View Projects</span>
                        <svg className="relative w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </MagneticButton>
                    <MagneticButton
                        as="a"
                        href="/api/resume"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-[clamp(1rem,2.2vh,1.5rem)] bg-white/[0.06] border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl text-white text-sm sm:text-base md:text-lg font-black uppercase transition-colors duration-300 active:scale-95 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                        Download Resume
                    </MagneticButton>
                </div>
            </m.div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none hero-fade [@media(max-height:820px)]:hidden"
                style={{ ["--d" as string]: "1.1s" }}
            >
                <div className="w-px h-12 bg-gradient-to-b from-violet-400/70 to-transparent animate-scroll-cue" />
                <span className="text-[11px] md:text-xs font-black tracking-widest text-slate-400 uppercase">Scroll to explore</span>
            </div>
        </section>
    );
}
