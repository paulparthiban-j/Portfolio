"use client";

import { m, useScroll } from "framer-motion";

export function ScrollProgress() {
  // Motion value + scaleX: updates on the compositor without re-rendering
  // React or triggering layout on every scroll event.
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[200]">
      <m.div
        className="h-full origin-left bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
