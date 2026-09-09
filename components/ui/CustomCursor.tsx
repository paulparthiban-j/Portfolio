"use client";

import { useEffect, useState, useRef } from "react";

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const trailRef = useRef<{ x: number; y: number }[]>([]);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        setIsVisible(true);
        
        // Initialize trail
        trailRef.current = Array(5).fill({ x: 0, y: 0 });

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const animateTrail = () => {
            trailRef.current = trailRef.current.map((pos, i) => {
                if (i === 0) {
                    return position;
                }
                const prev = trailRef.current[i - 1];
                return {
                    x: pos.x + (prev.x - pos.x) * 0.3,
                    y: pos.y + (prev.y - pos.y) * 0.3,
                };
            });
            animationRef.current = requestAnimationFrame(animateTrail);
        };

        animateTrail();

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Trail dots */}
            {trailRef.current.map((pos, i) => (
                <div
                    key={i}
                    className="fixed pointer-events-none rounded-full bg-emerald-500/30"
                    style={{
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        width: `${8 - i * 1.5}px`,
                        height: `${8 - i * 1.5}px`,
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.5 - i * 0.1,
                        zIndex: 9998 - i,
                    }}
                />
            ))}
            {/* Main cursor */}
            <div
                className={`custom-cursor pointer-events-none ${isHovering ? "hovering" : ""}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) ${isHovering ? 'scale(3)' : 'scale(1)'}`,
                    zIndex: 9999,
                }}
            />
        </>
    );
}
