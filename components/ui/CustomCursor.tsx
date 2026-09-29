"use client";

import { useEffect, useSyncExternalStore } from "react";
import { m, useMotionValue, useSpring, useTransform } from "framer-motion";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
    const mql = window.matchMedia(QUERY);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
}

// false on the server and during hydration, so the cursor is never part of the
// server HTML. It used to be rendered there and then moved by script, which
// showed up as a layout shift.
const useFinePointer = () =>
    useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);

export function CustomCursor() {
    const enabled = useFinePointer();
    return enabled ? <Cursor /> : null;
}

function Cursor() {
    const x = useMotionValue(-100);
    const y = useMotionValue(-100);
    const hovering = useMotionValue(0);
    const pressed = useMotionValue(0);

    // Dot tracks the pointer tightly; the ring trails behind on a softer spring
    const dotX = useSpring(x, { stiffness: 1500, damping: 60 });
    const dotY = useSpring(y, { stiffness: 1500, damping: 60 });
    const ringX = useSpring(x, { stiffness: 250, damping: 25, mass: 0.6 });
    const ringY = useSpring(y, { stiffness: 250, damping: 25, mass: 0.6 });
    const ringScale = useSpring(
        useTransform([hovering, pressed], ([h, p]: number[]) => (h ? 1.8 : 1) * (p ? 0.8 : 1)),
        { stiffness: 300, damping: 20 }
    );
    const ringOpacity = useSpring(useTransform(hovering, [0, 1], [0.5, 1]), { stiffness: 300, damping: 30 });
    const dotScale = useSpring(useTransform(hovering, [0, 1], [1, 0]), { stiffness: 400, damping: 25 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };
        const over = (e: MouseEvent) => {
            hovering.set((e.target as HTMLElement).closest("a, button, .cursor-pointer") ? 1 : 0);
        };
        const down = () => pressed.set(1);
        const up = () => pressed.set(0);

        window.addEventListener("mousemove", move, { passive: true });
        window.addEventListener("mouseover", over, { passive: true });
        window.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseover", over);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
        };
    }, [x, y, hovering, pressed]);

    return (
        <>
            <m.div
                aria-hidden="true"
                className="fixed top-0 left-0 z-[9999] pointer-events-none w-9 h-9 -ml-[18px] -mt-[18px] rounded-full border border-violet-400/70 bg-violet-400/5"
                style={{ x: ringX, y: ringY, scale: ringScale, opacity: ringOpacity }}
            />
            <m.div
                aria-hidden="true"
                className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 -ml-1 -mt-1 rounded-full bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.8)]"
                style={{ x: dotX, y: dotY, scale: dotScale }}
            />
        </>
    );
}
