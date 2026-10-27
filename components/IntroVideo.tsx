'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { COMPACT_QUERY } from './responsive';

/**
 * IntroVideo —— 开场动画结束后、Hero 之前的覆盖层视频。
 *
 * 转场效果：随滚动进度，视频被 clip-path 从四周向中心裁切，
 * 露出下方 Hero 页；最终只剩屏幕中心一块 SQUARE 边长的小正方形，
 * 随后 sticky 结束，视频被带出视口。
 *
 * 网页播放：/public/videos/intro-web.mp4；原始文件 intro.mp4 保留不变。
 */
export default function IntroVideo({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [viewBox, setViewBox] = useState('0 0 1000 400');

  // 开场期间短暂预解码；正式播放后按可见性启停。
  useEffect(() => {
    if (window.matchMedia(COMPACT_QUERY).matches) return;
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;
    let introComplete = !document.getElementById('intro');
    let inView = wrapper.getBoundingClientRect().bottom > 0;
    let prepared = false;
    let preparing = false;
    let warmupFrame = 0;
    let warmupTimer = 0;
    let disposed = false;
    const cancelWarmup = () => {
      if (warmupFrame) video.cancelVideoFrameCallback?.(warmupFrame);
      window.clearTimeout(warmupTimer);
      warmupFrame = 0;
      warmupTimer = 0;
      preparing = false;
    };
    const finishWarmup = () => {
      cancelWarmup();
      if (disposed || introComplete) return;
      prepared = true;
      video.pause();
      // 只在开场遮罩内预解码，正式展示仍从原片第一帧开始。
      video.currentTime = 0;
    };
    const prepareDecoder = () => {
      if (disposed || introComplete || prepared || preparing || document.hidden || !inView || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      preparing = true;
      void video.play().then(() => {
        if (disposed || !preparing || introComplete) return;
        if (video.requestVideoFrameCallback) warmupFrame = video.requestVideoFrameCallback(finishWarmup);
        warmupTimer = window.setTimeout(finishWarmup, 200);
      }).catch(() => { cancelWarmup(); });
    };
    const syncPlayback = () => {
      if (document.hidden || !inView) {
        cancelWarmup();
        video.pause();
      } else if (!introComplete) {
        prepareDecoder();
      } else if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        void video.play().catch(() => {});
      }
    };
    const onIntroComplete = () => { introComplete = true; cancelWarmup(); syncPlayback(); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(wrapper);
    window.addEventListener('intro-animation-complete', onIntroComplete);
    document.addEventListener('visibilitychange', syncPlayback);
    video.addEventListener('loadeddata', prepareDecoder);
    video.addEventListener('canplay', syncPlayback);
    // The SSR video has preload=none, so phones do not download the hidden desktop video.
    video.preload = 'auto';
    syncPlayback();
    return () => {
      disposed = true;
      cancelWarmup();
      observer.disconnect();
      window.removeEventListener('intro-animation-complete', onIntroComplete);
      document.removeEventListener('visibilitychange', syncPlayback);
      video.removeEventListener('loadeddata', prepareDecoder);
      video.removeEventListener('canplay', syncPlayback);
      video.pause();
    };
  }, []);

  const { scrollYProgress: pinProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });
  // 按实际固定区间推进；保留原关键帧比例，让缩短后的区间仍完整播完签名与落款。
  const scrollYProgress = useTransform(pinProgress, [0, 1], [0, 5 / 6]);

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
      .then((r) => { if (!r.ok) throw new Error('Signature unavailable'); return r.text(); })
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

  // 原关键帧范围保留为 0 → 5/6；现在映射到 300vh 容器中的 200vh 固定区间。
  // 0.83 处落款完成，再继续滚动才会离开固定区间。
  const insetH = useTransform(scrollYProgress, [0, 0.32, 1], [0, insets.h, insets.h]);
  const insetV = useTransform(scrollYProgress, [0, 0.32, 1], [0, insets.v, insets.v]);
  // 初始无圆角（视频铺满），随裁切进度 0→0.32 圆角从 0 渐变到 28px
  const radius = useTransform(scrollYProgress, [0, 0.08, 0.32, 1], [0, 0, 28, 28]);
  // 未滚动时视频完全铺满，不施加无意义的全屏裁切，允许直接合成视频帧。
  const clipPath = useTransform([insetV, insetH, radius], ([v, h, r]: number[]) =>
    v === 0 && h === 0 && r === 0 ? 'none' : `inset(${v}px ${h}px ${v}px ${h}px round ${r}px)`
  );
  const heroVisibility = useTransform(scrollYProgress, (progress) => progress <= 0 ? 'hidden' : 'visible');
  const overlayOpacity = useTransform(scrollYProgress, [0.28, 0.40], [0, 0.82]);
  const overlayVisibility = useTransform(overlayOpacity, (opacity) => opacity === 0 ? 'hidden' : 'visible');
  const signatureOpacity = useTransform(scrollYProgress, [0.28, 0.36], [0, 1]);
  const signatureY = useTransform(scrollYProgress, [0.28, 0.36], [18, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.78, 0.83], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.78, 0.83], [12, 0]);
  return (
    <div ref={wrapperRef} data-intro-video style={{ position: 'relative', height: '300vh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            // 全屏视频遮住时不绘制大型跑马灯；开始裁切后原样露出。
            visibility: heroVisibility,
          }}
        >
          {children}
        </motion.div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
        {/* 阴影跟随原裁切边界；独立绘制，避免对视频每一帧执行两遍 drop-shadow。 */}
        <motion.div
          style={{
            position: 'absolute',
            top: insetV,
            bottom: insetV,
            left: insetH,
            right: insetH,
            borderRadius: radius,
            boxShadow: '0 24px 96px rgba(0,0,0,0.45), 0 4px 24px rgba(0,0,0,0.25)',
          }}
        />
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
            ref={videoRef}
            src="/videos/intro-web.mp4"
            muted
            loop
            playsInline
            preload="none"
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
            visibility: overlayVisibility,
            pointerEvents: 'none',
            // 用同一个 clipPath 让灰色蒙版只覆盖视频窗口区域。
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

  const computeOffset = useCallback((p: number): number => {
    const t = (p - start) / (end - start);
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    return 1 - t;
  }, [start, end]);

  useEffect(() => {
    dashoffset.set(computeOffset(progress.get()));
  }, [computeOffset, dashoffset, progress]);

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
