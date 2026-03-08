"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
    target: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({
    target,
    prefix = "",
    suffix = "",
    decimals = 0,
    duration = 2,
    className = "",
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obj = { value: 0 };

        const ctx = gsap.context(() => {
            gsap.to(obj, {
                value: target,
                duration,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    once: true,
                },
                onUpdate: () => {
                    el.textContent = `${prefix}${obj.value.toFixed(decimals)}${suffix}`;
                },
            });
        });

        return () => ctx.revert();
    }, [target, prefix, suffix, decimals, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}0{suffix}
        </span>
    );
}
