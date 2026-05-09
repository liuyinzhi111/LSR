'use client';

import { motion } from 'framer-motion';

export default function AnimatedLineBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <motion.div
        animate={{ x: [0, 18, 0], y: [0, -12, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '-34vh',
          left: '-8vw',
          width: '58vw',
          height: '58vw',
          border: '2px solid color-mix(in srgb, var(--color-accent) 18%, transparent)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{ x: [0, -14, 0], y: [0, 18, 0], rotate: [-7, -12, -7] }}
        transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '-8vh',
          right: '24vw',
          width: '22vw',
          height: '70vh',
          border: '2px solid color-mix(in srgb, var(--color-accent) 14%, transparent)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{ x: [0, -22, 0], y: [0, -10, 0], rotate: [8, 14, 8] }}
        transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          right: '-10vw',
          top: '-18vh',
          width: '42vw',
          height: '78vh',
          border: '2px solid color-mix(in srgb, var(--color-accent) 14%, transparent)',
          borderRadius: '50%',
        }}
      />
      <motion.div
        animate={{ x: [0, 16, 0], y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
        style={{
          position: 'absolute',
          left: '18vw',
          bottom: '-42vh',
          width: '46vw',
          height: '46vw',
          border: '2px solid color-mix(in srgb, var(--color-accent) 14%, transparent)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
