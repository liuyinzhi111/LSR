'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const IDLE_MS = 5000;

export default function ScrollHint() {
  const [visible, setVisible] = useState(false);
  const enabledRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };

    const armTimer = () => {
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        setVisible(true);
      }, IDLE_MS);
    };

    const handleWheel = () => {
      if (!enabledRef.current) return;
      setVisible(false);
      armTimer();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    const handleIntroComplete = () => {
      enabledRef.current = true;
      armTimer();
    };
    window.addEventListener('intro-animation-complete', handleIntroComplete);

    return () => {
      clearTimer();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('intro-animation-complete', handleIntroComplete);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            left: 'clamp(18px, 3vw, 40px)',
            bottom: 'clamp(18px, 3vw, 40px)',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(10,10,10,0.12)',
            backgroundColor: 'rgba(245,245,244,0.72)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            pointerEvents: 'none',
            boxShadow: '0 16px 40px rgba(10,10,10,0.08)',
          }}
        >
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
            style={{ color: '#ff5a1a', fontSize: '14px', lineHeight: 1 }}
          >
            ↓
          </motion.span>
          <motion.span
            animate={{ opacity: [0.62, 1, 0.62] }}
            transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
          >
            向下滚动继续浏览
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
