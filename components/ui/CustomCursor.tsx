"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 5;

export function CustomCursor() {
    const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!finePointer || reducedMotion) return;

        // Positions live in refs and are written straight to transforms, so
        // moving the mouse never re-renders React.
        const mouse = { x: -100, y: -100 };
        const trail = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }));
        let hovering = false;
        let frame: number | null = null;

        const render = () => {
            let settled = true;
            trail.forEach((pos, i) => {
                const target = i === 0 ? mouse : trail[i - 1];
                const ease = i === 0 ? 1 : 0.35;
                pos.x += (target.x - pos.x) * ease;
                pos.y += (target.y - pos.y) * ease;
                if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) settled = false;

                const el = dotsRef.current[i];
                if (el) {
                    const scale = i === 0 && hovering ? 3 : 1;
                    el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
                }
            });
            // Stop the loop once the trail has caught up; restart on next move
            frame = settled ? null : requestAnimationFrame(render);
        };

        const kick = () => {
            if (frame === null) frame = requestAnimationFrame(render);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            kick();
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            hovering = !!target.closest("a, button, .cursor-pointer");
            kick();
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("mouseover", handleMouseOver, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <>
            {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
                <div
                    key={i}
                    ref={(el) => { dotsRef.current[i] = el; }}
                    aria-hidden="true"
                    className="hidden [@media(hover:hover)_and_(pointer:fine)]:block motion-reduce:!hidden fixed top-0 left-0 pointer-events-none rounded-full bg-violet-400/40 will-change-transform"
                    style={{
                        width: `${8 - i * 1.5}px`,
                        height: `${8 - i * 1.5}px`,
                        opacity: 0.6 - i * 0.1,
                        zIndex: 9999 - i,
                        transform: "translate3d(-100px, -100px, 0)",
                    }}
                />
            ))}
        </>
    );
}
