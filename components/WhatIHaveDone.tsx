'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import SectionTitle from './SectionTitle';

import { PROJECTS, type Project } from './portfolio-content';

export default function WhatIHaveDone() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // section 的总滚动高度，独立于动画节奏，避免末尾出现空滚动停顿
  const SCROLL_VH = 220;

  return (
    <section
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
        }}
      >
        {/* 装饰圆 */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-240px',
              left: '-220px',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-220px',
              bottom: '-240px',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%)',
            }}
          />
        </div>

        {/* 标题 */}
        <header
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            paddingTop: '80px',
            paddingBottom: '24px',
          }}
        >
          <SectionTitle>
            WHAT I HAVE DONE
          </SectionTitle>
          <p
            style={{
              padding: '16px 8vw 0',
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--color-muted)',
              margin: 0,
            }}
          >
            这些是我已经跑通、做完、交付过的产品与实验项目。
          </p>
          <p
            style={{
              padding: '8px 8vw 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              lineHeight: 1.6,
              letterSpacing: '0.12em',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            点击项目卡片 · 可直接体验
          </p>
        </header>

        {/* 卡片堆叠舞台 */}
        <div style={{ position: 'relative', flex: 1, width: '100%' }}>
          {PROJECTS.map((project, i) => (
            <StackedCard
              key={project.index}
              project={project}
              i={i}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackedCard({
  project,
  i,
  progress,
}: {
  project: Project;
  i: number;
  progress: MotionValue<number>;
}) {
  // 保留四张卡片的原叠放顺序；最后一张在进度 0.63 处完成，余量用于衔接下一段。
  const SLIDE_STEP = 0.2;
  const SLIDE_DUR = 0.25;
  const start = -0.22 + i * SLIDE_STEP;
  const end = start + SLIDE_DUR;

  // 注意：framer-motion 不能在 % 与 px 之间插值，两端必须同单位，这里统一用 px
  const PEEK = 64;
  const ENTER_FROM = 600; // 屏幕外下方起始点
  const y = useTransform(progress, [start, end], [ENTER_FROM, i * PEEK]);

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        position: 'absolute',
        top: 'calc(50% - 240px)',
        left: '50%',
        translateX: '-50%',
        y,
        width: 'min(84vw, 1100px)',
        zIndex: i + 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-bg)',
        backgroundImage: 'none',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '40px 48px',
        boxShadow: '0 -10px 30px rgba(10, 10, 10, 0.05), 0 24px 80px rgba(10, 10, 10, 0.08)',
        transition: 'border-color 0.3s ease, border-width 0.3s ease',
      }}
    >
      <span
        className="project-index"
        style={{
          width: '80px',
          flexShrink: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 800,
          lineHeight: 1,
          color: 'var(--color-accent)',
          opacity: 0.2,
        }}
      >
        {project.index}
      </span>

      <div className="project-content" style={{ flex: 1, padding: '0 40px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {project.category}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            lineHeight: 1.25,
            color: 'var(--color-ink)',
            margin: '12px 0',
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            lineHeight: 1.8,
            color: 'var(--color-muted)',
            margin: 0,
          }}
        >
          {project.desc}
        </p>
        <p
          style={{
            marginTop: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            lineHeight: 1.7,
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
          }}
        >
          {project.tags.join(' · ')}
        </p>
      </div>

      <div
        className="project-image-wrap"
        style={{
          width: '280px',
          flexShrink: 0,
          height: '180px',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="project-image"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>
    </motion.a>
  );
}
