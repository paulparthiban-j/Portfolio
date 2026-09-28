"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CounterProps {
  target: number;
  suffix?: string;
  className?: string;
}

const DURATION = 1600;

export function Counter({ target, suffix = "", className = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    // rAF + ease-out instead of a 16ms setInterval: synced to the display,
    // and pauses automatically in background tabs.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : DURATION;
    const decimals = Number.isInteger(target) ? 0 : 1;
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = duration ? Math.min((now - start) / duration, 1) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Number((target * eased).toFixed(decimals)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      {count}{suffix}
    </motion.span>
  );
}
