'use client';

import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import SectionTitle from './SectionTitle';

type Keyword = {
  letter: string;
  index: string;
  title: string;
  heading: string;
  desc: string;
};

const KEYWORDS: readonly Keyword[] = [
  {
    letter: 'J',
    index: '01',
    title: 'Judgment',
    heading: '判断力是 PM 的核心武器。',
    desc: '面对模糊需求、不确定技术、有限资源，我做的每一个决策都建立在对用户、对业务、对 AI 能力边界的清醒判断之上。',
  },
  {
    letter: 'A',
    index: '02',
    title: 'Augmented',
    heading: '用 AI 把自己放大十倍。',
    desc: 'Prompt Engineering、工作流搭建、AI 辅助设计与写作——我不是在用工具，我是在用 AI 重新定义一个人能完成的工作量级。',
  },
  {
    letter: 'S',
    index: '03',
    title: 'Shipping',
    heading: '想法不落地等于零。',
    desc: '从需求定义到原型验证，从工作流搭建到产品上线，我习惯把事情做完，而不只是做好看的 PPT。',
  },
  {
    letter: 'O',
    index: '04',
    title: 'Orchestrate',
    heading: '把 LLM、RAG、Agent 串成真正能跑的系统。',
    desc: 'Coze、Dify、Prompt 链路——我做的不是单点 AI 功能，是能接进业务的完整工作流。',
  },
  {
    letter: 'N',
    index: '05',
    title: 'Native',
    heading: 'AI Native 不是标签，是思维方式。',
    desc: '我从产品视角理解模型能力边界，从工程视角评估实现路径，在两者之间找到真正可交付的解法。',
  },
  {
    letter: 'D',
    index: '06',
    title: 'Doing',
    heading: '想清楚就开干，不等完美方案。',
    desc: '不停留在 PPT 与白板，直接动手做 Demo、跑工作流、推上线——把想法变成能跑的东西，是我对自己最低的要求。',
  },
];

const TOTAL = KEYWORDS.length;
const HALF = Math.ceil(TOTAL / 2);

export default function AboutMe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // 起点提前到 wrapper 顶部刚进视口底部，AboutMe 还在向上滚时字母就开始入场
    offset: ['start end', 'end end'],
  });

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx !== null ? KEYWORDS[activeIdx] : null;
  const leftCol = KEYWORDS.slice(0, HALF);
  const rightCol = KEYWORDS.slice(HALF);

  // section 总高：160vh → pin 1 屏 + 滚动 0.6 屏触发字母滑入，避免末尾空滚
  const SCROLL_VH = 160;

  return (
    <section
      data-dot-depression-zone
      ref={wrapperRef}
      style={{
        position: 'relative',
        height: `${SCROLL_VH}vh`,
        backgroundColor: 'transparent',
        color: 'var(--color-ink)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '5.5vh clamp(80px, 16vw, 240px) 8vh',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle 120px at var(--dot-press-x, -200px) var(--dot-press-y, -200px), rgba(255,90,26,0.18), transparent 62%), radial-gradient(rgba(10,10,10,0.08) 1px, transparent 1px)',
            backgroundBlendMode: 'multiply',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
            zIndex: 0,
            WebkitMaskImage:
              'linear-gradient(180deg, transparent 0%, #000 14%, #000 82%, transparent 100%)',
            maskImage:
              'linear-gradient(180deg, transparent 0%, #000 14%, #000 82%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255,90,26,0.55) 1.6px, transparent 2.2px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0',
            pointerEvents: 'none',
            zIndex: 0,
            WebkitMaskImage:
              'radial-gradient(circle 110px at var(--dot-press-x, -300px) var(--dot-press-y, -300px), #000 0%, rgba(0,0,0,0.6) 55%, transparent 100%)',
            maskImage:
              'radial-gradient(circle 110px at var(--dot-press-x, -300px) var(--dot-press-y, -300px), #000 0%, rgba(0,0,0,0.6) 55%, transparent 100%)',
          }}
        />

        <header style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: '4vh' }}>
          <SectionTitle style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', lineHeight: 1 }}>
            ABOUT ME
          </SectionTitle>
          <p
            style={{
              marginTop: '24px',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--color-muted)',
              maxWidth: '620px',
              marginInline: 'auto',
            }}
          >
            {TOTAL} 个字母，是关于我的 {TOTAL} 个关键词，让你更快了解我。
          </p>
        </header>

        <div
          className="aboutme-grid"
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(19vw, auto) 1fr minmax(19vw, auto)',
            gap: '3.4vw',
            alignItems: 'center',
          }}
        >
          <LetterColumn
            items={leftCol}
            startIndex={0}
            activeIdx={activeIdx}
            setActiveIdx={setActiveIdx}
            side="left"
            progress={scrollYProgress}
          />
          <InfoPanel active={active} />
          <LetterColumn
            items={rightCol}
            startIndex={HALF}
            activeIdx={activeIdx}
            setActiveIdx={setActiveIdx}
            side="right"
            progress={scrollYProgress}
          />
        </div>
      </div>
    </section>
  );
}

