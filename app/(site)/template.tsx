"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function RouteTemplate({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  const transitionConfig = {
    duration: 0.35,
    ease: [0.25, 0.1, 0.25, 1.0] as const, // Consistent 350ms luxury ease
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  // Instant layout fallback for reduced motion
  if (shouldReduceMotion) {
    return <main>{children}</main>;
  }

  return (
    <motion.main
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transitionConfig}
    >
      {children}
    </motion.main>
  );
}
