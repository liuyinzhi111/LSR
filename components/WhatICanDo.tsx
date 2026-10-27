'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import SectionTitle from './SectionTitle';
import DotField from './DotField';

import { SKILLS } from './portfolio-content';

const getRelativeIndex = (index: number, active: number, total: number) => {
  const raw = index - active;
  if (raw > total / 2) return raw - total;
  if (raw < -total / 2) return raw + total;
  return raw;
};

export default function WhatICanDo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const observer = new ResizeObserver(([entry]) => setCarouselWidth(entry.contentRect.width));
    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // 滚动进度 → 激活卡片索引。标题 pin 后留首尾缓冲。
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
    if (activeRef.current !== idx) {
      activeRef.current = idx;
      setActive(idx);
    }
  });

  // 140vh 的固定区间保留四张卡的原轮转顺序，减少连续滚动距离。
  const SCROLL_VH = 240;

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
        <DotField color="var(--color-border)" fadeIn="12%" fadeOut="84%" />

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
          ref={carouselRef}
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
                  x: `calc(-50% + ${relative * carouselWidth * 0.28}px)`,
                  y: '-50%',
                  z: isCenter ? 180 : Math.abs(relative) === 1 ? 0 : -220,
                  rotateY: relative * -46,
                  scale: isCenter ? 1 : 0.82,
                  opacity: isVisible ? (isCenter ? 1 : 0.42) : 0,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.8 }}
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
