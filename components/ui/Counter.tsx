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
  // Bottom margin only: a margin on all sides shrank the "viewport" to a thin
  // centre strip on narrow phones, so left-column counters never started
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  useEffect(() => {
    if (!isInView) return;

    // rAF + ease-out instead of a 16ms setInterval: synced to the display,
    // and pauses automatically in background tabs.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : DURATION;
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = duration ? Math.min((now - start) / duration, 1) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  // Constant-width text: fixed decimals, padded with figure spaces (the width
  // of a tabular digit) to the final value's length, number and suffix in one
  // text node. Counting up then never moves any glyph (no layout shift).
  const decimals = Number.isInteger(target) ? 0 : 1;
  const finalText = target.toFixed(decimals);
  const label = `${count.toFixed(decimals).padStart(finalText.length, "\u2007")}${suffix}`;

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`tabular-nums whitespace-pre ${className}`}
    >
      <span className="sr-only">{`${finalText}${suffix}`}</span>
      <span aria-hidden="true">{label}</span>
    </motion.span>
  );
}
