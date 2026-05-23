"use client";

import type { CSSProperties } from "react";

const AMBIENT_PAWS = [
  { top: "8%", left: "5%", size: 16, rotate: -14, opacity: 0.1 },
  { top: "14%", left: "18%", size: 12, rotate: 10, opacity: 0.08 },
  { top: "10%", left: "82%", size: 14, rotate: -8, opacity: 0.09 },
  { top: "22%", left: "92%", size: 11, rotate: 16, opacity: 0.07 },
  { top: "38%", left: "4%", size: 13, rotate: 12, opacity: 0.08 },
  { top: "44%", left: "96%", size: 15, rotate: -12, opacity: 0.1 },
  { top: "58%", left: "8%", size: 12, rotate: -18, opacity: 0.07 },
  { top: "62%", left: "88%", size: 14, rotate: 8, opacity: 0.09 },
  { top: "76%", left: "6%", size: 13, rotate: 14, opacity: 0.08 },
  { top: "80%", left: "94%", size: 11, rotate: -10, opacity: 0.07 },
  { top: "32%", left: "3%", size: 10, rotate: 6, opacity: 0.06 },
  { top: "70%", left: "95%", size: 12, rotate: -6, opacity: 0.06 },
] as const;

const FLOATING_PAWS = [
  { left: "4%", delay: 0, duration: 8, size: 14 },
  { left: "11%", delay: 2200, duration: 10, size: 11 },
  { left: "19%", delay: 900, duration: 9, size: 13 },
  { left: "27%", delay: 3400, duration: 11, size: 12 },
  { left: "35%", delay: 1600, duration: 8.5, size: 15 },
  { left: "43%", delay: 4200, duration: 10.5, size: 11 },
  { left: "51%", delay: 600, duration: 9.5, size: 14 },
  { left: "59%", delay: 2800, duration: 11.5, size: 12 },
  { left: "67%", delay: 1200, duration: 8, size: 13 },
  { left: "74%", delay: 3800, duration: 10, size: 11 },
  { left: "81%", delay: 2000, duration: 9, size: 14 },
  { left: "88%", delay: 500, duration: 11, size: 12 },
  { left: "95%", delay: 3000, duration: 10.5, size: 10 },
  { left: "8%", delay: 4600, duration: 12, size: 12 },
  { left: "92%", delay: 1800, duration: 9.5, size: 13 },
] as const;

function FloatingPaw({
  left,
  delay,
  duration,
  size,
}: {
  left: string;
  delay: number;
  duration: number;
  size: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[-10%] select-none text-primary animate-hero-float-paw motion-reduce:hidden"
      style={{
        left,
        fontSize: size,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}s`,
      }}
    >
      🐾
    </span>
  );
}

export function HeroPaws() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {AMBIENT_PAWS.map((paw, index) => (
        <span
          key={`ambient-${index}`}
          className="pointer-events-none absolute select-none text-primary motion-reduce:opacity-[0.08]"
          style={
            {
              top: paw.top,
              left: paw.left,
              fontSize: paw.size,
              opacity: paw.opacity,
              transform: `rotate(${paw.rotate}deg)`,
            } as CSSProperties
          }
        >
          🐾
        </span>
      ))}

      {FLOATING_PAWS.map((paw, index) => (
        <FloatingPaw key={`float-${index}`} {...paw} />
      ))}
    </div>
  );
}