function LetterColumn({
  items,
  startIndex,
  activeIdx,
  setActiveIdx,
  side,
  progress,
}: {
  items: readonly Keyword[];
  startIndex: number;
  activeIdx: number | null;
  setActiveIdx: (i: number | null) => void;
  side: 'left' | 'right';
  progress: MotionValue<number>;
}) {
  const alignSelf = side === 'left' ? 'flex-end' : 'flex-start';

  return (
    <ul
      style={{
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(2vh, 5vh, 6vh)',
        padding: 0,
        margin: 0,
        alignItems: alignSelf,
      }}
    >
      {items.map((kw, i) => {
        const idx = startIndex + i;
        const isActive = activeIdx === idx;
        return (
          <Letter
            key={kw.letter + idx}
            kw={kw}
            idx={idx}
            indexInColumn={i}
            isActive={isActive}
            anyActive={activeIdx !== null}
            onActivate={() => setActiveIdx(idx)}
            onDeactivate={() => setActiveIdx(null)}
            onToggle={() => setActiveIdx(isActive ? null : idx)}
            side={side}
            progress={progress}
          />
        );
      })}
    </ul>
  );
}

function Letter({
  kw,
  indexInColumn,
  isActive,
  anyActive,
  onActivate,
  onDeactivate,
  onToggle,
  side,
  progress,
}: {
  kw: Keyword;
  idx: number;
  indexInColumn: number;
  isActive: boolean;
  anyActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
  side: 'left' | 'right';
  progress: MotionValue<number>;
}) {
  // 滑入进度区间（总进度 0~1）：从 0 起立刻开始动，错开收尾，每一刻都有动效
  // L0: 0    → 0.45
  // L1: 0.18 → 0.63
  // L2: 0.36 → 0.81
  const start = indexInColumn * 0.1;
  const end = start + 0.32;
  const fromX = side === 'left' ? '-110vw' : '110vw';
  const x = useTransform(progress, [start, end], [fromX, '0vw']);

  return (
    <motion.li
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onClick={onToggle}
      style={{
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        x,
        willChange: 'transform, opacity',
      }}
    >
      <motion.span
        animate={{
          scale: isActive ? 1.08 : 1,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(4rem, 9vw, 8rem)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          color: anyActive ? (isActive ? 'var(--color-ink)' : 'rgba(10,10,10,0.22)') : 'var(--color-ink)',
          transition: 'color 0.3s ease',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {kw.letter}
      </motion.span>

      {/* 关键词标题：绝对定位在字母外侧 */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key="label"
            initial={{ opacity: 0, x: side === 'left' ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: side === 'left' ? 12 : -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [side === 'left' ? 'right' : 'left']: 'calc(100% + 24px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
              letterSpacing: '-0.01em',
              color: 'var(--color-accent)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {kw.title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function InfoPanel({ active }: { active: Keyword | null }) {
  return (
    <div style={{ minHeight: 'clamp(220px, 32vh, 320px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key={active.letter + active.index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center', maxWidth: '480px' }}
          >
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)', lineHeight: 1.4, color: 'var(--color-ink)', margin: 0 }}>
              {active.heading}
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.8, color: 'var(--color-muted)', margin: 0 }}>
              {active.desc}
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.25em', color: 'var(--color-muted)', textTransform: 'uppercase', textAlign: 'center' }}
          >
            悬停字母 · Hover a letter
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
