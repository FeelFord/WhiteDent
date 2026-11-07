"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={{ opacity: 1, y: 0 }}
      whileInView={reducedMotion ? {} : { y: [14, 0] }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, delay }}>
      {children}
    </motion.div>
  );
}
