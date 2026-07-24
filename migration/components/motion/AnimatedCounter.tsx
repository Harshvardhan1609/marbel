"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number; // in seconds
  suffix?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          setCount(Math.floor(value));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
