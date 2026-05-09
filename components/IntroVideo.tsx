'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/**
 * IntroVideo —— 开场动画结束后、Hero 之前的覆盖层视频。
 *
 * 转场效果：随滚动进度，视频被 clip-path 从四周向中心裁切，
 * 露出下方 Hero 页；最终只剩屏幕中心一块 SQUARE 边长的小正方形，
 * 随后 sticky 结束，视频被带出视口。
 *
 * 视频文件路径：/public/videos/intro.mp4
 */
export default function IntroVideo({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [viewBox, setViewBox] = useState('0 0 1000 400');

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  });

  // 跟随视口尺寸计算最终小正方形的 inset 像素值，保证严格正方
  const [insets, setInsets] = useState({ h: 0, v: 0 });
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // 保留视口原比例，最终留下中间 SCALE 倍大小的区域（不裁成正方）
      const SCALE = 0.45;
      setInsets({
        h: Math.max(0, (w * (1 - SCALE)) / 2),
        v: Math.max(0, (h * (1 - SCALE)) / 2),
      });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/signature.svg')
      .then((r) => r.text())
      .then((svg) => {
        if (cancelled) return;
        const vb = svg.match(/viewBox="([^"]+)"/)?.[1];
        if (vb) setViewBox(vb);
        const parts = [...svg.matchAll(/\sd="([^"]+)"/g)]
          .map((m) => m[1].trim())
          .filter(Boolean);
        if (parts.length > 0) setPaths(parts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // 滚动 0→85% 区间内，inset 从 0 一路加到“只剩中心小正方形”；85%→100% 保持
  // wrapper 600vh：sticky pin 区间约为 0 → 0.833；
  // 所有 intro 动画必须在 0.83 之前完成，签完后再继续滚才会离开 sticky。
  const insetH = useTransform(scrollYProgress, [0, 0.32, 1], [0, insets.h, insets.h]);
  const insetV = useTransform(scrollYProgress, [0, 0.32, 1], [0, insets.v, insets.v]);
  // 初始无圆角（视频铺满），随裁切进度 0→0.32 圆角从 0 渐变到 28px
  const radius = useTransform(scrollYProgress, [0, 0.08, 0.32, 1], [0, 0, 28, 28]);
  const clipPath = useMotionTemplate`inset(${insetV}px ${insetH}px ${insetV}px ${insetH}px round ${radius}px)`;
  const overlayOpacity = useTransform(scrollYProgress, [0.28, 0.40], [0, 0.82]);
  const signatureOpacity = useTransform(scrollYProgress, [0.28, 0.36], [0, 1]);
  const signatureY = useTransform(scrollYProgress, [0.28, 0.36], [18, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.78, 0.83], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.78, 0.83], [12, 0]);
  return (
    <div ref={wrapperRef} style={{ position: 'relative', height: '600vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        >
          {children}
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            // drop-shadow 作用于被裁切后的可见区域，让视频窗口“浮”在 Hero 上面
            filter:
              'drop-shadow(0 24px 48px rgba(0,0,0,0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
            WebkitFilter:
              'drop-shadow(0 24px 48px rgba(0,0,0,0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.25))',
          }}
        >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            clipPath,
            WebkitClipPath: clipPath,
          }}
        >
          <video
            src="/videos/intro.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: '#000',
            }}
          />
        </motion.div>
        </div>

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            backgroundColor: 'rgba(220, 220, 220, 0.55)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            opacity: overlayOpacity,
            pointerEvents: 'none',
            // 用同一个 clipPath 让灰色蒙版只覆盖视频窗口区域
            clipPath,
            WebkitClipPath: clipPath,
          }}
        />

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: signatureOpacity,
            y: signatureY,
          }}
        >
          <div
            style={{
              width: 'min(72vw, 880px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            <svg
              viewBox={viewBox}
              preserveAspectRatio="xMidYMid meet"
              style={{
                width: '100%',
                height: 'auto',
                overflow: 'visible',
                display: 'block',
              }}
            >
              {paths.map((d, i) => {
                // 笔画区间：0.36 → 0.78（跟随变灰同步开写，写得更从容）
                const start = 0.36 + (i / paths.length) * 0.42;
                const end = 0.36 + ((i + 1) / paths.length) * 0.42;
                return (
                  <SignatureStroke
                    key={i}
                    d={d}
                    start={start}
                    end={end}
                    progress={scrollYProgress}
                  />
                );
              })}
            </svg>

            <motion.p
              style={{
                opacity: captionOpacity,
                y: captionY,
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.18em',
                color: 'rgba(255, 255, 255, 0.72)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              刘盛瑞 · AI Product Manager
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SignatureStroke({
  d,
  start,
  end,
  progress,
}: {
  d: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
  const dashoffset = useMotionValue(1);

  const computeOffset = (p: number): number => {
    const t = (p - start) / (end - start);
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    return 1 - t;
  };

  useEffect(() => {
    dashoffset.set(computeOffset(progress.get()));
  }, []);

  useMotionValueEvent(progress, 'change', (p) => {
    dashoffset.set(computeOffset(p));
  });

  return (
    <motion.path
      d={d}
      pathLength={1}
      fill="none"
      stroke="#ff5a1a"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 1,
        strokeDashoffset: dashoffset,
      }}
    />
  );
}
