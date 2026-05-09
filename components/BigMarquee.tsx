'use client';

import type { CSSProperties } from 'react';
import { motion, type MotionValue } from 'framer-motion';

/**
 * BigMarquee —— 极简风格双层背景跑马灯。
 * 上层向左慢动（浅黑），下层向右慢动（浅橙），linear infinite。
 * 作为视频背后的装饰背景，opacity 由父级滚动进度控制。
 */
const MARQUEE_LINE_TOP =
  'DECODING AESTHETICS · AI PRODUCT MANAGER · JASON · ';
const MARQUEE_LINE_BOTTOM =
  'PROMPT TO PRODUCT · HUMAN × AI · LIU SHENGRUI · ';

const bigMarqueeTextBase: CSSProperties = {
  fontFamily: 'var(--font-condensed), var(--font-display)',
  fontWeight: 900,
  fontSize: 'clamp(7rem, 22vh, 22vh)',
  letterSpacing: '-0.02em',
  lineHeight: 1,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  margin: 0,
  display: 'flex',
  flexWrap: 'nowrap',
  width: 'max-content',
  willChange: 'transform',
  pointerEvents: 'none',
  userSelect: 'none',
};

function BigMarqueeRow({
  text,
  color,
  direction,
  duration,
}: {
  text: string;
  color: string;
  direction: 'left' | 'right';
  duration: number;
}) {
  const copies = [0, 1, 2, 3];
  const xKeyframes = direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'];

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{ ...bigMarqueeTextBase, color }}
        animate={{ x: xKeyframes }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {copies.map((i) => (
          <span
            key={i}
            style={{ flexShrink: 0, paddingRight: '0.4em' }}
            aria-hidden={i > 0 ? 'true' : undefined}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function BigMarquee({
  opacity,
}: {
  opacity?: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        zIndex: 0,
        pointerEvents: 'none',
        ...(opacity ? { opacity } : null),
      }}
    >
      <BigMarqueeRow
        text={MARQUEE_LINE_TOP}
        color="rgba(0, 0, 0, 0.58)"
        direction="left"
        duration={200}
      />
      <BigMarqueeRow
        text={MARQUEE_LINE_BOTTOM}
        color="rgba(255, 82, 16, 0.9)"
        direction="right"
        duration={220}
      />
    </motion.div>
  );
}
