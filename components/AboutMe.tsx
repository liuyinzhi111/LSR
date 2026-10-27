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
import DotField from './DotField';

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
    heading: '用真实问题，判断 AI 的价值。',
    desc: '从用户需求和现有流程出发，结合具体任务比较效果、成本与可控性，判断一项新的 AI 能力适合解决什么问题。',
  },
  {
    letter: 'A',
    index: '02',
    title: 'Augmented',
    heading: '让 AI 成为日常工作的协作者。',
    desc: '我把 AI 用在信息研究、原型搭建和内容创作中，持续调整人与工具的分工，让目标、上下文和验收标准更清楚。',
  },
  {
    letter: 'S',
    index: '03',
    title: 'Shipping',
    heading: '把想法推进成可用的结果。',
    desc: '我有用户研究、方案设计、研发协同和上线迭代的实践，也会借助 AI 将关键设想做成可体验的原型，尽早发现问题、验证方向。',
  },
  {
    letter: 'O',
    index: '04',
    title: 'Orchestrate',
    heading: '把模型、工具和知识组织成工作流。',
    desc: '围绕具体任务，连接模型、知识库与工具，把反复使用的方法沉淀成流程和 Skill，减少每次从头摸索。',
  },
  {
    letter: 'N',
    index: '05',
    title: 'Native',
    heading: '持续跟进前沿，持续更新判断。',
    desc: '研究新模型、Agent 和开源项目，关注它们的能力边界与适用条件，再判断哪些变化值得带入自己的工作。',
  },
  {
    letter: 'D',
    index: '06',
    title: 'Documenting',
    heading: '把实践变成可复用的经验。',
    desc: '记录学习与实践中的问题、过程和判断，整理成可检索的知识和通俗的 AI 内容，让经验能够被自己复用，也能被别人理解。',
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
        <DotField color="rgba(10,10,10,0.08)" fadeIn="14%" fadeOut="82%" />

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
      onClick={() => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) onActivate();
        else onToggle();
      }}
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
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(4rem, 9vw, 8rem)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          color: anyActive ? (isActive ? 'var(--color-ink)' : 'rgba(10,10,10,0.22)') : 'var(--color-ink)',
          transition: 'color 0.16s ease',
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
            transition={{ duration: 0.16, ease: 'easeOut' }}
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
    <div style={{ minHeight: 'clamp(220px, 32vh, 320px)', display: 'grid', alignItems: 'center', justifyItems: 'center' }}>
      <AnimatePresence mode="sync" initial={false}>
        {active ? (
          <motion.div
            key={active.letter + active.index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ gridArea: '1 / 1', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center', maxWidth: '480px' }}
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
            transition={{ duration: 0.14 }}
            style={{ gridArea: '1 / 1', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.25em', color: 'var(--color-muted)', textTransform: 'uppercase', textAlign: 'center' }}
          >
            悬停字母 · Hover a letter
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
