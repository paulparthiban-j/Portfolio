"use client";

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
}: AnimatedSectionProps) {
    return (
        <section className={`relative ${className}`}>
            {children}
        </section>
    );
}
