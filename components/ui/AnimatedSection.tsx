"use client";

import { useSectionAnimation } from "@/app/hooks/useScrollAnimation";
import { ReactNode } from "react";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    isFirst?: boolean;
    sectionIndex?: number;
    isActive?: boolean;
}

export function AnimatedSection({
    children,
    className = "",
    isFirst = false,
    sectionIndex = 0,
    isActive: isActiveProp,
}: AnimatedSectionProps) {
    const { ref, isVisible: isVisibleObs, isExiting, isPrev, isNext } = useSectionAnimation(isFirst, sectionIndex);

    // Use prop if available, otherwise fallback to observer (for standalone usage)
    const isVisible = isActiveProp !== undefined ? isActiveProp : isVisibleObs;

    return (
        <section
            ref={ref}
            className={`full-page-section-content ${isVisible ? "section-visible" : ""} ${isExiting ? "section-exit" : ""} ${isPrev ? "section-prev" : ""} ${isNext ? "section-next" : ""} ${className}`}
        >
            {children}
        </section>
    );
}
