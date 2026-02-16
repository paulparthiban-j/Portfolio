"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Hide when out of view for reappear effect
          setIsVisible(false);
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isVisible };
}

export function useSectionAnimation(isFirst: boolean = false, sectionIndex: number = 0) {
  const [isVisible, setIsVisible] = useState(isFirst);
  const [isExiting, setIsExiting] = useState(false);
  const [isPrev, setIsPrev] = useState(false);
  const [isPrev2, setIsPrev2] = useState(false);
  const [isPrev3, setIsPrev3] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const lastScrollY = useRef(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight || 1;

      const newDirection = scrollY > lastScrollY.current ? 'down' : 'up';
      setDirection(newDirection);
      lastScrollY.current = scrollY;

      // Use a slightly more complex logic for visibility
      // Current section index based on scroll position
      const exactIndex = scrollY / viewportHeight;
      const currentSectionIndex = Math.round(exactIndex);
      const distanceFromCurrent = sectionIndex - currentSectionIndex;

      // Precise progress within this section (0 is active, negative is above, positive is below)
      const sectionTop = sectionIndex * viewportHeight;
      const progressToSection = (scrollY - sectionTop) / viewportHeight;

      // Section is active if it's the primary one being viewed
      if (distanceFromCurrent === 0) {
        setIsVisible(true);
        setIsExiting(false);
        setIsPrev(false);
        setIsPrev2(false);
        setIsPrev3(false);
        setIsNext(false);
      } else if (distanceFromCurrent === 1) {
        // This section is NEXT (below current)
        setIsNext(true);
        setIsVisible(false);
        setIsExiting(false);
        setIsPrev(false);
        setIsPrev2(false);
        setIsPrev3(false);
      } else if (distanceFromCurrent === -1) {
        // This section is PREVIOUS (above current)
        setIsPrev(true);
        setIsVisible(false);
        setIsExiting(false);
        setIsNext(false);
        setIsPrev2(false);
        setIsPrev3(false);
      } else if (distanceFromCurrent === -2) {
        setIsPrev2(true);
        setIsVisible(false);
        setIsExiting(false);
        setIsPrev(false);
        setIsNext(false);
        setIsPrev3(false);
      } else if (distanceFromCurrent === -3) {
        setIsPrev3(true);
        setIsVisible(false);
        setIsExiting(false);
        setIsPrev(false);
        setIsPrev2(false);
        setIsNext(false);
      } else if (distanceFromCurrent > 1) {
        // Far below
        setIsVisible(false);
        setIsExiting(false);
        setIsPrev(false);
        setIsPrev2(false);
        setIsPrev3(false);
        setIsNext(false);
      } else {
        // Far above
        setIsExiting(true);
        setIsVisible(false);
        setIsPrev(false);
        setIsPrev2(false);
        setIsPrev3(false);
        setIsNext(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sectionIndex, isFirst]);

  return { ref, isVisible, isExiting, isPrev, isPrev2, isPrev3, isNext, progress: (window.scrollY - sectionIndex * window.innerHeight) / window.innerHeight };
}


export function useStaggeredAnimation(count: number, delay: number = 100) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  // Restart or update animation if count changes and we've triggered
  useEffect(() => {
    if (isIntersecting && !hasTriggered.current && count > 0) {
      hasTriggered.current = true;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          setVisibleCount((prev) => Math.max(prev, i + 1));
        }, i * delay);
      }
    } else if (hasTriggered.current && count > visibleCount) {
      // If items were added later, animate them too
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, visibleCount };
}
