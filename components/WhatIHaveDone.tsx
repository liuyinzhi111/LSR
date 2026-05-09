'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import SectionTitle from './SectionTitle';

type Project = {
  index: string;
  category: string;
  title: string;
  desc: string;
  tags: readonly string[];
  image: string;
  url: string;
};

const PROJECTS: readonly Project[] = [
  {
    index: '01',
    category: 'AI · INTERACTIVE NARRATIVE',
    title: '失色纪·修钟人',
    desc: '一款纯前端实现的网页互动文字冒险游戏。用 HTML/CSS/JS 从零构建完整游戏引擎——剧情分支、状态管理、关卡系统、攻略演示，全部自己跑通。它不是模板套壳，是一个能玩的东西。',
    tags: ['HTML', 'CSS', 'JS', 'Game Design', 'Narrative'],
    image: '/images/project1.jpg',
    url: '/XM/Harrygame-main/index.html',
  },
  {
    index: '02',
    category: 'AI · WEB ENGINEERING · FPS',
    title: '网页第一人称射击',
    desc: '用纯前端 + Three.js 在浏览器里造了一个 3D 世界。准星系统、HUD 界面、第一人称视角控制——这件事的意义不在于游戏本身，在于证明 Web 能做到多少人以为它做不到的事。',
    tags: ['Three.js', 'WebGL', 'HUD', '3D', 'Frontend'],
    image: '/images/project2.jpg',
    url: '/XM/CFyouxi.html',
  },
  {
    index: '03',
    category: 'PRODUCT · BRD',
    title: '灵频 · 玄学社交产品商业规划',
    desc: '面向 18~28 岁 Z 世代，用玄学语言匹配同频陌生人的社交产品。从市场洞察、用户模型到商业路径，完整输出一份 BRD——不是为了好看，是为了验证一个反常识的产品逻辑能不能成立。',
    tags: ['BRD', 'Market Research', 'Z-Gen', 'Social Product'],
    image: '/images/project3.jpg',
    url: '/XM/lingpin_BRD.html',
  },
  {
    index: '04',
    category: 'PRODUCT · KNOWLEDGE SYSTEM',
    title: '产品经理全流程作战地图',
    desc: '把产品经理从需求到上线的完整方法论，做成一个可交互的可视化知识库页面。不是文档，是一张能点击、能导航、能被真正用起来的工作地图。',
    tags: ['Interactive', 'PM Methodology', 'Visualization', 'HTML'],
    image: '/images/project4.jpg',
    url: '/XM/ai-pm-qieman-academy/index.html',
  },
];

export default function WhatIHaveDone() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  // section 的总滚动高度，独立于动画节奏，避免末尾出现空滚动停顿
  const SCROLL_VH = 300;

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
  // 拉大每张卡片的滚动占比，让动画占据绝大部分 section 滚动距离
  // 最后一张卡片在 进度 ~0.85 处完成，留 ~0.15 作为小尾巴过渡到下一块
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
