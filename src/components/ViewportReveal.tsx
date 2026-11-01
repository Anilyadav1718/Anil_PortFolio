'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ViewportRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ViewportReveal({ children, className = '', delay = 0 }: ViewportRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

