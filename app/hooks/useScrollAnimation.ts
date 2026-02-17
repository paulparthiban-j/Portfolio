"use client";

import { useEffect, useRef, useState } from "react";

// Throttle function to limit the number of times a function is called
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function useScrollAnimation(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isVisible };
}

export function useSectionAnimation(isFirst: boolean = false, sectionIndex: number = 0) {
  const [isVisible, setIsVisible] = useState(isFirst);
  const [isExiting, setIsExiting] = useState(false);
  const [isPrev, setIsPrev] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isIntersecting, boundingClientRect } = entry;

        setIsVisible(isIntersecting);

        // Determine if it's above or below the viewport
        if (boundingClientRect.top < 0 && !isIntersecting) {
          setIsPrev(true);
          setIsNext(false);
          setIsExiting(true);
        } else if (boundingClientRect.top > 0 && !isIntersecting) {
          setIsNext(true);
          setIsPrev(false);
          setIsExiting(false);
        } else {
          setIsPrev(false);
          setIsNext(false);
          setIsExiting(false);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: "-10% 0px -10% 0px", // Add some margin for smoother triggers
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [sectionIndex]);

  return {
    ref,
    isVisible,
    isExiting,
    isPrev,
    isNext
  };
}

export function useStaggeredAnimation(count: number, delay: number = 100) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isIntersecting && !hasTriggered.current && count > 0) {
      hasTriggered.current = true;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          setVisibleCount((prev) => Math.max(prev, i + 1));
        }, i * delay);
      }
    } else if (hasTriggered.current && count > visibleCount) {
      for (let i = visibleCount; i < count; i++) {
        setTimeout(() => {
          setVisibleCount((prev) => Math.max(prev, i + 1));
        }, (i - visibleCount) * delay);
      }
    }
  }, [count, delay, isIntersecting, visibleCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, visibleCount };
}
