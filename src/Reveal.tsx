import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant = 'card' | 'stat' | 'heading' | 'chart' | 'image' | 'section' | 'default';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // In milliseconds
  as?: React.ElementType;
  variant?: RevealVariant;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Component = 'div',
  variant = 'default',
  onClick,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Accessibility: check for prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setRevealed(true);
        return;
      }
    }

    // Set up single-trigger IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const variantClassMap: Record<RevealVariant, string> = {
    card: 'anim-card',
    stat: 'anim-stat',
    heading: 'anim-heading',
    chart: 'anim-chart',
    image: 'anim-image',
    section: 'anim-section',
    default: 'scroll-reveal',
  };

  const animClass = variantClassMap[variant] || 'scroll-reveal';

  return (
    <Component
      ref={ref}
      onClick={onClick}
      className={`${animClass} ${revealed ? 'revealed' : ''} ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </Component>
  );
}
