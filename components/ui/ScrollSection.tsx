"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { ReactNode } from "react";

interface ScrollSectionProps {
    children: ReactNode;
    className?: string;
    animationType?: "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale-in" | "fade-in" | "rotate-in";
}

export function ScrollSection({
    children,
    className = "",
    animationType = "slide-up",
}: ScrollSectionProps) {
    const { ref, isVisible } = useScrollAnimation();
    return (
        <div
            ref={ref}
            className={`scroll-${animationType} ${isVisible ? "visible" : ""} ${className}`}
        >
            {children}
        </div>
    );
}
