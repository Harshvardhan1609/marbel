"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInUpProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
