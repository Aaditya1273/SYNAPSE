'use client';

import { useRef, useEffect, ReactNode, useState } from 'react';
import { gsap } from 'gsap';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    // Reset animation state on mount
    setHasAnimated(false);

    // Initial animation - always run on mount
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(card, { y: 50, opacity: 0 });
      
      // Animate in
      gsap.to(card, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        onComplete: () => {
          setHasAnimated(true);
          // Ensure final state is set
          gsap.set(card, { clearProps: 'all' });
        }
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasAnimated) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(glow, {
        x: x - glow.offsetWidth / 2,
        y: y - glow.offsetHeight / 2,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Tilt effect
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      if (!hasAnimated) return;
      gsap.to(glow, {
        opacity: 0.6,
        scale: 1,
        duration: 0.3,
      });
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      if (!hasAnimated) return;
      gsap.to(glow, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
      });
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ctx.revert();
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]); // Re-run when component mounts

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl border border-primary/30 bg-black/40 backdrop-blur-sm p-8 transition-all duration-300 ${className}`}
      style={{ transformStyle: 'preserve-3d', opacity: 1 }}
    >
      <div
        ref={glowRef}
        className="absolute w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-0 pointer-events-none"
        style={{ zIndex: -1 }}
      />
      {children}
    </div>
  );
}
