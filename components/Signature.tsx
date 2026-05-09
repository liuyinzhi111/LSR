'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';

/**
 * Signature
 * --------------------------------------------------------------
 * 200vh 滚动容器，内部 sticky 视口固定。SVG 签名按笔画顺序
 * （以 d 属性中大写 `M` 命令为分割点）依次写出，写完后
 * 落款"刘盛瑞 · AI Product Manager"淡入。
 *
 * SVG 来源：public/signature.svg（运行时 fetch 后解析拆分）。
 * 所有 path 统一转为：fill="none" stroke="var(--color-ink)" strokeWidth={1.5}。
 *
 * 滚动进度划分：
 *   [0, 0.80]  → 9 笔依次书写（每笔占 0.80/N）
 *   [0.85, 0.95] → 落款淡入
 */
export default function Signature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [viewBox, setViewBox] = useState('0 0 1000 400');
  const reduce = useReducedMotion();

  // 客户端拉取 SVG 并按大写 M 命令拆分笔画
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
        if (parts.length === 0) return;
        setPaths(parts);
      })
      .catch(() => {
        /* 静默失败：保持空数组，签名区只显示落款占位 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 落款淡入 + 上移
  const captionOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.85, 0.95], [12, 0]);

  const WRITE_END = 0.8;

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '200vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
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
              const start = (i / paths.length) * WRITE_END;
              const end = ((i + 1) / paths.length) * WRITE_END;
              return (
                <Stroke
                  key={i}
                  d={d}
                  start={start}
                  end={end}
                  progress={scrollYProgress}
                  reduce={!!reduce}
                />
              );
            })}
          </svg>

          <motion.p
            style={
              reduce
                ? { opacity: 1 }
                : { opacity: captionOpacity, y: captionY }
            }
            className="signature-caption"
          >
            刘盛瑞 · AI Product Manager
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/**
 * 单笔画 path：根据滚动进度区间 [start, end] 把 strokeDashoffset
 * 从 length 线性插值到 0，实现"边写边出现"。
 */
function Stroke({
  d,
  start,
  end,
  progress,
  reduce,
}: {
  d: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // 用 SVG 标准 pathLength=1 把 path 长度归一化为 1，
  // 这样 dasharray=1 + dashoffset∈[1, 0] 就直接对应 [全隐藏, 全显]，
  // 不再需要 getTotalLength（避免之前测量失败导致整张完整显示的 bug）。
  const dashoffset = useMotionValue(1);

  // 把 [start, end] 区间的 progress 映射到 [1, 0]，clamp 到区间外
  const computeOffset = (p: number): number => {
    if (reduce) return 0;
    const t = (p - start) / (end - start);
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    return 1 - t;
  };

  // mount 时立即用当前 progress 写一次（处理用户加载即在 Signature 区中的情形）
  useEffect(() => {
    dashoffset.set(computeOffset(progress.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 滚动时持续更新
  // 仅在第一笔（start === 0）打印日志，避免 9 倍噪音
  const isFirst = start === 0;
  useMotionValueEvent(progress, 'change', (p) => {
    if (isFirst) console.log('[Signature] progress:', p.toFixed(3));
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
