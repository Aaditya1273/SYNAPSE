"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CreditScoreGaugeProps {
    score: number; // 0-100
    size?: number;
}

export default function CreditScoreGauge({ score, size = 220 }: CreditScoreGaugeProps) {
    const arcRef = useRef<SVGPathElement>(null);
    const textRef = useRef<SVGTextElement>(null);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    const startAngle = -210;
    const totalAngle = 240;

    function polarToCartesian(angle: number) {
        const rad = ((angle - 90) * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    }

    function describeArc(startAng: number, endAng: number) {
        const s = polarToCartesian(startAng);
        const e = polarToCartesian(endAng);
        const largeArc = endAng - startAng > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    }

    const bgPath = describeArc(startAngle, startAngle + totalAngle);
    const strokeColor =
        score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

    const arcLength = (score / 100) * totalAngle;
    const targetPath = describeArc(startAngle, startAngle + arcLength);

    useEffect(() => {
        const el = arcRef.current;
        const textEl = textRef.current;
        if (!el || !textEl) return;

        const totalLen = el.getTotalLength();
        gsap.set(el, { strokeDasharray: totalLen, strokeDashoffset: totalLen });

        const obj = { val: 0 };
        const ctx = gsap.context(() => {
            gsap.to(el, {
                strokeDashoffset: 0,
                duration: 1.8,
                ease: "power3.out",
                delay: 0.3,
            });
            gsap.to(obj, {
                val: score,
                duration: 1.8,
                ease: "power3.out",
                delay: 0.3,
                onUpdate: () => {
                    if (textEl) textEl.textContent = Math.round(obj.val).toString();
                },
            });
        });
        return () => ctx.revert();
    }, [score]);

    return (
        <svg width={size} height={size} className="drop-shadow-2xl">
            <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor={strokeColor} />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background arc */}
            <path
                d={bgPath}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={size * 0.07}
                strokeLinecap="round"
            />

            {/* Score arc */}
            <path
                ref={arcRef}
                d={targetPath}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth={size * 0.07}
                strokeLinecap="round"
                filter="url(#glow)"
            />

            {/* Center score */}
            <text
                ref={textRef}
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.22}
                fontWeight="800"
                fontFamily="Outfit, sans-serif"
                fill="white"
            >
                0
            </text>
            <text
                x={cx}
                y={cy + size * 0.14}
                textAnchor="middle"
                fontSize={size * 0.066}
                fill="rgba(255,255,255,0.4)"
                fontFamily="Inter, sans-serif"
            >
                CREST SCORE
            </text>

            {/* Min / Max labels */}
            <text
                x={cx - r * 0.85}
                y={cy + r * 0.72}
                fontSize={size * 0.055}
                fill="rgba(255,255,255,0.3)"
                fontFamily="Inter, sans-serif"
            >
                0
            </text>
            <text
                x={cx + r * 0.7}
                y={cy + r * 0.72}
                fontSize={size * 0.055}
                fill="rgba(255,255,255,0.3)"
                fontFamily="Inter, sans-serif"
            >
                100
            </text>
        </svg>
    );
}
