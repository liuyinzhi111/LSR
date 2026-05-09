'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import SectionTitle from './SectionTitle';

type Skill = {
  idx: string;
  title: string;
  desc: string;
  tags: readonly string[];
};

const SKILLS: readonly Skill[] = [
  {
    idx: '01',
    title: 'AI 产品设计',
    desc: '从用户需求出发，定义 AI 功能的交互逻辑与体验边界，让模型能力真正服务于业务场景，而不是技术展示。',
    tags: ['PRD', 'User Story', 'AI UX'],
  },
  {
    idx: '02',
    title: '工作流搭建',
    desc: '基于 Coze 与 Dify 搭建多节点 Agent 工作流，把 LLM、RAG、工具调用串成稳定可复用的业务链路，让非技术团队也能跑通 AI 流程。',
    tags: ['Coze', 'Dify', 'RAG', 'Agent'],
  },
  {
    idx: '03',
    title: 'Prompt Engineering',
    desc: '不只是写提示词，而是设计完整的 Prompt 结构——角色定义、上下文注入、输出约束、边界处理，让模型稳定输出可用结果。',
    tags: ['Prompt Design', 'Few-shot', 'CoT'],
  },
  {
    idx: '04',
    title: '模型评测 & AI 设计',
    desc: '用可量化的评测框架判断模型优劣，同时能用 AI 工具完成设计、写作、视频内容的生产，从评估到交付全链路自己跑通。',
    tags: ['Benchmark', 'Midjourney', 'Runway'],
  },
];

const getRelativeIndex = (index: number, active: number, total: number) => {
  const raw = index - active;
  if (raw > total / 2) return raw - total;
  if (raw < -total / 2) return raw + total;
  return raw;
};

export default function WhatICanDo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const [active, setActive] = useState(0);

  // 愑动进度 → 激活卡片索引。标题 pin 后留首尾缓冲。
  // 0~0.10  : 锁屏、卡 0
  // 0.10~0.85 : 平均射入 4 张卡
  // 0.85~1   : 卡 3、准备离开
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let idx: number;
    if (v <= 0.1) idx = 0;
    else if (v >= 0.85) idx = SKILLS.length - 1;
    else {
      const local = (v - 0.1) / 0.75; // 0 → 1
      idx = Math.min(SKILLS.length - 1, Math.floor(local * SKILLS.length));
    }
    setActive((prev) => (prev === idx ? prev : idx));
  });

  // section 总高度：pin 时长 = (SCROLL_VH - 100)vh。这里 4 张卡片 → 给 300vh 足够轮转
  const SCROLL_VH = 300;

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
          padding: '0 8vw',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle 120px at var(--dot-press-x, -200px) var(--dot-press-y, -200px), rgba(255,90,26,0.18), transparent 62%), radial-gradient(var(--color-border) 1px, transparent 1px)',
            backgroundBlendMode: 'multiply',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
            zIndex: 0,
            WebkitMaskImage:
              'linear-gradient(180deg, transparent 0%, #000 12%, #000 84%, transparent 100%)',
            maskImage:
              'linear-gradient(180deg, transparent 0%, #000 12%, #000 84%, transparent 100%)',
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

        <header
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            paddingTop: '64px',
            paddingBottom: '16px',
          }}
        >
          <SectionTitle>
            WHAT I CAN DO
          </SectionTitle>
          <p
            style={{
              marginTop: '16px',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--color-muted)',
            }}
          >
            从 AI 产品设计、工作流搭建到 Prompt 工程，提供多维度的专业能力储备。
          </p>
        </header>

        <div
          className="skills-carousel"
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            perspective: '1400px',
            transformStyle: 'preserve-3d',
          }}
        >
          {SKILLS.map((skill, index) => {
            const relative = getRelativeIndex(index, active, SKILLS.length);
            const isCenter = relative === 0;
            const isVisible = Math.abs(relative) <= 2;

            return (
              <motion.article
                key={skill.idx}
                className="skill-card skill-carousel-card"
                animate={{
                  left: `${50 + relative * 28}%`,
                  x: '-50%',
                  y: '-50%',
                  z: isCenter ? 180 : Math.abs(relative) === 1 ? 0 : -220,
                  rotateY: relative * -46,
                  scale: isCenter ? 1 : 0.82,
                  opacity: isVisible ? (isCenter ? 1 : 0.42) : 0,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 'min(48vw, 560px)',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  padding: '36px 32px',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '24px',
                  transformStyle: 'preserve-3d',
                  pointerEvents: isVisible ? 'auto' : 'none',
                  boxShadow: isCenter ? '0 24px 80px var(--color-border)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    color: 'var(--color-muted)',
                  }}
                >
                  {skill.idx}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                      lineHeight: 1.15,
                      color: 'var(--color-ink)',
                      margin: 0,
                    }}
                  >
                    {skill.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      lineHeight: 1.75,
                      color: 'var(--color-muted)',
                      margin: 0,
                    }}
                  >
                    {skill.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    color: 'var(--color-accent)',
                    textTransform: 'uppercase',
                  }}
                >
                  {skill.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* 进度指示：01 / 04 */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            paddingBottom: '40px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'var(--color-muted)',
          }}
        >
          {SKILLS[active].idx} / {String(SKILLS.length).padStart(2, '0')}
        </div>
      </div>
    </section>
  );
}
