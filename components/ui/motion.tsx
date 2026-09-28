"use client";

import { ReactNode, useRef } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    type Variants,
} from "framer-motion";

// Shared Framer Motion building blocks for the page sections. Everything
// animates transform/opacity only (compositor friendly), reveals once, and
// MotionConfig reducedMotion="user" in HomePage turns the movement off for
// visitors who ask for reduced motion.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Parent that staggers its children in when scrolled into view. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Child that springs up into place. */
export const riseItem: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 120, damping: 18, mass: 0.8 },
    },
};

/** Child that flips up from below like a card being turned over. */
export const flipItem: Variants = {
    hidden: { opacity: 0, y: 60, rotateX: 28, scale: 0.94 },
    show: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 90, damping: 16 },
    },
};

export const inViewOnce = { once: true, margin: "0px 0px -80px 0px" } as const;

interface SectionHeadingProps {
    title: string;
    subtitle?: ReactNode;
    className?: string;
    size?: "lg" | "md";
}

/**
 * Section title whose words rise one after another out of a mask, followed by
 * the subtitle and an accent bar that draws itself from the centre.
 */
export function SectionHeading({ title, subtitle, className = "", size = "lg" }: SectionHeadingProps) {
    const words = title.split(" ");
    const sizeClass = size === "lg" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl";

    return (
        <motion.div
            className={`text-center ${className}`}
            initial="hidden"
            whileInView="show"
            viewport={inViewOnce}
            variants={staggerContainer(0.07)}
        >
            <h2
                aria-label={title}
                className={`${sizeClass} font-black tracking-tighter text-white uppercase leading-none`}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
                {words.map((word, i) => (
                    <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                        <motion.span
                            className="inline-block"
                            variants={{
                                hidden: { y: "110%", rotate: 4 },
                                show: { y: "0%", rotate: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
                            }}
                        >
                            {word}
                        </motion.span>
                        {i < words.length - 1 && " "}
                    </span>
                ))}
            </h2>
            {subtitle && (
                <motion.p
                    className="text-slate-400 text-sm md:text-lg mt-4 max-w-2xl mx-auto font-medium"
                    variants={{
                        hidden: { opacity: 0, y: 12 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
                    }}
                >
                    {subtitle}
                </motion.p>
            )}
            <motion.div
                className="h-1 w-24 rounded-full mt-6 mx-auto bg-gradient-to-r from-violet-500 via-fuchsia-400 to-violet-500"
                variants={{
                    hidden: { scaleX: 0, opacity: 0 },
                    show: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
                }}
            />
        </motion.div>
    );
}

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    /** rgb triplet of the spotlight colour */
    color?: string;
    variants?: Variants;
    onClick?: () => void;
}

/**
 * Card with a soft light that follows the pointer and a lit-up border under it.
 * The gradient is driven by motion values, so moving the mouse never
 * re-renders React. Lifts slightly on hover.
 */
export function SpotlightCard({ children, className = "", color = "139, 92, 246", variants, onClick }: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mx = useMotionValue(-400);
    const my = useMotionValue(-400);
    const x = useSpring(mx, { stiffness: 300, damping: 30 });
    const y = useSpring(my, { stiffness: 300, damping: 30 });
    const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(${color}, 0.14), transparent 70%)`;
    const ring = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgba(${color}, 0.65), transparent 70%)`;

    const handleMove = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
    };

    const handleLeave = () => {
        mx.set(-400);
        my.set(-400);
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            onClick={onClick}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className={`relative group ${className}`}
        >
            {/* Border highlight: a gradient masked down to a 1px ring */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] [-webkit-mask-composite:xor]"
                style={{ background: ring }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: glow }}
            />
            {children}
        </motion.div>
    );
}
