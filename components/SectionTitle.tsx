'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

type SectionTitleProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export default function SectionTitle({ children, style }: SectionTitleProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.55 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'clamp(2.5rem, 7vw, 6rem)',
        lineHeight: 0.95,
        letterSpacing: '-0.02em',
        color: 'var(--color-accent)',
        textTransform: 'uppercase',
        margin: 0,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </motion.h2>
  );
}
