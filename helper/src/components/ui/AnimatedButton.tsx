'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function AnimatedButton({
  href,
  onClick,
  children,
  variant = 'primary',
  className = '',
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const glow = glowRef.current;
    if (!button || !glow) return;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(glow, {
        opacity: 1,
        scale: 1.2,
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(glow, {
        opacity: 0,
        scale: 1,
        duration: 0.3,
      });
    };

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as globalThis.MouseEvent;
      const rect = button.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      
      gsap.to(glow, {
        x: x - glow.offsetWidth / 2,
        y: y - glow.offsetHeight / 2,
        duration: 0.3,
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousemove', handleMouseMove);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const baseClasses = 'relative overflow-hidden rounded-lg h-12 px-8 font-bold transition-all duration-300';
  const variantClasses = variant === 'primary'
    ? 'bg-primary text-background-dark hover:shadow-lg hover:shadow-primary/50'
    : 'border border-border-dark bg-transparent text-white hover:bg-white/5';

  const content = (
    <>
      <div
        ref={glowRef}
        className="absolute w-32 h-32 bg-white/20 rounded-full blur-xl opacity-0 pointer-events-none"
      />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        ref={buttonRef as any}
        href={href}
        className={`${baseClasses} ${variantClasses} ${className} inline-flex items-center justify-center`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as any}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {content}
    </button>
  );
}
