"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Components use the lightweight `m.*` elements. The root provides Framer's
 * core animation + gesture features synchronously (so nothing re-renders when
 * they "arrive"); the heavier layout-animation engine is left out and loaded
 * lazily only by the skills grid, the one place that needs it (see
 * SkillsSection). `strict` makes a stray full `motion.*` component throw, so
 * the savings can't silently regress.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
    return (
        <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LazyMotion>
    );
}
