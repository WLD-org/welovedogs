"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "section" | "li" | "p" | "h1" | "h2" | "h3";
};

export function Reveal({ children, className, delayMs = 0, as: Tag = "div" }: RevealProps) {
  const { ref, inView } = useInView();

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}

type AnimatedBarProps = {
  widthPercent: number;
  highlight?: boolean;
  delayMs?: number;
};

export function AnimatedBar({ widthPercent, highlight = false, delayMs = 0 }: AnimatedBarProps) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <div ref={ref as never} className="mb-2 h-3 overflow-hidden rounded-full bg-white/10">
      <div
        className={cn(
          "h-full origin-left rounded-full transition-transform duration-1000 ease-out motion-reduce:transition-none",
          highlight
            ? "bg-gradient-to-r from-amber-400 to-orange-400"
            : "bg-gradient-to-r from-purple-400 to-fuchsia-400",
          inView && "animate-bar-shimmer"
        )}
        style={{
          width: `${widthPercent}%`,
          transform: inView ? "scaleX(1)" : "scaleX(0)",
          transitionDelay: `${delayMs}ms`,
        }}
        role="presentation"
      />
    </div>
  );
}

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  durationMs?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  durationMs = 1800,
}: AnimatedCounterProps) {
  const { ref, inView } = useInView({ threshold: 0.4 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(value * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, durationMs]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : value >= 1_000_000
        ? `${Math.round(displayValue / 1_000_000)}`
        : Math.round(displayValue).toLocaleString();

  return (
    <span ref={ref as never} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function StaticPaw({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute select-none", className)} style={style}>
      🐾
    </span>
  );
}

const STATIC_PAWS = [
  { top: "6%", left: "4%", size: 22, rotate: -18, opacity: 0.22 },
  { top: "14%", left: "18%", size: 16, rotate: 12, opacity: 0.18 },
  { top: "8%", left: "34%", size: 20, rotate: -8, opacity: 0.24 },
  { top: "20%", left: "52%", size: 14, rotate: 22, opacity: 0.16 },
  { top: "10%", left: "68%", size: 18, rotate: -14, opacity: 0.2 },
  { top: "18%", left: "82%", size: 15, rotate: 8, opacity: 0.17 },
  { top: "12%", left: "94%", size: 19, rotate: -20, opacity: 0.21 },
  { top: "38%", left: "7%", size: 17, rotate: 16, opacity: 0.19 },
  { top: "44%", left: "24%", size: 21, rotate: -10, opacity: 0.23 },
  { top: "36%", left: "41%", size: 13, rotate: 24, opacity: 0.15 },
  { top: "42%", left: "58%", size: 18, rotate: -16, opacity: 0.2 },
  { top: "40%", left: "74%", size: 16, rotate: 6, opacity: 0.18 },
  { top: "48%", left: "88%", size: 20, rotate: -12, opacity: 0.22 },
  { top: "62%", left: "12%", size: 15, rotate: -22, opacity: 0.17 },
  { top: "68%", left: "30%", size: 19, rotate: 10, opacity: 0.21 },
  { top: "64%", left: "48%", size: 14, rotate: -6, opacity: 0.16 },
  { top: "70%", left: "66%", size: 17, rotate: 18, opacity: 0.19 },
  { top: "66%", left: "84%", size: 21, rotate: -14, opacity: 0.23 },
  { top: "82%", left: "6%", size: 16, rotate: 8, opacity: 0.18 },
  { top: "88%", left: "22%", size: 18, rotate: -18, opacity: 0.2 },
  { top: "84%", left: "40%", size: 15, rotate: 14, opacity: 0.17 },
  { top: "90%", left: "56%", size: 20, rotate: -8, opacity: 0.22 },
  { top: "86%", left: "72%", size: 14, rotate: 20, opacity: 0.16 },
  { top: "92%", left: "90%", size: 17, rotate: -10, opacity: 0.19 },
] as const;

function FloatingParticle({ delayMs, left, size, bottom }: { delayMs: number; left: string; size: number; bottom?: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute animate-float-paw text-white/35 motion-reduce:animate-none"
      style={{
        left,
        bottom: bottom ?? "-10%",
        fontSize: size,
        animationDelay: `${delayMs}ms`,
        animationDuration: `${4 + (delayMs % 3)}s`,
      }}
    >
      🐾
    </span>
  );
}

export function CrisisParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {STATIC_PAWS.map((paw, index) => (
        <StaticPaw
          key={`static-paw-${index}`}
          className="text-white"
          style={{
            top: paw.top,
            left: paw.left,
            fontSize: paw.size,
            opacity: paw.opacity,
            transform: `rotate(${paw.rotate}deg)`,
          }}
        />
      ))}

      <FloatingParticle delayMs={0} left="5%" size={20} />
      <FloatingParticle delayMs={600} left="20%" size={16} />
      <FloatingParticle delayMs={1200} left="35%" size={22} />
      <FloatingParticle delayMs={300} left="50%" size={18} />
      <FloatingParticle delayMs={900} left="65%" size={15} />
      <FloatingParticle delayMs={1500} left="78%" size={19} />
      <FloatingParticle delayMs={450} left="90%" size={17} />
      <FloatingParticle delayMs={1800} left="96%" size={14} />
    </div>
  );
}
