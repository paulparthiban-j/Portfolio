"use client";

import { ReactNode } from "react";

interface StaggeredItemProps {
    children: ReactNode;
    index: number;
    delay?: number;
}

export function StaggeredItem({
    children,
    index,
    delay = 100,
}: StaggeredItemProps) {
    return (
        <div
            className="stagger-item relative"
            style={{ transitionDelay: `${index * delay}ms` }}
        >
            {children}
        </div>
    );
}
