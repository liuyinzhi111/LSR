'use client';

import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BigMarquee from './BigMarquee';

const NAV_HEIGHT = 60;
const RESUME_URL = '/resume/AI%E4%BA%A7%E5%93%81%E7%BB%8F%E7%90%86.pdf';
const RESUME_DOWNLOAD_NAME = '刘盛瑞_AI产品经理_简历.pdf';

export default function Hero() {
  // wrapper 是文档流中的非 sticky 占位容器（高 100vh），随页面正常滚动；
  // useScroll 监听它能拿到真实进度。motion.div 在 wrapper 内 sticky，
  // sticky 范围被父级 100vh 严格限定，wrapper 滚出后 Hero 自然脱离视口。
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  });

  // 前 20% 滚动内淡出 → [0, 0.2] → [1, 0]
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  // 同步切换 pointer-events：opacity 归 0 后让位下方内容接收交互
  const pointerEvents = useTransform(scrollYProgress, (v) =>
    v >= 0.2 ? 'none' : 'auto',
  );

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', height: '100vh' }}
    >
      <motion.div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-bg)',
          opacity,
          pointerEvents,
        }}
      >
      {/* 顶部固定导航（position: fixed，脱离 flex 流）*/}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: NAV_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 50,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.15em',
            color: 'var(--color-ink)',
          }}
        >
          JASON
        </span>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'transparent',
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--color-ink)',
            border: '1px solid var(--color-ink)',
            borderRadius: '999px',
            padding: '6px 14px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            lineHeight: 1,
            textDecoration: 'none',
          }}
        >
          下载简历
        </a>
      </nav>

      {/* Hero 背景跑马灯：视频裁切露出 Hero 时立即可见 */}
      <BigMarquee />

      {/* 顶部标题块：避开中央视频窗口，贴近视口上部（在跑马灯下方）*/}
      <div
        style={{
          position: 'absolute',
          top: '15vh',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.85rem',
          textAlign: 'center',
          padding: '0 32px',
          width: 'max-content',
          maxWidth: '92vw',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.32em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
          }}
        >
          — ROLE —
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.05rem, 2.6vw, 1.6rem)',
            letterSpacing: '0.18em',
            color: 'var(--color-ink)',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          AI PRODUCT MANAGER
        </h2>
      </div>

      {/* 底部副标题块：避开中央视频窗口，贴近视口下部（在跑马灯上方）*/}
      <div
        style={{
          position: 'absolute',
          bottom: '14vh',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem',
          textAlign: 'center',
          padding: '0 32px',
          width: 'max-content',
          maxWidth: '92vw',
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          color: 'var(--color-ink)',
          lineHeight: 1.4,
        }}
      >
        <span style={{ letterSpacing: '0.04em' }}>Prompt to Product</span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'var(--color-ink)',
            marginTop: '4px',
          }}
        >
          Human × AI
        </span>
      </div>

      </motion.div>
    </div>
  );
}
